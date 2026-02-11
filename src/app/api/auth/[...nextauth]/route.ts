
import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || "",
            clientSecret: process.env.NAVER_CLIENT_SECRET || "",
            // Request gender
            profile(profile) {
                return {
                    id: profile.response.id,
                    name: profile.response.name,
                    email: profile.response.email,
                    image: profile.response.profile_image,
                    gender: profile.response.gender, // 'M' or 'F' or 'U'
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Mock user for testing
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return { id: "admin_uid", name: "관리자", email: "admin@example.com", role: "admin", gender: "M" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error (e.g. AccessDenied)
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // 1. Credentials Login (Admin) -> Pass
            if (account?.provider === "credentials") return true;

            // 2. Naver Login -> Check Gender & Sync Firestore
            if (account?.provider === "naver") {
                const naverProfile = profile as any;
                const gender = naverProfile?.response?.gender || (user as any).gender;

                // Gender Check: Must be 'M' (Male)
                if (gender !== "M") {
                    return "/login?error=GenderAccessDenied";
                }

                try {
                    // Sync User to Firestore
                    const { doc, getDoc, setDoc, serverTimestamp, updateDoc } = await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase");
                    const { generateRandomNickname } = await import("@/utils/nicknameGenerator");

                    const userRef = doc(db, "users", user.id);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        // Create New User with Random Nickname
                        const randomNick = generateRandomNickname();
                        await setDoc(userRef, {
                            uid: user.id,
                            name: user.name, // Real name (Keep private)
                            nickname: randomNick, // Public name
                            email: user.email,
                            image: user.image,
                            gender: gender,
                            role: "user",
                            status: "active",
                            createdAt: serverTimestamp(),
                            lastLogin: serverTimestamp(),
                        });
                        // Update session user name to random nickname immediately (hack for first login)
                        user.name = randomNick;
                    } else {
                        // Existing User
                        const userData = userSnap.data();

                        // If no nickname (legacy user), add one
                        let currentNick = userData.nickname;
                        if (!currentNick) {
                            currentNick = generateRandomNickname();
                            await updateDoc(userRef, { nickname: currentNick });
                        }

                        // Update Last Login
                        await updateDoc(userRef, {
                            lastLogin: serverTimestamp(),
                            image: user.image // Keep image updated
                        });

                        // Check if banned
                        if (userData.status === "banned") {
                            return "/login?error=BannedUser";
                        }

                        // Use nickname for session
                        user.name = currentNick;
                    }
                } catch (error) {
                    console.error("Firestore Sync Error:", error);
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
                token.accessToken = account?.access_token;
                // Preserve nickname if available in user object (from signIn mutation)
                if (user.name) token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.name = token.name || session.user.name; // Use nickname
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
