"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!session?.user) return;

      try {
        const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        // The user id in session might be under 'id' or 'sub' or just we use email if id not present
        const userId = (session.user as any).id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "posts"),
          where("authorId", "==", userId),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        }));

        setMyPosts(posts);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchMyPosts();
    }
  }, [session]);

  if (!session) return null;

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <Link href="/" className="back-link">← 홈으로</Link>
        <h1 className="profile-title">마이페이지</h1>
      </div>

      {/* User Card */}
      <div className="user-card">
        <div className="avatar-large">👤</div>
        <h2 className="username">{session.user?.name || "익명의 유부남"}</h2>
        <p className="user-email">{session.user?.email}</p>
        <p className="user-desc">오늘도 생존을 위해 고군분투하는 당신을 응원합니다.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{myPosts.length}</div>
          <div className="stat-label">작성 글</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {myPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
          </div>
          <div className="stat-label">총 조회수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {myPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
          </div>
          <div className="stat-label">받은 좋아요</div>
        </div>
      </div>

      {/* My Posts */}
      <div className="section">
        <h3 className="section-title">내가 쓴 글</h3>
        <div className="post-list">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>로딩 중...</div>
          ) : myPosts.length > 0 ? (
            myPosts.map((post) => (
              <Link href={`/community/${post.id}`} key={post.id} className="post-item-small">
                <span className="post-title-small">{post.title}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>작성한 글이 없습니다.</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button
          className="btn-logout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          🚪 로그아웃
        </button>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 100px auto 60px;
          padding: 20px;
        }

        .profile-header {
          margin-bottom: 32px;
        }

        .back-link {
          color: #888;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: inline-block;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .profile-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
        }

        .user-card {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          margin-bottom: 24px;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(0, 255, 65, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 16px;
          border: 2px solid var(--primary);
        }

        .username {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .user-email {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        
        .user-desc {
            color: #aaa;
            font-size: 0.95rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #888;
        }

        .section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .post-list {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
        }

        .post-item-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .post-item-small:last-child {
          border-bottom: none;
        }

        .post-item-small:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .post-title-small {
          color: #ddd;
          font-size: 0.95rem;
        }

        .post-date {
          color: #666;
          font-size: 0.8rem;
        }

        .actions {
          text-align: center;
          margin-top: 40px;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ccc;
          padding: 12px 32px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: rgba(255, 0, 0, 0.1);
          border-color: #ff0055;
          color: #ff0055;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .profile-container {
            margin-top: 80px;
            padding: 16px;
          }

          .user-card {
            padding: 24px;
          }

          .avatar-large {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }

          .username {
            font-size: 1.2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 8px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
             .stats-grid {
                grid-template-columns: 1fr; /* Stack on very small screens */
             }
        }

      `}</style>
    </div>
  );
}
