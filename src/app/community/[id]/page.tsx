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
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

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
    // Simple local toggle + DB update (Not preventing multiple likes per user deeply for MVP)
    // Actually, let's just increment for now as per instruction "Implement handleLike to increment 'likes'"

    try {
      const { doc, updateDoc, increment } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const postRef = doc(db, "posts", unwrappedParams.id);

      await updateDoc(postRef, { likes: increment(1) });
      setLikes(prev => prev + 1);
    } catch (e) {
      console.error("Like failed", e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 주소가 복사되었습니다! (친구에게 구조 요청 보내세요)");
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

  return (
    <div className="container" style={{ paddingTop: "100px", paddingBottom: "60px", maxWidth: "800px" }}>
      <button onClick={() => router.back()} className="back-btn">
        <span style={{ marginRight: "8px" }}>↩</span> 목록으로 돌아가기
      </button>

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

        <div className="detail-content">
          {post.content?.split('\n').map((line: string, i: number) => (
            <p key={i} style={{ minHeight: line ? 'auto' : '1.2em' }}>{line}</p>
          ))}
        </div>

        <div className="interaction-bar">
          <button
            className="inter-btn"
            onClick={handleLike}
          >
            <span>❤️</span> 좋아요 {likes}
          </button>
          <button className="inter-btn" onClick={handleShare}>
            <span>🔗</span> 공유하기
          </button>
          <button className="inter-btn" style={{ color: '#ffcc00', borderColor: '#ffcc00' }}>
            <span>🚨</span> 신고
          </button>
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3 className="comments-header">댓글 {comments.length}개</h3>

          {/* Comment List */}
          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
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
                placeholder="형님의 지혜로운 조언을 남겨주세요."
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
                background: rgba(255, 71, 87, 0.1);
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
       `}</style>
    </div>
  );
}
