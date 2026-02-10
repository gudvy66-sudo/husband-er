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
                // Mock login for demo purposes - accept multiple test accounts
                const validUsers = ["admin", "kakao_user", "naver_user", "exam_passed_user"];

                if (
                    credentials?.username &&
                    credentials?.password &&
                    validUsers.includes(credentials.username) &&
                    credentials.username === credentials.password
                ) {
                    return {
                        id: "1",
                        name: credentials.username === "admin" ? "Admin Husband" :
                            credentials.username === "kakao_user" ? "카카오 유부남" :
                                credentials.username === "naver_user" ? "네이버 유부남" :
                                    "Exam Passed Husband",
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
    secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
    session: {
        strategy: "jwt",
    },
    theme: {
        colorScheme: "dark",
    },
});

export { handler as GET, handler as POST };
