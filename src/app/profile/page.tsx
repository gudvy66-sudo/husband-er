"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  if (!session) {
    router.push("/login");
    return null;
  }

  // Get user's rank from session (mock for now)
  const userRank = {
    title: "생존의 달인",
    level: "Survival Master",
    score: 300,
    icon: "🏆",
    color: "#FFD700"
  };

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

        {/* Rank Badge */}
        <div className="rank-badge" style={{ borderColor: userRank.color }}>
          <span className="rank-icon">{userRank.icon}</span>
          <div className="rank-info">
            <span className="rank-title">{userRank.title}</span>
            <span className="rank-level">{userRank.level}</span>
          </div>
        </div>

        <div className="rank-score">시험 점수: {userRank.score}점</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">작성 글</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">댓글</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">56</div>
          <div className="stat-label">받은 좋아요</div>
        </div>
      </div>

      {/* My Posts */}
      <div className="section">
        <h3 className="section-title">내가 쓴 글</h3>
        <div className="post-list">
          <Link href="/community/1" className="post-item-small">
            <span className="post-title-small">와이프가 300만 원짜리 명품백을...</span>
            <span className="post-date">2일 전</span>
          </Link>
          <Link href="/community/2" className="post-item-small">
            <span className="post-title-small">비상금 들켰습니다...</span>
            <span className="post-date">5일 전</span>
          </Link>
          <Link href="/community/4" className="post-item-small">
            <span className="post-title-small">장모님 방문 대비책</span>
            <span className="post-date">1주 전</span>
          </Link>
        </div>
      </div>

      {/* Achievements */}
      <div className="section">
        <h3 className="section-title">획득 배지</h3>
        <div className="badges-grid">
          <div className="badge-item">
            <span className="badge-icon">✍️</span>
            <span className="badge-name">첫 글 작성</span>
          </div>
          <div className="badge-item">
            <span className="badge-icon">💬</span>
            <span className="badge-name">댓글 달인</span>
          </div>
          <div className="badge-item locked">
            <span className="badge-icon">🏅</span>
            <span className="badge-name">인기글 작성</span>
          </div>
          <div className="badge-item locked">
            <span className="badge-icon">⭐</span>
            <span className="badge-name">베스트 글 10개</span>
          </div>
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
          margin-bottom: 24px;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 50px;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #FFD700;
          margin-bottom: 12px;
        }

        .rank-icon {
          font-size: 1.5rem;
        }

        .rank-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .rank-title {
          font-weight: 700;
          color: #FFD700;
          font-size: 1rem;
        }

        .rank-level {
          font-size: 0.75rem;
          color: #ccc;
        }

        .rank-score {
          color: #aaa;
          font-size: 0.9rem;
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

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .badge-item {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 255, 65, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .badge-item.locked {
          opacity: 0.4;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .badge-icon {
          font-size: 2rem;
        }

        .badge-name {
          font-size: 0.85rem;
          color: #ccc;
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
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .badges-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
