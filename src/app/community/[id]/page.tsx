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
  const { posts, isLoaded } = useMockStore();

  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (isLoaded) {
      const foundPost = posts.find(p => p.id === Number(unwrappedParams.id));
      if (foundPost) {
        setPost(foundPost);
        setLikes(foundPost.likes || 0);
      }
    }
  }, [isLoaded, posts, unwrappedParams.id]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 주소가 복사되었습니다! (친구에게 구조 요청 보내세요)");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    alert("댓글이 등록되었습니다! (Mock)");
    setCommentText("");
    // In a real app, we would update the store here
  };

  if (!isLoaded) return <div className="container" style={{ paddingTop: "100px", textAlign: "center", color: '#fff' }}>로딩 중...</div>;

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
            <span className="author">By {post.author}</span>
            <span className="divider">|</span>
            <span>조회 {post.views}</span>
            <span className="divider">|</span>
            <span>댓글 {post.comments}</span>
            <span className="divider">|</span>
            <span>{post.createdAt}</span>
          </div>
        </div>

        <div className="detail-content">
          {post.content.split('\n').map((line, i) => (
            <p key={i} style={{ minHeight: line ? 'auto' : '1.2em' }}>{line}</p>
          ))}
        </div>

        <div className="interaction-bar">
          <button
            className={`inter-btn ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span> 좋아요 {likes}
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
          <h3 className="comments-header">댓글 {post.comments}개</h3>

          {/* Comment List (Mock for now, as useMockStore doesn't store comments array deeply) */}
          <div className="comment-list">
            <p className="no-comments">아직 작성된 댓글이 없습니다.</p>
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
