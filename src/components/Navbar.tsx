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
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="logo" onClick={closeMenu}>
                    <div className="logo-icon-wrapper">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="6" fill="#FF4757" />
                            <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="logo-text">남편<span className="logo-highlight">응급실</span></span>
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
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 50;
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
            height: 60px;
        }

        .logo {
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
            height: 60px;
            user-select: none;
        }

        .logo-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .logo:hover .logo-icon-wrapper {
            transform: scale(1.1) rotate(-5deg);
        }

        .logo-text {
            font-size: 1.2rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.5px;
            line-height: 1;
        }

        .logo-highlight {
            color: var(--primary);
            font-weight: 800;
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
            text-align: center; /* Center align for better mobile look */
            transition: all 0.2s;
        }
        .mobile-link:last-child { 
            border-bottom: none; 
        }
        .mobile-link:hover { 
            background: rgba(255, 255, 255, 0.05); 
            color: #fff; 
            transform: scale(1.02); /* Subtle scale instead of padding shift */
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
            text-align: center; /* Center logout button too */
            background: none; 
            border: none; 
            cursor: pointer; 
            font-weight: 600;
        }

        /* 📱 Responsive */
        @media (max-width: 768px) {
            .navbar {
                height: 56px;
            }
            .navbar-container {
                padding: 0 16px;
                height: 56px;
            }
            .logo {
                font-size: 1.1rem;
                height: 56px;
            }
            .desktop-menu {
                display: none;
            }
            .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 56px;
                width: 44px;
                font-size: 1.6rem;
            }
        }
      `}</style>
        </nav>
    );
}
