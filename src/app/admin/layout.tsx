"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "loading") return;

        // Skip auth check for login page
        if (pathname === "/admin/login") return;

        // 1. Not logged in -> Redirect to Admin Login
        if (status === "unauthenticated") {
            router.push("/admin/login");
            return;
        }

        // 2. Logged in but not Admin -> Redirect to Admin Login (to allow login as admin)
        const userRole = (session?.user as any)?.role;
        if (session && userRole !== "admin") {
            router.push("/admin/login");
        }
    }, [status, session, router, pathname]);

    // Render plain children for login page (no sidebar)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show loading or nothing while checking auth
    if (status === "loading" || !session) return null;

    return (
        <div className="admin-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🛡️ 관리자 본부</h2>
                    <p>Husband ER Admin</p>
                </div>

                <nav className="sidebar-nav">
                    <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
                        📊 대시보드
                    </Link>
                    <Link href="/admin/users" className={pathname.startsWith("/admin/users") ? "active" : ""}>
                        👥 회원 관리
                    </Link>
                    <Link href="/admin/posts" className={pathname.startsWith("/admin/posts") ? "active" : ""}>
                        📝 게시글 관리
                    </Link>
                    <Link href="/admin/reports" className={pathname.startsWith("/admin/reports") ? "active" : ""}>
                        🚨 신고 접수
                    </Link>
                    <Link href="/admin/settings" className={pathname.startsWith("/admin/settings") ? "active" : ""}>
                        ⚙️ 설정
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-info">
                        <span className="admin-name">{session.user?.name || "Admin"}</span>
                        <span className="admin-role">슈퍼 관리자</span>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="btn-logout">
                        로그아웃
                    </button>
                    <Link href="/" className="btn-home">
                        🏠 메인으로
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-bar">
                    <h1 className="page-title">
                        {pathname === "/admin" && "대시보드 현황"}
                        {pathname.startsWith("/admin/users") && "회원 관리"}
                        {pathname.startsWith("/admin/posts") && "게시글 관리"}
                        {pathname.startsWith("/admin/reports") && "신고 접수"}
                    </h1>
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
                }

                /* Sidebar */
                .sidebar {
                    width: 260px;
                    background: #1e1e1e;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 1000;
                }

                .sidebar-header {
                    padding: 24px;
                    border-bottom: 1px solid #333;
                }

                .sidebar-header h2 {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #e74c3c;
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
                }

                .sidebar-nav a {
                    display: block;
                    padding: 12px 24px;
                    color: #aaa;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                }

                .sidebar-nav a:hover {
                    background: #2a2a2a;
                    color: #fff;
                }

                .sidebar-nav a.active {
                    background: #2a2a2a;
                    color: #fff;
                    border-left-color: #e74c3c;
                    font-weight: 600;
                }

                .sidebar-footer {
                    padding: 24px;
                    border-top: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .admin-info {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 12px;
                }

                .admin-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                }

                .admin-role {
                    font-size: 0.8rem;
                    color: #e74c3c;
                }

                .btn-logout {
                    width: 100%;
                    padding: 8px;
                    background: #333;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                }

                .btn-logout:hover {
                    background: #444;
                }

                .btn-home {
                    text-align: center;
                    color: #888;
                    font-size: 0.85rem;
                    text-decoration: none;
                }

                .btn-home:hover {
                    color: #fff;
                    text-decoration: underline;
                }

                /* Main Content */
                .main-content {
                    flex: 1;
                    margin-left: 260px; /* Sidebar width */
                    display: flex;
                    flex-direction: column;
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
                }

                .page-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111;
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
                    overflow-y: auto;
                }
            `}</style>
        </div>
    );
}
