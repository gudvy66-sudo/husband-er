"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
            router.push("/admin"); // Redirect to admin dashboard
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-box">
                <h1 className="title">🕵️ 관리자(Admin) 접속</h1>
                <p className="subtitle">관계자 외 출입 금지구역입니다.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="관리자 ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="btn-login">접속하기</button>
                </form>

                <p className="hint">
                    (Hint: admin / admin)
                </p>
            </div>

            <style jsx>{`
                .admin-login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #111;
                    color: white;
                }

                .login-box {
                    background: #222;
                    padding: 40px;
                    border-radius: 12px;
                    text-align: center;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid #333;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .title {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: #e74c3c;
                }

                .subtitle {
                    color: #7f8c8d;
                    margin-bottom: 30px;
                    font-size: 0.9rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .input-field {
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #444;
                    background: #333;
                    color: white;
                    font-size: 1rem;
                }
                
                .input-field:focus {
                    outline: none;
                    border-color: #e74c3c;
                }

                .btn-login {
                    padding: 12px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 1rem;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.2s;
                }

                .btn-login:hover {
                    background: #c0392b;
                }

                .error-msg {
                    color: #e74c3c;
                    font-size: 0.85rem;
                }

                .hint {
                    margin-top: 20px;
                    color: #555;
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
}
