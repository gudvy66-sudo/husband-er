"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar fixed top-0 w-full glass-effect z-50 border-b border-[#333]">
            <div className="navbar-container">
                <Link href="/" className="logo text-xl font-bold tracking-tighter text-[var(--primary)] animate-pulse" onClick={closeMenu}>
                    <span>🚨</span> 남편응급실
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    {status === "loading" ? (
                        <div style={{ width: "100px", height: "30px" }}></div>
                    ) : session ? (
                        <>
                            <Link href="/" className="nav-link">🏠 홈</Link>
                            <Link href="/community" className="nav-link highlight">📋 게시판</Link>
                            <Link href="/profile" className="nav-link gold">🏆 내정보</Link>
                            <button onClick={() => signOut({ callbackUrl: "/" })} className="nav-btn-secondary">
                                🚪 로그아웃
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="nav-btn-secondary">
                            🔑 로그인 / 회원가입
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="mobile-menu-dropdown">
                    {session ? (
                        <>
                            <Link href="/" className="mobile-link" onClick={closeMenu}>🏠 홈</Link>
                            <Link href="/community" className="mobile-link highlight" onClick={closeMenu}>📋 게시판</Link>
                            <Link href="/profile" className="mobile-link gold" onClick={closeMenu}>🏆 내정보</Link>
                            <button onClick={() => { signOut({ callbackUrl: "/" }); closeMenu(); }} className="mobile-link logout">
                                🚪 로그아웃
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="mobile-link" onClick={closeMenu}>
                            🔑 로그인 / 회원가입
                        </Link>
                    )}
                </div>
            )}

            <style jsx>{`
        .navbar {
            background: rgba(18, 18, 18, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            height: 60px; /* Reduced height */
            display: flex;
            align-items: center;
        }

        .navbar-container {
            width: 100%;
            max-width: 1200px; /* Limit max width for large screens */
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.25rem; /* Slightly smaller logo */
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }

        /* Desktop Menu */
        .desktop-menu {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .nav-link {
            text-decoration: none;
            color: #ccc;
            font-weight: 600;
            font-size: 0.9rem;
            transition: color 0.2s;
            cursor: pointer;
            padding: 8px;
        }
        .nav-link:hover { color: #fff; }
        .nav-link.highlight { color: var(--primary); }
        .nav-link.gold { color: #FFD700; }

        .nav-btn-secondary {
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 6px 14px;
            border-radius: 20px;
            background: none;
            color: #ddd;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .nav-btn-secondary:hover {
            border-color: #fff;
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Menu */
        .mobile-menu-btn {
            display: none; /* Hidden by default on desktop */
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 4px;
        }

        .mobile-menu-dropdown {
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background: #1a1a1a;
            border-bottom: 1px solid #333;
            flex-direction: column;
            padding: 10px 0;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            display: none; /* Controlled by React state logic, but CSS class needed for structure */
            display: flex; /* Overridden by conditional rendering in JSX, this is just for style block correctness if always rendered */
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
            padding: 14px 24px;
            color: #ccc;
            text-decoration: none;
            font-size: 1rem;
            border-bottom: 1px solid #2a2a2a;
            display: block;
            text-align: center;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover { background: #2a2a2a; color: #fff; }
        .mobile-link.highlight { color: var(--primary); }
        .mobile-link.gold { color: #FFD700; }
        .mobile-link.logout { color: #ff6b6b; width: 100%; text-align: center; background: none; border: none; cursor: pointer; }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
            .navbar {
                height: 56px; /* Even smaller for mobile */
                padding: 0;
            }
            .navbar-container {
                padding: 0 16px;
            }
            .desktop-menu {
                display: none; /* Hide desktop menu on mobile */
            }
            .mobile-menu-btn {
                display: block; /* Show hamburger on mobile */
            }
        }
      `}</style>
        </nav>
    );
}
