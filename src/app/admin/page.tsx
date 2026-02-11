"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Mock Data for Dashboard
const stats = [
    { label: "총 회원수", value: "1,234", change: "+12", icon: "👥", color: "#00ff41" },
    { label: "오늘 방문자", value: "856", change: "+5.4%", icon: "👀", color: "#FFD700" },
    { label: "새 글", value: "42", change: "+8", icon: "📝", color: "#00C2FF" },
    { label: "신고 접수", value: "3", change: "-2", icon: "🚨", color: "#FF0055" },
];

const reportedPosts = [
    { id: 1, title: "불법 도박 사이트 홍보합니다", author: "unknown", date: "2024-02-11", status: "대기중" },
    { id: 2, title: "와이프 욕설 심하게 하네요", author: "angry_husband", date: "2024-02-10", status: "처리완료" },
];

const recentUsers = [
    { id: 101, name: "김철수", email: "kim@test.com", joinDate: "2024-02-11", role: "User" },
    { id: 102, name: "이영희_남편", email: "lee@test.com", joinDate: "2024-02-11", role: "User" },
    { id: 103, name: "박부장", email: "park@test.com", joinDate: "2024-02-10", role: "VIP" },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        // Check for Admin Role
        // Note: The 'role' property is added to the session in the NextAuth callback (route.ts)
        const userRole = (session?.user as any)?.role; // Casting to any to avoid type errors if types aren't fully propagated yet

        if (!session || userRole !== "admin") {
            alert("🚫 관리자 전용 구역입니다! (접근 거부)");
            router.push("/");
        } else {
            setIsAdmin(true);
        }
    }, [session, status, router]);

    if (!isAdmin) return null; // Secure blank screen while redirecting

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">🛡️ 남편응급실 관리 본부</h1>
                <div className="admin-profile">
                    <span>관리자님, 환영합니다.</span>
                    <Link href="/" className="btn-exit">나가기</Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Reported Posts */}
                <div className="dashboard-card">
                    <h2 className="card-header">🚨 신고 접수 현황</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>날짜</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedPosts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.title}</td>
                                    <td>{post.author}</td>
                                    <td>{post.date}</td>
                                    <td>
                                        <span className={`status-badge ${post.status === "대기중" ? "pending" : "done"}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-action delete">삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Users */}
                <div className="dashboard-card">
                    <h2 className="card-header">👥 최근 가입 회원</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>가입일</th>
                                <th>등급</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.joinDate}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn-action promote">승급</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .admin-container {
            padding: 100px 40px 40px;
            max-width: 1400px;
            margin: 0 auto;
            color: #fff;
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 20px;
        }

        .admin-title {
            font-size: 2rem;
            font-weight: 800;
            color: #ff0055; /* Red for Admin */
        }

        .admin-profile {
            display: flex;
            align-items: center;
            gap: 20px;
            font-size: 1rem;
            color: #aaa;
        }

        .btn-exit {
            padding: 8px 16px;
            border: 1px solid #444;
            border-radius: 6px;
            color: #fff;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.2s;
        }

        .btn-exit:hover {
            background: #333;
        }

        /* Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: rgba(20, 20, 20, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .stat-icon {
            font-size: 2.5rem;
        }

        .stat-info {
            display: flex;
            flex-direction: column;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #888;
        }

        .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            margin: 4px 0;
        }

        .stat-change {
            font-size: 0.85rem;
            font-weight: 600;
        }

        .positive { color: #00ff41; }
        .negative { color: #ff0055; }

        /* Dashboard Grid */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        @media (max-width: 1024px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        .dashboard-card {
            background: rgba(30, 30, 30, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 24px;
        }

        .card-header {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Table Styles */
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        .admin-table th {
            text-align: left;
            padding: 12px;
            color: #888;
            font-weight: 600;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-table td {
            padding: 14px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #ddd;
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .pending { background: rgba(255, 215, 0, 0.2); color: #FFD700; }
        .done { background: rgba(0, 255, 65, 0.2); color: #00ff41; }

        .btn-action {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: opacity 0.2s;
        }

        .delete { background: #ff0055; color: #fff; }
        .promote { background: #00C2FF; color: #fff; }

        .btn-action:hover { opacity: 0.8; }
      `}</style>
        </div>
    );
}
