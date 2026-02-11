"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Removed static firebase imports for SSG safety

// Define Timestamp type locally or import type only?
// Firestore Timestamp type is complicated. Let's use 'any' for now or import type if possible.
// Actually, we can just use 'any' for the interface to avoid importing 'Timestamp' class.
interface PostData {
    id: string;
    title: string;
    category: string;
    authorName: string;
    views: number;
    createdAt: any; // using any to avoid static import of Timestamp
}

export default function AdminPosts() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const postList: PostData[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postList.push({
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    authorName: data.authorName || "익명",
                    views: data.views || 0,
                    createdAt: data.createdAt
                });
            });
            setPosts(postList);
        } catch (error) {
            console.error("Error fetching posts:", error);
            alert("게시글 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: string) => {
        if (!confirm("🚨 정말로 이 게시글을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")) return;

        try {
            const { doc, deleteDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await deleteDoc(doc(db, "posts", postId));
            alert("게시글이 삭제되었습니다.");
            // Refresh list locally
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("삭제 실패: " + error);
        }
    };

    const formatDate = (ts: any) => {
        if (!ts) return "-";
        return new Date(ts.seconds * 1000).toLocaleDateString();
    };

    const getCategoryName = (cat: string) => {
        switch (cat) {
            case 'urgent': return '긴급';
            case 'free': return '자유';
            case 'question': return '질문';
            case 'secret': return '비밀';
            default: return cat;
        }
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="title">📝 게시글 관리 (Posts Management)</h2>
                <div className="header-actions">
                    <button onClick={fetchPosts} className="btn-refresh">새로고침 🔄</button>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading">데이터 불러오는 중...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <tr key={post.id}>
                                        <td><span className={`badge ${post.category}`}>{getCategoryName(post.category)}</span></td>
                                        <td className="col-title" title={post.title}>
                                            <a href={`/community/${post.id}`} target="_blank" rel="noreferrer" className="link-title">
                                                {post.title}
                                            </a>
                                        </td>
                                        <td>{post.authorName}</td>
                                        <td>{formatDate(post.createdAt)}</td>
                                        <td>{post.views}</td>
                                        <td>
                                            <button onClick={() => handleDelete(post.id)} className="btn-delete">삭제</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="no-data">등록된 게시글이 없습니다.</td>
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
                }
                .btn-refresh:hover { background: #f5f5f5; }

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
                
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                .data-table th {
                    background: #f8f9fa;
                    padding: 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #555;
                    border-bottom: 2px solid #eee;
                }
                .data-table td {
                    padding: 16px;
                    border-bottom: 1px solid #f1f1f1;
                    vertical-align: middle;
                    color: #333;
                }
                .data-table tr:hover { background: #fcfcfc; }

                .col-title {
                    max-width: 300px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .link-title {
                    text-decoration: none;
                    color: #2c3e50;
                    font-weight: 500;
                }
                .link-title:hover {
                    text-decoration: underline;
                    color: #3498db;
                }

                .badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    background: #eee; 
                    color: #555;
                }
                .badge.urgent { background: #ffebee; color: #c0392b; }
                .badge.question { background: #e8f5e9; color: #27ae60; }
                .badge.secret { background: #eceff1; color: #7f8c8d; }

                .btn-delete {
                    padding: 6px 12px;
                    background: #fff;
                    border: 1px solid #ef9a9a;
                    color: #e53935;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                }
                .btn-delete:hover {
                    background: #e53935;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
