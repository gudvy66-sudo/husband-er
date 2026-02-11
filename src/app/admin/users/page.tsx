"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
    id: string; // Document ID (uid)
    uid: string;
    name: string;
    email: string;
    gender: string;
    role: string;
    status: string;
    createdAt: any;
    lastLogin: any;
}

export default function UserManagement() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            // Query users ordered by creation time
            // Note: Index might be needed for complex queries, but simple orderBy usually works or throws link to create index
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const userList: UserData[] = [];
            querySnapshot.forEach((doc) => {
                userList.push({ id: doc.id, ...doc.data() } as UserData);
            });

            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
            // Fallback for demo if DB is empty or permission denied initially
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchUsers();
        }
    }, [session]);

    // Actions
    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!confirm(`해당 회원의 등급을 '${newRole}'(으)로 변경하시겠습니까?`)) return;
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            // Optimistic update
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (e) {
            alert("등급 변경 실패: " + e);
        }
    };

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        const actionName = newStatus === 'banned' ? '차단' : '활동 재개';
        if (!confirm(`해당 회원을 '${actionName}' 처리하시겠습니까?`)) return;
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });
            // Optimistic update
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (e) {
            alert("상태 변경 실패: " + e);
        }
    };

    const formatDate = (ts: any) => {
        if (!ts) return "-";
        return new Date(ts.seconds * 1000).toLocaleDateString();
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="title">👥 회원 관리 (User Management)</h2>
                <button onClick={fetchUsers} className="btn-refresh">새로고침 🔄</button>
            </div>

            <div className="stats-summary">
                <div className="stat-box">
                    <span className="label">총 회원</span>
                    <span className="value">{users.length}</span>
                </div>
                <div className="stat-box">
                    <span className="label">관리자</span>
                    <span className="value">{users.filter(u => u.role === 'admin').length}</span>
                </div>
                <div className="stat-box warning">
                    <span className="label">차단됨</span>
                    <span className="value">{users.filter(u => u.status === 'banned').length}</span>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading">데이터 불러오는 중...</div>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>성별</th>
                                <th>가입일</th>
                                <th>최근 접속</th>
                                <th>등급</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className={user.status === 'banned' ? 'row-banned' : ''}>
                                        <td>
                                            <div className="user-info">
                                                <span className="avatar-circle">{user.name?.[0]}</span>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td><span className={`gender-badge ${user.gender}`}>{user.gender === 'M' ? '남성' : '여성'}</span></td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td>{formatDate(user.lastLogin)}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                className={`role-select ${user.role}`}
                                            >
                                                <option value="user">일반 (User)</option>
                                                <option value="vip">VIP</option>
                                                <option value="admin">관리자 (Admin)</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.status}`}>
                                                {user.status === 'active' ? '정상' : '차단됨'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {user.status === 'active' ? (
                                                    <button onClick={() => handleStatusUpdate(user.id, 'banned')} className="btn-ban">차단</button>
                                                ) : (
                                                    <button onClick={() => handleStatusUpdate(user.id, 'active')} className="btn-unban">해제</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="no-data">
                                        데이터가 없습니다. (아직 가입한 회원이 없거나 DB 연결을 확인하세요)
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
            }
            .page-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
            }
            .btn-refresh {
                padding: 8px 16px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-refresh:hover {
                background: #f5f5f5;
            }

            .stats-summary {
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
            }
            .stat-box {
                background: #fff;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                min-width: 120px;
            }
            .stat-box.warning .value { color: #e74c3c; }
            .label { font-size: 0.85rem; color: #888; margin-bottom: 4px; }
            .value { font-size: 1.5rem; font-weight: 800; color: #333; }

            .table-container {
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                overflow: hidden;
                overflow-x: auto;
            }
            .loading, .no-data {
                padding: 40px;
                text-align: center;
                color: #888;
            }
            
            .user-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.9rem;
            }
            .user-table th {
                background: #f8f9fa;
                padding: 16px;
                text-align: left;
                font-weight: 600;
                color: #555;
                border-bottom: 2px solid #eee;
            }
            .user-table td {
                padding: 16px;
                border-bottom: 1px solid #f1f1f1;
                vertical-align: middle;
            }
            .user-table tr:hover { background: #fcfcfc; }
            .row-banned { background: #fff0f0 !important; }

            .user-info {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                color: #333;
            }
            .avatar-circle {
                width: 32px;
                height: 32px;
                background: #eee;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: #666;
            }

            .gender-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            .gender-badge.M { background: #e3f2fd; color: #1976d2; }
            .gender-badge.F { background: #fce4ec; color: #c2185b; }

            .role-select {
                padding: 6px;
                border-radius: 4px;
                border: 1px solid #ddd;
                font-size: 0.85rem;
            }
            .role-select.admin { border-color: #e74c3c; color: #e74c3c; font-weight: bold; }

            .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .status-badge.active { background: #e8f5e9; color: #2e7d32; }
            .status-badge.banned { background: #ffebee; color: #c62828; }

            .btn-ban {
                padding: 6px 12px;
                background: #fff;
                border: 1px solid #ef9a9a;
                color: #e53935;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s;
            }
            .btn-ban:hover { background: #e53935; color: #fff; }

            .btn-unban {
                padding: 6px 12px;
                background: #fff;
                border: 1px solid #a5d6a7;
                color: #2e7d32;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s;
            }
            .btn-unban:hover { background: #2e7d32; color: #fff; }
        `}</style>
        </div>
    );
}
