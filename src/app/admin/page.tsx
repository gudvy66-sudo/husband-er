"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
// Removed static firebase imports to prevent build errors (SSG location issue)

// Mock data removed. Real data fetched in component.

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        todayVisitors: 0,
        totalPosts: 0,
        pendingReports: 0
    });
    const [realRecentMembers, setRealRecentMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Dynamic imports
                const { collection, getDocs, onSnapshot, query, orderBy, limit } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                // 1. Fetch Users Data (One-time fetch for stats)
                const usersRef = collection(db, "users");
                const usersSnap = await getDocs(usersRef);
                const totalUsers = usersSnap.size;

                // Calculate Today Visitors
                const todayIndices = new Date();
                todayIndices.setHours(0, 0, 0, 0);

                let visitorsCount = 0;
                const membersList: any[] = [];

                usersSnap.forEach(doc => {
                    const data = doc.data();
                    if (data.lastLogin?.seconds * 1000 >= todayIndices.getTime()) {
                        visitorsCount++;
                    }
                    membersList.push({ id: doc.id, ...data });
                });

                // Top 5 Recent Members
                const sortedMembers = membersList
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                    .slice(0, 5)
                    .map(m => ({
                        id: m.id,
                        name: m.name,
                        email: m.email,
                        role: m.role || 'User',
                        joined: m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown',
                        initial: m.name ? m.name[0] : '?'
                    }));

                setRealRecentMembers(sortedMembers);

                // 2. Fetch Posts Data
                const psnap = await getDocs(collection(db, "posts"));
                const totalPosts = psnap.size;

                // 3. Real-time Reports Listener
                const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(5));

                // We use a separate listener for reports list, but for stats we might need total count.
                // For 'pendingReports' count, we can just use the snapshot size of a query for status='pending'.
                // But to be simple, let's just listen to all reports or a reasonable subset + metadata if possible.
                // Since this is a dashboard, we'll fetch all reports to count 'pending'.

                const allReportsSnap = await getDocs(collection(db, "reports"));
                const pendingCount = allReportsSnap.docs.filter(d => d.data().status === 'pending').length;

                // Listen for recent reports for the table
                const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
                    const loadedReports = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        // Safe date conversion
                        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
                    }));
                    setReports(loadedReports);
                });

                setStats({
                    totalUsers,
                    todayVisitors: visitorsCount,
                    totalPosts,
                    pendingReports: pendingCount
                });

                setLoading(false);
                return () => unsubscribe();

            } catch (e) {
                console.error("Dashboard Fetch Error", e);
                setLoading(false);
            }
        };

        if (session) {
            fetchDashboardData();
        }
    }, [session]);

    const displayKpiData = [
        { label: "총 회원수", value: stats.totalUsers.toLocaleString(), unit: "명", diff: "+new", color: "blue" },
        { label: "오늘 접속자", value: stats.todayVisitors.toLocaleString(), unit: "명", diff: "Today", color: "green" },
        { label: "총 게시글", value: stats.totalPosts.toLocaleString(), unit: "건", diff: "Accumulated", color: "purple" },
        { label: "처리 대기 신고", value: stats.pendingReports.toLocaleString(), unit: "건", diff: "-", color: "red" },
    ];

    return (
        <div className="dashboard-container">
            {/* KPI Cards */}
            <div className="kpi-grid">
                {displayKpiData.map((item, idx) => (
                    <div key={idx} className={`kpi-card ${item.color}`}>
                        <div className="kpi-label">{item.label}</div>
                        <div className="kpi-value">
                            {loading ? "..." : item.value} <span className="unit">{item.unit}</span>
                        </div>
                        <div className="kpi-diff">
                            <span className={item.diff.startsWith('+') ? 'up' : 'down'}>
                                {item.diff}
                            </span>
                            <span className="diff-text"> {item.diff === 'Today' ? '오늘 기준' : '전일 대비'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Dashboard Panels */}
            <div className="panel-grid">
                {/* Reported Posts Table (Real) */}
                <div className="panel">
                    <div className="panel-header">
                        <h3>🚨 실시간 신고 접수</h3>
                        <Link href="/admin/reports" className="btn-more">더보기 &gt;</Link>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>유형</th>
                                <th>내용/제목</th>
                                <th>신고자</th>
                                <th>일시</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</td></tr>
                            ) : reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr key={report.id}>
                                        <td><span className="badge-type">{report.type || '신고'}</span></td>
                                        <td className="col-title">{report.reason || report.targetId}</td>
                                        <td>{report.reporterName || '익명'}</td>
                                        <td className="col-date">
                                            {report.createdAt.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`status-dot ${report.status === 'pending' ? 'red' : 'gray'}`}></span>
                                            {report.status === 'pending' ? '대기중' : report.status}
                                        </td>
                                        <td>
                                            <button className="btn-action">확인</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>접수된 신고가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Recent Members Panel (Real) */}
                <div className="panel side-panel">
                    <div className="panel-header">
                        <h3>👥 신규 가입 회원</h3>
                        <Link href="/admin/users" className="btn-more">전체보기</Link>
                    </div>
                    <ul className="member-list">
                        {loading ? <p style={{ padding: '20px', color: '#888' }}>로딩 중...</p> :
                            realRecentMembers.length > 0 ? (
                                realRecentMembers.map((member) => (
                                    <li key={member.id} className="member-item">
                                        <div className="member-avatar">{member.initial}</div>
                                        <div className="member-info">
                                            <div className="name-row">
                                                <span className="name">{member.name}</span>
                                                <span className={`role-badge ${member.role === 'vip' ? 'vip' : ''}`}>{member.role}</span>
                                            </div>
                                            <span className="email">{member.email}</span>
                                        </div>
                                        <span className="joined-time">{member.joined}</span>
                                    </li>
                                ))
                            ) : (
                                <p style={{ padding: '20px', color: '#888' }}>신규 회원이 없습니다.</p>
                            )
                        }
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                /* KPI Cards */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }

                .kpi-card {
                    background: #fff;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border-left: 4px solid transparent;
                    transition: transform 0.2s;
                }

                .kpi-card:hover {
                    transform: translateY(-2px);
                }

                .kpi-card.blue { border-left-color: #3498db; }
                .kpi-card.green { border-left-color: #2ecc71; }
                .kpi-card.purple { border-left-color: #9b59b6; }
                .kpi-card.red { border-left-color: #e74c3c; }

                .kpi-label {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                    margin-bottom: 8px;
                }

                .kpi-value {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #2c3e50;
                    margin-bottom: 4px;
                }

                .unit {
                    font-size: 1rem;
                    font-weight: 500;
                    color: #95a5a6;
                }

                .kpi-diff {
                    font-size: 0.85rem;
                }

                .up { color: #2ecc71; font-weight: 600; }
                .down { color: #e74c3c; font-weight: 600; }
                .diff-text { color: #95a5a6; }


                /* Panels */
                .panel-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }

                .panel {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    padding: 24px;
                    overflow: hidden;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 12px;
                }

                .panel-header h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #34495e;
                }

                .btn-more {
                    font-size: 0.85rem;
                    color: #3498db;
                    text-decoration: none;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }

                .data-table th {
                    text-align: left;
                    padding: 12px 8px;
                    color: #7f8c8d;
                    font-weight: 600;
                    background: #f8f9fa;
                    border-bottom: 2px solid #ecf0f1;
                }

                .data-table td {
                    padding: 14px 8px;
                    border-bottom: 1px solid #ecf0f1;
                    color: #2c3e50;
                }

                .col-title {
                    font-weight: 600;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .col-date {
                    font-size: 0.85rem;
                    color: #95a5a6;
                }

                .badge-type {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: #fcebeb;
                    color: #c0392b;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 6px;
                }

                .status-dot.red { background: #e74c3c; }
                .status-dot.orange { background: #f39c12; }
                .status-dot.gray { background: #bdc3c7; }

                .btn-action {
                    padding: 4px 10px;
                    border: 1px solid #bdc3c7;
                    border-radius: 4px;
                    background: #fff;
                    color: #7f8c8d;
                    cursor: pointer;
                    font-size: 0.8rem;
                }

                .btn-action:hover {
                    background: #ecf0f1;
                    color: #2c3e50;
                }

                /* Member List */
                .member-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .member-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #f1f2f6;
                }

                .member-item:last-child {
                    border-bottom: none;
                }

                .member-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #3498db;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    margin-right: 12px;
                }

                .member-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .name-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #2c3e50;
                }

                .email {
                    font-size: 0.8rem;
                    color: #95a5a6;
                }

                .role-badge {
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 10px;
                    background: #ecf0f1;
                    color: #7f8c8d;
                }

                .role-badge.vip {
                    background: #fff8e1;
                    color: #f39c12;
                    border: 1px solid #f39c12;
                }

                .joined-time {
                    font-size: 0.8rem;
                    color: #bdc3c7;
                }

                /* Responsive */
                @media (max-width: 1200px) {
                    .panel-grid {
                        grid-template-columns: 1fr;
                    }
                    .kpi-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
