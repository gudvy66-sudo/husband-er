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
                    <div className="data-table-wrapper">
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
                    gap: 30px;
                    padding: 0 4px;
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                }

                /* KPI Cards */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                }

                .kpi-card {
                    background: #fff;
                    padding: 24px 28px;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.02);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .kpi-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    border-radius: 4px 0 0 4px;
                }

                .kpi-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.05);
                }

                .kpi-card.blue::before { background: #5e72e4; }
                .kpi-card.green::before { background: #2dce89; }
                .kpi-card.purple::before { background: #8965e0; }
                .kpi-card.red::before { background: #f5365c; }

                .kpi-label {
                    font-size: 0.85rem;
                    color: #8898aa;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                }

                .kpi-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #32325d;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                }

                .unit {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #adb5bd;
                }

                .kpi-diff {
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .up { color: #2dce89; font-weight: 700; }
                .down { color: #f5365c; font-weight: 700; }
                .diff-text { color: #8898aa; }


                /* Panels */
                .panel-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                }

                .panel {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.02);
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f6f9fc;
                }

                .panel-header h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #32325d;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .btn-more {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #5e72e4;
                    text-decoration: none;
                    background: #f4f5f7;
                    padding: 6px 12px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .btn-more:hover {
                    background: #5e72e4;
                    color: #fff;
                }

                /* Data Table */
                .data-table-wrapper {
                    overflow-x: auto;
                    margin: 0 -16px;
                    padding: 0 16px;
                    -webkit-overflow-scrolling: touch;
                }

                .data-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 0.9rem;
                    min-width: 600px;
                }

                .data-table th {
                    text-align: left;
                    padding: 12px 16px;
                    color: #8898aa;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    background: #f6f9fc;
                    border-bottom: 1px solid #e9ecef;
                    white-space: nowrap;
                }
                .data-table th:first-child { border-top-left-radius: 8px; }
                .data-table th:last-child { border-top-right-radius: 8px; }

                .data-table td {
                    padding: 16px;
                    border-bottom: 1px solid #f6f9fc;
                    color: #525f7f;
                    vertical-align: middle;
                    white-space: nowrap;
                }
                .data-table tr:hover td { background: #f8f9fe; }

                .col-title {
                    font-weight: 600;
                    color: #32325d;
                    max-width: 220px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .col-date {
                    font-size: 0.85rem;
                    color: #8898aa;
                }

                .badge-type {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 6px;
                    background: #fff5f5;
                    color: #f5365c;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .status-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 8px;
                }

                .status-dot.red { background: #f5365c; box-shadow: 0 0 0 2px rgba(245, 54, 92, 0.2); }
                .status-dot.orange { background: #fb6340; }
                .status-dot.gray { background: #adb5bd; }

                .btn-action {
                    padding: 6px 12px;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    background: #fff;
                    color: #525f7f;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .btn-action:hover {
                    background: #5e72e4;
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
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
                    padding: 16px 0;
                    border-bottom: 1px solid #f6f9fc;
                }

                .member-item:last-child {
                    border-bottom: none;
                }

                .member-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #11cdef 0%, #1171ef 100%);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-right: 16px;
                    box-shadow: 0 4px 10px rgba(17, 113, 239, 0.3);
                }

                .member-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .name-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #32325d;
                }

                .email {
                    font-size: 0.8rem;
                    color: #8898aa;
                }

                .role-badge {
                    font-size: 0.65rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: #e9ecef;
                    color: #525f7f;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .role-badge.vip {
                    background: #fff8e1;
                    color: #ff9f43;
                }

                .joined-time {
                    font-size: 0.8rem;
                    color: #adb5bd;
                    font-weight: 500;
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
                @media (max-width: 768px) {
                    .kpi-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .kpi-card {
                        padding: 20px;
                    }
                    .kpi-value {
                        font-size: 1.5rem;
                    }
                    .panel {
                        padding: 20px;
                    }
                    .panel-header h3 {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
