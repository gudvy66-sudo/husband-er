"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMockStore, Post } from "@/hooks/useMockStore";

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // New State for Report & Features
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState("post");
  const [reportTargetId, setReportTargetId] = useState("");

  // Fetch Post & Comments
  useEffect(() => {
    let unsubscribeComments: () => void;

    const fetchPostData = async () => {
      try {
        const { doc, getDoc, collection, query, orderBy, onSnapshot, updateDoc, increment } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const postId = unwrappedParams.id;
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost({ id: postSnap.id, ...postData });
          setLikes(postData.likes || 0);

          // Check if current user already liked this post
          const likedBy = postData.likedBy || [];
          if (session?.user && likedBy.includes((session.user as any).id)) {
            setHasLiked(true);
          }

          // Increment views
          // Use a key in sessionStorage to prevent double counting on strict mode/hot reload
          const viewedKey = `viewed_${postId}`;
          if (!sessionStorage.getItem(viewedKey)) {
            await updateDoc(postRef, { views: increment(1) });
            sessionStorage.setItem(viewedKey, 'true');
          }

          // Real-time comments listener
          const commentsRef = collection(db, "posts", postId, "comments");
          const q = query(commentsRef, orderBy("createdAt", "asc"));

          unsubscribeComments = onSnapshot(q, (snapshot) => {
            const commentsData: any[] = [];
            snapshot.forEach((doc) => {
              commentsData.push({ id: doc.id, ...doc.data() });
            });
            setComments(commentsData);
          });

        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();

    return () => {
      if (unsubscribeComments) unsubscribeComments();
    };
  }, [unwrappedParams.id]);

  const handleLike = async () => {
    if (!post) return;
    if (!session?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userId = (session.user as any).id;
    try {
      const { doc, updateDoc, increment, arrayUnion, arrayRemove } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const postRef = doc(db, "posts", unwrappedParams.id);

      if (hasLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
        setLikes(prev => prev - 1);
        setHasLiked(false);
      } else {
        // Like
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
        setLikes(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (e) {
      console.error("Like failed", e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!session?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const { collection, addDoc, serverTimestamp, doc, updateDoc, increment } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const postId = unwrappedParams.id;

      // Add comment
      await addDoc(collection(db, "posts", postId, "comments"), {
        content: commentText,
        authorId: (session.user as any).id,
        authorName: session.user.name || "익명",
        createdAt: serverTimestamp()
      });

      // Update post comment count
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: increment(1) });

      setCommentText("");
      // alert("댓글이 등록되었습니다!"); // Real-time update makes alert annoying, skipping
    } catch (error) {
      console.error("Comment submit error:", error);
      alert("댓글 등록 실패");
    }
  };

  // Helper Functions
  const openReportModal = (type: string, id: string) => {
    setReportType(type);
    setReportTargetId(id);
    setReportReason("");
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return alert("신고 사유를 입력해주세요.");
    if (!session?.user) return alert("로그인이 필요합니다.");

    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await addDoc(collection(db, "reports"), {
        targetId: reportTargetId,
        type: reportType, // 'post' or 'comment'
        reason: reportReason,
        reporterId: (session.user as any).id,
        reporterName: session.user.name || "익명",
        status: "pending",
        createdAt: serverTimestamp()
      });

      alert("🚨 신고가 접수되었습니다. 관리자가 확인 후 조치하겠습니다.");
      setShowReportModal(false);
    } catch (error) {
      console.error("Report failed:", error);
      alert("신고 접수 실패");
    }
  };

  const handleCommentLike = async (commentId: string) => {
    // Placeholder for comment liking logic (requires separate subcollection update)
    alert("👍 댓글에 공감했습니다! (MVP 기능)");
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="container" style={{ paddingTop: "100px", textAlign: "center", color: '#fff' }}>로딩 중...</div>;

  if (!post) {
    return (
      <div className="container" style={{ paddingTop: "100px", textAlign: "center", minHeight: "60vh", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>존재하지 않는 글입니다.</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>삭제되었거나 존재하지 않는 게시글입니다.</p>
        <button onClick={() => router.back()} className="btn btn-primary">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isLoggedIn = !!session;

  return (
    <div className="container" style={{ paddingTop: "100px", paddingBottom: "60px", maxWidth: "800px" }}>
      <button onClick={() => router.back()} className="back-btn">
        <span style={{ marginRight: "8px" }}>↩</span> 목록으로 돌아가기
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          🔗 링크가 복사되었습니다!
        </div>
      )}

      <div className="post-detail-container">
        <div className="detail-header">
          <span className="cat-badge">{post.category}</span>
          <h1 className="detail-title">{post.title}</h1>
          <div className="auth-info">
            <span className="author">By {post.authorName || "익명"}</span>
            <span className="divider">|</span>
            <span>조회 {post.views || 0}</span>
            <span className="divider">|</span>
            <span>댓글 {comments.length}</span>
            <span className="divider">|</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Content with blur for non-logged-in users */}
        <div className={`detail-content ${!isLoggedIn ? 'blurred' : ''}`}>
          {post.content?.split('\n').map((line: string, i: number) => (
            <p key={i} style={{ minHeight: line ? 'auto' : '1.2em' }}>{line}</p>
          ))}
        </div>

        {/* Blur Overlay for non-logged-in users */}
        {!isLoggedIn && (
          <div className="blur-login-overlay">
            <div className="blur-cta">
              <span className="blur-icon">🔒</span>
              <h3>회원 전용 콘텐츠입니다</h3>
              <p>로그인하면 전체 글과 댓글을 볼 수 있습니다</p>
              <Link href="/login" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                🚑 3초 만에 로그인하기
              </Link>
            </div>
          </div>
        )}

        <div className="interaction-bar">
          <button
            className={`inter-btn ${hasLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span>{hasLiked ? '❤️' : '🤍'}</span> 좋아요 {likes}
          </button>
          <button className="inter-btn" onClick={handleShare}>
            <span>🔗</span> 공유하기
          </button>
          <button
            className="inter-btn"
            style={{ color: '#ffcc00', borderColor: '#ffcc00' }}
            onClick={() => openReportModal('post', post.id)}
          >
            <span>🚨</span> 신고
          </button>
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3 className="comments-header">💬 댓글 대전 ({comments.length})</h3>

          {/* Comment List */}
          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-meta">
                      <span className="comment-author">{comment.authorName}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <button
                      className="btn-report-small"
                      onClick={() => openReportModal('comment', comment.id)}
                      title="댓글 신고"
                    >🚨</button>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-actions">
                    <button className="btn-like-small" onClick={() => handleCommentLike(comment.id)}>👍 공감</button>
                    {/* Future: Downvote button for real 'battle' */}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">아직 작성된 댓글이 없습니다. 첫 번째 조언을 남겨주세요!</p>
            )}
          </div>

          {session ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                className="comment-input"
                placeholder="형님의 지혜로운 조언을 남겨주세요. (욕설 금지)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-comment">등록</button>
            </form>
          ) : (
            <div className="login-wall">
              <p>🔒 <strong>로그인</strong>하면 형님들의 특급 조언을 더 볼 수 있습니다.</p>
              <Link href="/login" className="btn btn-primary btn-sm">
                3초 만에 로그인하고 댓글 쓰기
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {
        showReportModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>🚨 신고하기</h3>
              <p>신고 사유를 입력해주세요. ({reportType === 'post' ? '게시글' : '댓글'})</p>
              <textarea
                className="modal-textarea"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="예: 욕설, 비방, 광고 등"
              />
              <div className="modal-actions">
                <button onClick={() => setShowReportModal(false)} className="btn btn-secondary">취소</button>
                <button onClick={handleReportSubmit} className="btn btn-primary bg-red-600 border-red-600 text-white">신고 접수</button>
              </div>
            </div>
          </div>
        )
      }
      <style jsx>{`
            .container {
                color: #fff;
            }
            .back-btn {
                background: none;
                border: none;
                color: #aaa;
                cursor: pointer;
                font-size: 0.9rem;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
            }
            .back-btn:hover {
                color: #fff;
            }
            .post-detail-container {
                background: rgba(30, 30, 30, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .detail-header {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .cat-badge {
                display: inline-block;
                padding: 4px 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                font-size: 0.8rem;
                color: #ccc;
                margin-bottom: 10px;
            }
            .detail-title {
                font-size: 1.8rem;
                font-weight: bold;
                margin-bottom: 15px;
                line-height: 1.4;
            }
            .auth-info {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #888;
                font-size: 0.9rem;
            }
            .author {
                color: #fff;
                font-weight: 500;
            }
            .divider {
                color: #444;
                font-size: 0.8rem;
            }
            .detail-content {
                font-size: 1.1rem;
                line-height: 1.8;
                color: #eee;
                margin-bottom: 40px;
                min-height: 200px;
            }
            .interaction-bar {
                display: flex;
                gap: 12px;
                padding-bottom: 30px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 30px;
            }
            .inter-btn {
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
                color: #ccc;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }
            .inter-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .inter-btn.active {
                border-color: #ff4757;
                color: #ff4757;
                background: rgba(255, 71, 87, 0.15);
                font-weight: 600;
            }

            /* Toast Notification */
            .toast {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 255, 65, 0.9);
                color: #000;
                padding: 12px 28px;
                border-radius: 50px;
                font-weight: 700;
                font-size: 0.95rem;
                z-index: 9999;
                animation: toastIn 0.3s ease-out, toastOut 0.3s ease-in 2.2s;
                box-shadow: 0 8px 30px rgba(0, 255, 65, 0.3);
            }
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes toastOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            /* Blur for non-logged-in users */
            .detail-content.blurred {
                max-height: 120px;
                overflow: hidden;
                position: relative;
                filter: blur(4px);
                user-select: none;
                pointer-events: none;
            }

            .blur-login-overlay {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px 20px;
                margin: -20px 0 30px;
                background: linear-gradient(to bottom, rgba(30, 30, 30, 0), rgba(30, 30, 30, 0.95) 30%);
                border-radius: 16px;
                text-align: center;
            }

            .blur-cta {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }

            .blur-icon {
                font-size: 2.5rem;
                margin-bottom: 6px;
            }

            .blur-cta h3 {
                font-size: 1.2rem;
                color: #fff;
                margin: 0;
            }

            .blur-cta p {
                font-size: 0.9rem;
                color: #888;
                margin: 0;
            }
            
            .comments-header {
                font-size: 1.2rem;
                margin-bottom: 20px;
            }
            .comment-list {
                margin-bottom: 30px;
            }
            .comment-item {
                background: rgba(255,255,255,0.05);
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 12px;
            }
            .comment-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 0.85rem;
                color: #aaa;
            }
            .comment-author {
                color: #eee;
                font-weight: 600;
            }
            .comment-text {
                font-size: 0.95rem;
                line-height: 1.5;
                color: #ddd;
            }

            .no-comments {
                color: #666;
                text-align: center;
                padding: 30px;
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                margin-bottom: 20px;
            }
            .comment-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .comment-input {
                width: 100%;
                height: 100px;
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 15px;
                color: #fff;
                font-family: inherit;
                resize: vertical;
            }
            .comment-input:focus {
                outline: none;
                border-color: #ff4757;
            }
            .btn-comment {
                align-self: flex-end;
                padding: 10px 24px;
            }
            .login-wall {
                background: rgba(0,0,0,0.3);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                border: 1px dashed rgba(255,255,255,0.1);
            }
            .login-wall p {
                margin-bottom: 15px;
                color: #aaa;
            }

            /* Modal Styles */
            .modal-overlay {
                position: fixed;
                top: 0; 
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }
            .modal-content {
                background: #222;
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                border: 1px solid #444;
            }
            .modal-content h3 {
                margin-top: 0;
                color: #ff4757;
                margin-bottom: 10px;
            }
            .modal-content p {
                font-size: 0.9rem;
                color: #aaa;
                margin-bottom: 20px;
            }
            .modal-textarea {
                width: 100%;
                height: 100px;
                background: #333;
                border: 1px solid #555;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                resize: none;
                margin-bottom: 20px;
            }
            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            /* Comment Updates */
            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            .btn-report-small {
                background: none;
                border: none;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.5;
            }
            .btn-report-small:hover { opacity: 1; }
            
            .comment-actions {
                margin-top: 10px;
                display: flex;
                gap: 10px;
            }
            .btn-like-small {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #aaa;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                cursor: pointer;
            }
            .btn-like-small:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }
      `}</style>
    </div >
  );
}
