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
                    min-width: 800px; /* Keep width for scrolling */
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

                .col-title {
                    max-width: 320px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .link-title {
                    text-decoration: none;
                    color: #32325d;
                    font-weight: 600;
                    transition: color 0.2s;
                    display: block;
                }
                .link-title:hover {
                    color: #5e72e4;
                    text-decoration: underline;
                }

                .badge {
                    padding: 6px 10px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: inline-block;
                    text-transform: uppercase;
                }
                .badge.urgent { background: #fee2e2; color: #f5365c; }
                .badge.question { background: #e8f5e9; color: #2dce89; }
                .badge.secret { background: #eceff1; color: #525f7f; }
                .badge.free { background: #e3f2fd; color: #1171ef; }

                .btn-delete {
                    padding: 8px 16px;
                    background: #fff;
                    border: 1px solid #fcebeb;
                    color: #f5365c;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-delete:hover {
                    background: #f5365c;
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 6px rgba(245, 54, 92, 0.2);
                }

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
                }
            `}</style>
        </div>
    );
}
