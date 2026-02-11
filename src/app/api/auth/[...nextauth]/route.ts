
import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || "",
            clientSecret: process.env.NAVER_CLIENT_SECRET || "",
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
                    return { id: "1", name: "관리자", email: "admin@example.com", role: "admin" }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // First login: Add user info to token
            if (user) {
                token.id = user.id;
                // Preserve role from authorize function (for admin) or default to "user"
                token.role = (user as any).role || "user";
                token.level = 1; // Default level
                token.examPassed = false;
            }
            return token;
        },
        async session({ session, token }) {
            // Pass token info to session so client can see it
            if (session.user) {
                session.user.role = token.role;
                session.user.level = token.level;
                session.user.examPassed = token.examPassed;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
