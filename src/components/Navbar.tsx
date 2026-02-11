"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // 🔧 Sera's Fix #3: Auto-close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

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
            height: 60px;
            display: flex;
            align-items: center;
        }

        .navbar-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
        }

        .logo {
            font-size: 1.25rem;
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

        /* Mobile Menu Button */
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: #fff;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 8px;
            line-height: 1;
            transition: transform 0.2s;
        }
        .mobile-menu-btn:active {
            transform: scale(0.95);
        }

        /* 🎨 Sera's Fix #2: Remove gap in mobile menu */
        .mobile-menu-dropdown {
            position: absolute;
            top: 56px;
            left: 0;
            right: 0;
            width: 100%;
            background: rgba(18, 18, 18, 0.98);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            flex-direction: column;
            padding: 0;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            display: flex;
            animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 40;
        }

        @keyframes slideDown {
            from { 
                opacity: 0; 
                transform: translateY(-8px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        .mobile-link {
            padding: 18px 24px;
            color: #ccc;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: block;
            text-align: left;
            transition: all 0.2s;
        }
        .mobile-link:last-child { 
            border-bottom: none; 
        }
        .mobile-link:hover { 
            background: rgba(255, 255, 255, 0.05); 
            color: #fff; 
            padding-left: 28px;
        }
        .mobile-link.highlight { 
            color: var(--primary); 
            font-weight: 600;
        }
        .mobile-link.gold { 
            color: #FFD700; 
            font-weight: 600;
        }
        .mobile-link.logout { 
            color: #ff6b6b; 
            width: 100%; 
            text-align: left; 
            background: none; 
            border: none; 
            cursor: pointer; 
            font-weight: 600;
        }

        /* 📱 Responsive - Sera's Fix #1: Better mobile alignment */
        @media (max-width: 768px) {
            .navbar {
                height: 56px;
            }
            .navbar-container {
                padding: 0 16px;
            }
            .logo {
                font-size: 1.1rem;
            }
            .desktop-menu {
                display: none;
            }
            .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
      `}</style>
        </nav>
    );
}
