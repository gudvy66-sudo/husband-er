"use client";

import { useState, useEffect } from "react";

interface ReportData {
    id: string;
    targetId: string;
    type: string; // 'post' | 'comment'
    reason: string;
    reporterName: string;
    status: string; // 'pending' | 'resolved' | 'dismissed'
    createdAt: any;
}

export default function AdminReports() {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Safe date
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
            })) as ReportData[];

            setReports(list);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, newStatus: string) => {
        if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return;
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await updateDoc(doc(db, "reports", reportId), { status: newStatus });
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
        } catch (e) {
            alert("상태 변경 실패");
        }
    };

    const handleDelete = async (reportId: string) => {
        if (!confirm("🚨 신고 내역을 삭제하시겠습니까?")) return;
        try {
            const { doc, deleteDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await deleteDoc(doc(db, "reports", reportId));
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (e) {
            alert("삭제 실패");
        }
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="title">🚨 신고 접수 및 처리 (Report Handler)</h2>
                <div className="header-actions">
                    <button onClick={fetchReports} className="btn-refresh">새로고침 🔄</button>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading">데이터 불러오는 중...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>유형</th>
                                <th>사유 / 내용</th>
                                <th>신고자</th>
                                <th>접수일시</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr key={report.id} className={report.status === 'resolved' ? 'row-dimmed' : ''}>
                                        <td>
                                            <span className={`badge ${report.type}`}>
                                                {report.type === 'post' ? '게시글' : '댓글'}
                                            </span>
                                        </td>
                                        <td className="col-content">
                                            <div className="reason">{report.reason}</div>
                                            <div className="target-id">Target ID: {report.targetId}</div>
                                        </td>
                                        <td>{report.reporterName}</td>
                                        <td>{report.createdAt.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${report.status}`}>
                                                {report.status === 'pending' && '대기중'}
                                                {report.status === 'resolved' && '처리완료'}
                                                {report.status === 'dismissed' && '반려됨'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {report.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(report.id, 'resolved')} className="btn-resolve">처리</button>
                                                        <button onClick={() => handleUpdateStatus(report.id, 'dismissed')} className="btn-dismiss">무시</button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDelete(report.id)} className="btn-delete">삭제</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="no-data">
                                        <div className="empty-state">
                                            <div className="icon">✅</div>
                                            <h3>접수된 신고가 없습니다.</h3>
                                            <p>커뮤니티가 아주 평화롭습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .admin-page-container {
                    padding: 0 4px;
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #2c3e50;
                    letter-spacing: -0.5px;
                }
                .btn-refresh {
                    padding: 10px 20px;
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    color: #555;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .btn-refresh:hover {
                    background: #f8f9fa;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .table-container {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                    overflow-x: auto; /* Enable horizontal scroll */
                    border: 1px solid rgba(0,0,0,0.02);
                    min-height: 400px;
                    -webkit-overflow-scrolling: touch;
                }
                .loading, .no-data {
                    padding: 60px;
                    text-align: center;
                    color: #adb5bd;
                    font-size: 1.1rem;
                }

                .data-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 0.95rem;
                    min-width: 900px; /* Keep width for scrolling */
                }
                .data-table th {
                    background: #f6f9fc;
                    padding: 18px 24px;
                    text-align: left;
                    font-weight: 700;
                    color: #8898aa;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #e9ecef;
                    white-space: nowrap;
                }
                .data-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f6f9fc;
                    vertical-align: middle;
                    color: #525f7f;
                    white-space: nowrap;
                }
                .data-table tr:hover td { background: #f8f9fe; }
                .row-dimmed td { opacity: 0.6; background: #fafafa; }

                .col-content { max-width: 300px; white-space: normal; }
                .reason { font-weight: 600; color: #32325d; margin-bottom: 4px; }
                .target-id { font-size: 0.8rem; color: #999; font-family: monospace; }

                .badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .badge.post { background: #e3f2fd; color: #1565c0; }
                .badge.comment { background: #fff8e1; color: #ff8f00; }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }
                .status-badge.pending { background: #fee2e2; color: #f5365c; }
                .status-badge.resolved { background: #e8f5e9; color: #2dce89; }
                .status-badge.dismissed { background: #f1f3f5; color: #868e96; }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-resolve {
                    padding: 6px 12px;
                    background: #fff;
                    border: 1px solid #b2dfdb;
                    color: #009688;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-resolve:hover { background: #009688; color: #fff; }

                .btn-dismiss {
                    padding: 6px 12px;
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    color: #757575;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-dismiss:hover { background: #757575; color: #fff; }

                .btn-delete {
                    padding: 6px 12px;
                    background: #fff;
                    border: 1px solid #ef9a9a;
                    color: #e53935;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-delete:hover { background: #e53935; color: #fff; }

                .empty-state { text-align: center; color: #555; padding: 40px; }
                .icon { font-size: 4rem; margin-bottom: 16px; }
                .empty-state h3 { font-size: 1.4rem; margin-bottom: 8px; color: #32325d; font-weight: 700; }
                .empty-state p { color: #8898aa; font-size: 1rem; }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                        margin-bottom: 20px;
                    }
                    .title {
                        font-size: 1.3rem;
                    }
                    .btn-refresh {
                        padding: 8px 16px;
                        font-size: 0.9rem;
                    }
                    .table-container {
                        border-radius: 12px;
                    }
                    .loading, .no-data {
                        padding: 40px;
                    }
                    .action-buttons {
                        flex-direction: column;
                        gap: 4px;
                    }
                    .btn-resolve, .btn-dismiss, .btn-delete {
                        width: 100%;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}
