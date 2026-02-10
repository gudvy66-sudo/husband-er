import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Mock Login",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Mock login for demo purposes - accept both admin and exam passers
                if (
                    (credentials?.username === "admin" && credentials?.password === "admin") ||
                    (credentials?.username === "exam_passed_user" && credentials?.password === "exam_passed_user")
                ) {
                    return {
                        id: "1",
                        name: credentials.username === "admin" ? "Admin Husband" : "Exam Passed Husband",
                        email: `${credentials.username}@er.com`
                    };
                }
                return null;
            },
        }),
        // Future: Add KakaoProvider and NaverProvider here
    ],
    pages: {
        signIn: "/login",
    },
    theme: {
        colorScheme: "dark",
    },
});

export { handler as GET, handler as POST };
