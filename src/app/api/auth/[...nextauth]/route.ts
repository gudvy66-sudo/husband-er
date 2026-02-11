
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
                // Naver returns: 'M' (Male), 'F' (Female), 'U' (Unknown)
                if (gender !== "M") {
                    // console.log("Blocked: Not a male user", gender);
                    return "/login?error=GenderAccessDenied"; // Redirect with error
                }

                try {
                    // Sync User to Firestore
                    const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase"); // Dynamic import to avoid build issues

                    const userRef = doc(db, "users", user.id);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        // Create New User
                        await setDoc(userRef, {
                            uid: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            gender: gender,
                            role: "user", // Default
                            status: "active",
                            createdAt: serverTimestamp(),
                            lastLogin: serverTimestamp(),
                        });
                    } else {
                        // Update Last Login
                        await setDoc(userRef, {
                            lastLogin: serverTimestamp(),
                            name: user.name, // Update name if changed
                            image: user.image
                        }, { merge: true });

                        // Check if banned
                        if (userSnap.data().status === "banned") {
                            return "/login?error=BannedUser";
                        }
                    }
                } catch (error) {
                    console.error("Firestore Sync Error:", error);
                    // Allow login even if sync fails? Or block?
                    // Let's allow for now but log error
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
                token.accessToken = account?.access_token;

                // If user is from DB, we might want to fetch role fresh from DB?
                // For performance, we stick to initial load or rely on session refresh.
                // But for specific admin checks, we might trust the token for now.

                // If syncing happened in signIn, we don't have the DB role in 'user' object immediately 
                // unless we fetch it here.
                // Let's do a quick fetch for role if it's Naver login to ensure role is up-to-date
                if (account?.provider === "naver") {
                    try {
                        const { doc, getDoc } = await import("firebase/firestore");
                        const { db } = await import("@/lib/firebase");
                        const userSnap = await getDoc(doc(db, "users", user.id));
                        if (userSnap.exists()) {
                            token.role = userSnap.data().role;
                        }
                    } catch (e) { }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
