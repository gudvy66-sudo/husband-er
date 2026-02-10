"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <Link href="/" className="logo">
          <span>🚨</span> 남편응급실.
        </Link>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {session ? (
            <>
              <Link href="/community" className="nav-link" style={{ color: "var(--primary)" }}>
                📋 게시판
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="nav-link btn-secondary"
                style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #444" }}
              >
                🚪 로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-link btn-secondary" style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #444" }}>
              🔑 로그인 / 회원가입
            </Link>
          )}
        </div>
      </nav>

      <main className="container flex-col">
        {/* Hero Section */}
        <section className="hero-section">
          <span className="badge">긴급 상황 발생! 🚑</span>

          <h1 className="hero-title">
            유부남들의 <br />
            <span className="highlight">마지막 대피소</span>
          </h1>

          <p className="hero-desc">
            "오늘도 혼나셨나요?" <br />
            아내의 잔소리, 비상금 은닉, 그리고 생존을 위한 모든 팁을 공유하는 <br />
            대한민국 1등 유부남 익명 커뮤니티입니다.
          </p>

          <div className="btn-group">
            <Link href="/login" className="btn btn-primary">
              🚑 지금 바로 입원하기 (회원가입)
            </Link>
            <Link href="/community" className="btn btn-secondary">
              👀 응급실 현황 보기
            </Link>
          </div>
        </section>

        {/* Hot Community Posts Section - Enticing Preview */}
        <section className="container" style={{ marginTop: "60px", marginBottom: "60px" }}>
          <h2 className="section-title">🔥 실시간 응급실 현황 (HOT)</h2>
          <div className="hot-posts-wrapper">
            <ul className="post-list">
              <li className="post-item">
                <span className="post-badge emergency">긴급</span>
                <span className="post-title">와이프가 300만 원짜리 명품백 샀는데 저도 플스5 사도 될까요? (급)</span>
                <span className="post-meta">댓글 52 · 조회 1.2k</span>
              </li>
              <li className="post-item">
                <span className="post-badge warning">조언</span>
                <span className="post-title">비상금 들켰습니다... 베란다 타일 밑이었는데... 하...</span>
                <span className="post-meta">댓글 89 · 조회 3.4k</span>
              </li>
              <li className="post-item">
                <span className="post-badge best">BEST</span>
                <span className="post-title">[후기] 로봇청소기인 척 하고 하루 종일 누워있었던 썰 푼다</span>
                <span className="post-meta">댓글 120 · 조회 5.1k</span>
              </li>
              <li className="post-item">
                <span className="post-badge normal">질문</span>
                <span className="post-title">장모님 오신다는데 '회사 비상 호출' 핑계 앱 추천 좀요</span>
                <span className="post-meta">댓글 34 · 조회 890</span>
              </li>
              <li className="post-item blur-item">
                <span className="post-badge secret">비밀</span>
                <span className="post-title">로그인하면 볼 수 있는 19금 생존 비법입니다... (클릭)</span>
                <span className="post-meta">🔒 잠김</span>
              </li>
            </ul>
            <div className="blur-overlay">
              <p>더 많은 생존 꿀팁을 보려면?</p>
              <Link href="/login" className="btn btn-primary btn-sm">
                3초 만에 가입하고 전체보기
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <span className="card-icon">🤐</span>
            <h3 className="card-title">익명 보장 상담소</h3>
            <p className="card-desc">
              IP 추적 불가. 완벽한 익명으로 <br />
              마음껏 하소연하세요.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <span className="card-icon">🛡️</span>
            <h3 className="card-title">비상금 은닉 기술</h3>
            <p className="card-desc">
              베란다 타일 밑부터 PC 본체 안까지, <br />
              선배들의 목숨 건 노하우 전수.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <span className="card-icon">🎮</span>
            <h3 className="card-title">장비 구매 핑계</h3>
            <p className="card-desc">
              "이거 회사에서 준 거야..." <br />
              완벽한 알리바이를 생성해드립니다.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2024 남편응급실. Designed by Sera & Developed by Kodari.</p>
      </footer>
    </>
  );
}
