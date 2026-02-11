"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        // Skip auth check for login page
        if (pathname === "/admin/login") return;

        // 1. Not logged in -> Redirect to Admin Login
        if (status === "unauthenticated") {
            router.push("/admin/login");
            return;
        }

        // 2. Logged in but not Admin -> Redirect to Admin Login
        const userRole = (session?.user as any)?.role;
        if (session && userRole !== "admin") {
            router.push("/admin/login");
        }
    }, [status, session, router, pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Render plain children for login page (no sidebar)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show loading or nothing while checking auth
    if (status === "loading") return null;

    // Strict Auth Check during render
    if (!session || (session.user as any).role !== "admin") {
        return null; // Don't render anything until redirected
    }

    return (
        <div className="admin-wrapper">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>🛡️ 관리자 본부</h2>
                    <p>Husband ER Admin</p>
                </div>

                <nav className="sidebar-nav">
                    <Link href="/admin" className={`nav-item ${pathname === "/admin" ? "active" : ""}`}>
                        📊 대시보드
                    </Link>
                    <Link href="/admin/users" className={`nav-item ${pathname.startsWith("/admin/users") ? "active" : ""}`}>
                        👥 회원 관리
                    </Link>
                    <Link href="/admin/posts" className={`nav-item ${pathname.startsWith("/admin/posts") ? "active" : ""}`}>
                        📝 게시글 관리
                    </Link>
                    <Link href="/admin/reports" className={`nav-item ${pathname.startsWith("/admin/reports") ? "active" : ""}`}>
                        🚨 신고 접수
                    </Link>
                    <Link href="/admin/settings" className={`nav-item ${pathname.startsWith("/admin/settings") ? "active" : ""}`}>
                        ⚙️ 설정
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-info">
                        <span className="admin-name">{session.user?.name || "Admin"}</span>
                        <span className="admin-role">슈퍼 관리자</span>
                    </div>
                    <div className="footer-actions">
                        <Link href="/" className="btn-home">
                            🏠 메인으로
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="btn-logout">
                            로그아웃
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="top-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            ☰
                        </button>
                        <h1 className="page-title">
                            {pathname === "/admin" && "대시보드"}
                            {pathname.startsWith("/admin/users") && "회원 관리"}
                            {pathname.startsWith("/admin/posts") && "게시글 관리"}
                            {pathname.startsWith("/admin/reports") && "신고 접수"}
                            {pathname.startsWith("/admin/settings") && "설정"}
                        </h1>
                    </div>
                    <div className="top-actions">
                        <span className="date">{new Date().toLocaleDateString()}</span>
                        <button className="btn-noti">🔔</button>
                    </div>
                </header>
                <div className="content-body">
                    {children}
                </div>
            </main>

            <style jsx>{`
                .admin-wrapper {
                    display: flex;
                    min-height: 100vh;
                    background: #f4f6f8;
                    color: #333;
                    font-family: 'Pretendard', sans-serif;
                    position: relative;
                }

                /* Sidebar */
                .sidebar {
                    width: 260px;
                    background: #1e1e1e;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100%;
                    z-index: 1000;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    left: 0;
                    top: 0;
                }

                .sidebar-header {
                    padding: 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .sidebar-header h2 {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #e74c3c;
                    letter-spacing: -0.5px;
                }

                .sidebar-header p {
                    font-size: 0.8rem;
                    color: #888;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    overflow-y: auto;
                }

                .nav-item {
                    display: block;
                    padding: 12px 24px;
                    color: #aaa;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                }

                .nav-item.active {
                    background: rgba(231, 76, 60, 0.1);
                    color: #fff;
                    border-left-color: #e74c3c;
                    font-weight: 600;
                }

                .sidebar-footer {
                    padding: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: #1e1e1e;
                }

                .admin-info {
                    margin-bottom: 16px;
                }

                .admin-name {
                    display: block;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #fff;
                }

                .admin-role {
                    font-size: 0.8rem;
                    color: #e74c3c;
                }

                .footer-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .btn-logout, .btn-home {
                    flex: 1;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .btn-logout {
                    background: #333;
                    color: #fff;
                    border: none;
                }
                .btn-logout:hover { background: #444; }

                .btn-home {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ccc;
                    text-decoration: none;
                    border: 1px solid transparent;
                }
                .btn-home:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                }

                /* Main Content */
                .main-content {
                    flex: 1;
                    margin-left: 260px;
                    display: flex;
                    flex-direction: column;
                    width: calc(100% - 260px);
                    transition: margin-left 0.3s;
                }

                .top-bar {
                    height: 64px;
                    background: #fff;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 32px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .top-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .hamburger-btn {
                    display: none; /* Hidden on Desktop */
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #333;
                    padding: 4px;
                }

                .page-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111;
                    margin: 0;
                }

                .top-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .date {
                    font-size: 0.9rem;
                    color: #666;
                }

                .btn-noti {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                }

                .content-body {
                    padding: 32px;
                    flex: 1;
                    overflow-x: hidden;
                }

                /* Mobile Overlay */
                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 900;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                    backdrop-filter: blur(4px);
                }
                .mobile-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                /* 📱 Responsive Styles */
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        box-shadow: 4px 0 10px rgba(0,0,0,0.1);
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }

                    .main-content {
                        margin-left: 0;
                        width: 100%;
                    }

                    .top-bar {
                        padding: 0 16px;
                        height: 56px;
                    }

                    .hamburger-btn {
                        display: block;
                    }

                    .page-title {
                        font-size: 1.1rem;
                    }

                    .content-body {
                        padding: 16px;
                    }

                    .date {
                        display: none; /* Hide date on small screens */
                    }
                }
            `}</style>
        </div>
    );
}
