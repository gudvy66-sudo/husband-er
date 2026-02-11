"use client";

import { useSession } from "next-auth/react";

// Mock Data
const kpiData = [
    { label: "총 회원수", value: "1,248", unit: "명", diff: "+14", color: "blue" },
    { label: "오늘 접속자", value: "892", unit: "명", diff: "+5.1%", color: "green" },
    { label: "신규 게시글", value: "54", unit: "건", diff: "+12", color: "purple" },
    { label: "처리 대기 신고", value: "5", unit: "건", diff: "-1", color: "red" },
];

const reportedPosts = [
    { id: 1, type: "스팸/광고", title: "[광고] 100% 수익 보장 해외선물", reporter: "익명_12", date: "2024-02-11 14:20", status: "대기중" },
    { id: 2, type: "욕설/비방", title: "진짜 이혼 마렵네 ㅋㅋㅋ", reporter: "화난남편", date: "2024-02-11 10:05", status: "처리중" },
    { id: 3, type: "음란물", title: "후방주의) 이거 보셈", reporter: "순찰대원", date: "2024-02-10 23:12", status: "차단됨" },
];

const recentMembers = [
    { id: 101, name: "김철수", email: "kim@test.com", joined: "10분 전", role: "User" },
    { id: 102, name: "박영수", email: "park@test.com", joined: "35분 전", role: "User" },
    { id: 103, name: "이민호", email: "lee@test.com", joined: "1시간 전", role: "VIP" },
    { id: 104, name: "최광수", email: "choi@test.com", joined: "2시간 전", role: "User" },
];

export default function AdminDashboard() {
    const { data: session } = useSession();

    return (
        <div className="dashboard-container">
            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpiData.map((item, idx) => (
                    <div key={idx} className={`kpi-card ${item.color}`}>
                        <div className="kpi-label">{item.label}</div>
                        <div className="kpi-value">
                            {item.value} <span className="unit">{item.unit}</span>
                        </div>
                        <div className="kpi-diff">
                            <span className={item.diff.startsWith('+') ? 'up' : 'down'}>
                                {item.diff}
                            </span>
                            <span className="diff-text"> 전일 대비</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Dashboard Panels */}
            <div className="panel-grid">
                {/* Reported Posts Table */}
                <div className="panel">
                    <div className="panel-header">
                        <h3>🚨 실시간 신고 접수</h3>
                        <a href="/admin/reports" className="btn-more">더보기 &gt;</a>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>유형</th>
                                <th>제목</th>
                                <th>신고자</th>
                                <th>일시</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedPosts.map((post) => (
                                <tr key={post.id}>
                                    <td><span className="badge-type">{post.type}</span></td>
                                    <td className="col-title">{post.title}</td>
                                    <td>{post.reporter}</td>
                                    <td className="col-date">{post.date}</td>
                                    <td>
                                        <span className={`status-dot ${post.status === '대기중' ? 'red' : post.status === '처리중' ? 'orange' : 'gray'}`}></span>
                                        {post.status}
                                    </td>
                                    <td>
                                        <button className="btn-action">확인</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Members Panel */}
                <div className="panel side-panel">
                    <div className="panel-header">
                        <h3>👥 신규 가입 회원</h3>
                        <a href="/admin/users" className="btn-more">전체보기</a>
                    </div>
                    <ul className="member-list">
                        {recentMembers.map((member) => (
                            <li key={member.id} className="member-item">
                                <div className="member-avatar">{member.name[0]}</div>
                                <div className="member-info">
                                    <div className="name-row">
                                        <span className="name">{member.name}</span>
                                        <span className={`role-badge ${member.role === 'VIP' ? 'vip' : ''}`}>{member.role}</span>
                                    </div>
                                    <span className="email">{member.email}</span>
                                </div>
                                <span className="joined-time">{member.joined}</span>
                            </li>
                        ))}
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
