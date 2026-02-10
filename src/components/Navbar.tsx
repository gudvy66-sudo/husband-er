"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="navbar fixed top-0 w-full flex justify-between items-center p-6 glass-effect bg-opacity-80 backdrop-blur-md z-50 border-b border-[#333]">
            <Link href="/" className="logo text-2xl font-bold tracking-tighter text-[var(--primary)] animate-pulse">
                <span>🚨</span> 남편응급실.
            </Link>

            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {status === "loading" ? (
                    /* Loading State: Invisible Placeholder */
                    <div style={{ width: "100px", height: "30px" }}></div>
                ) : session ? (
                    <>
                        <Link href="/community" className="nav-link" style={{ color: "var(--primary)" }}>
                            📋 게시판
                        </Link>
                        <Link href="/profile" className="nav-link" style={{ color: "#FFD700" }}>
                            🏆 내정보
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="nav-link btn-secondary"
                            style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #444" }}
                        >
                            🚪 로그아웃
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="nav-link btn-secondary" style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #444" }}>
                        🔑 로그인 / 회원가입
                    </Link>
                )}
            </div>

            <style jsx>{`
        .navbar {
            padding: 16px 40px;
            background: rgba(18, 18, 18, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            height: 70px; /* Fixed height for consistency */
        }

        .logo {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            line-height: 1; /* Reset line-height */
            height: 100%;
        }

        .nav-link {
            text-decoration: none;
            color: #ccc;
            font-weight: 600;
            font-size: 0.95rem;
            transition: color 0.2s;
            cursor: pointer;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            gap: 6px; /* Space between icon and text */
            height: 40px; /* Fixed height touch target */
            line-height: 1;
        }

        .btn-secondary {
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0 20px; /* Use horizontal padding only with fixed height */
            border-radius: 20px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Mobile Styles (from mobile.css) */
        @media (max-width: 768px) {
            .navbar {
                padding: 0 16px !important;
                flex-wrap: nowrap !important;
                gap: 6px;
                height: 60px !important;
            }

            .logo {
                font-size: 1.1rem !important;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .nav-link {
                font-size: 0.75rem !important;
                padding: 0 12px !important;
                white-space: nowrap;
                height: 32px !important;
            }
            
            .btn-secondary {
                height: 32px !important;
                padding: 0 14px !important;
            }
        }
      `}</style>
        </nav>
    );
}
