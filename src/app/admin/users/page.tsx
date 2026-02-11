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
            /* Chic Admin Design */
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
                font - size: 1.8rem;
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

            .stats-summary {
                display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            }
            .stat-box {
                background: #fff;
            padding: 24px 32px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            min-width: 160px;
            flex: 1;
            border: 1px solid rgba(0,0,0,0.03);
            transition: transform 0.2s;
            }
            .stat-box:hover {
                transform: translateY(-5px);
            }
            .stat-box.warning .value {color: #ff6b6b; }
            .label {font - size: 0.9rem; color: #8898aa; margin-bottom: 8px; font-weight: 500; }
            .value {font - size: 2.2rem; font-weight: 800; color: #32325d; }

            .table-container {
                background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.04);
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.02);
            }
            .loading, .no-data {
                padding: 60px;
            text-align: center;
            color: #adb5bd;
            font-size: 1.1rem;
            }

            .user-table {
                width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.95rem;
            }
            .user-table th {
                background: #f6f9fc;
            padding: 18px 24px;
            text-align: left;
            font-weight: 700;
            color: #8898aa;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e9ecef;
            }
            .user-table td {
                padding: 20px 24px;
            border-bottom: 1px solid #f6f9fc;
            vertical-align: middle;
            color: #525f7f;
            }
            .user-table tr:hover td {background: #f8f9fe; }
            .row-banned td {background: #fff5f5 !important; opacity: 0.7; }

            .user-info {
                display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            color: #32325d;
            }
            .avatar-circle {
                width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            color: #fff;
            font-weight: 700;
            box-shadow: 0 4px 10px rgba(118, 75, 162, 0.3);
            }

            .gender-badge {
                padding: 6px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            }
            .gender-badge.M {background: #e3f2fd; color: #1565c0; }
            .gender-badge.F {background: #fce4ec; color: #ad1457; }

            .role-select {
                padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            font-size: 0.9rem;
            background-color: #fff;
            color: #525f7f;
            cursor: pointer;
            transition: all 0.2s;
            }
            .role-select:focus {
                border - color: #5e72e4;
            outline: none;
            box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.1);
            }
            .role-select.admin {
                background: #fff3e0;
            border-color: #ffe0b2;
            color: #ef6c00;
            font-weight: 700; 
            }

            .status-badge {
                padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            }
            .status-badge::before {
                content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            }
            .status-badge.active {background: #e8f5e9; color: #2dce89; }
            .status-badge.active::before {background: #2dce89; }

            .status-badge.banned {background: #fee2e2; color: #f5365c; }
            .status-badge.banned::before {background: #f5365c; }

            .action-buttons {
                display: flex;
            gap: 8px;
            }

            .btn-ban {
                padding: 8px 16px;
            background: #fff;
            border: 1px solid #ffcccc;
            color: #ff5252;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s;
            }
            .btn-ban:hover {
                background: #ff5252;
            color: #fff;
            box-shadow: 0 4px 10px rgba(255, 82, 82, 0.2);
            border-color: transparent;
            }

            .btn-unban {
                padding: 8px 16px;
            background: #fff;
            border: 1px solid #b9f6ca;
            color: #00c853;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s;
            }
            .btn-unban:hover {
                background: #00c853;
            color: #fff;
            box-shadow: 0 4px 10px rgba(0, 200, 83, 0.2);
            border-color: transparent;
            }
        `}</style>
        </div >
    );
}
