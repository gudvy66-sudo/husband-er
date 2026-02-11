"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

function HotPostsList({ session }: { session: any }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        // Get top 5 posts by views
        const q = query(collection(db, "posts"), orderBy("views", "desc"), limit(5));
        const snapshot = await getDocs(q);
        const loadedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(loadedPosts);
      } catch (e) {
        console.error("Error fetching hot posts:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchHotPosts();
  }, []);

  if (!isLoaded) return <div style={{ color: "white", textAlign: "center", padding: "20px" }}>데이터 로딩 중...</div>;

  const getBadgeType = (category: string) => {
    switch (category) {
      case 'urgent': return 'emergency';
      case 'question': return 'normal';
      case 'secret': return 'secret';
      default: return 'warning';
    }
  };

  const getKoreanCategory = (category: string) => {
    switch (category) {
      case 'urgent': return '긴급';
      case 'question': return '질문';
      case 'secret': return '비밀';
      default: return '자유';
    }
  };

  // 🔧 Sera's Icon System
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent': // Siren
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        );
      case 'question': // Help Circle
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'secret': // Lock
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
      default: // Free / Message Square
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
    }
  };

  return (
    <>
      <ul className="post-list">
        {posts.length > 0 ? posts.map((post) => (
          <li key={post.id} className="post-item">
            <span className={`post-badge ${getBadgeType(post.category)}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {getCategoryIcon(post.category)}
              <span>{getKoreanCategory(post.category)}</span>
            </span>
            <Link href={session ? `/community/${post.id}` : "/login"} className="post-link">
              <span className="post-title">{post.title}</span>
            </Link>
            <span className="post-meta">댓글 {post.commentCount || 0} · 조회 {post.views || 0}</span>
          </li>
        )) : (
          <li className="post-item" style={{ justifyContent: 'center', color: '#888' }}>
            아직 게시글이 없습니다
          </li>
        )}
        {/* Dummy Secret Post for non-logged in users illusion */}
        {!session && (
          <li className="post-item blur-item">
            <span className="post-badge secret">비밀</span>
            <span className="post-title">로그인하면 볼 수 있는 19금 생존 비법입니다... (클릭)</span>
            <span className="post-meta">🔒 잠김</span>
          </li>
        )}
      </ul>
      {!session && (
        <div className="blur-overlay">
          <p>더 많은 생존 꿀팁을 보려면?</p>
          <Link href="/login" className="btn btn-primary btn-sm">
            3초 만에 가입하고 전체보기
          </Link>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
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
            {session ? (
              <Link href="/community" className="btn btn-primary">
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                게시판 입장하기
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary">
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </span>
                지금 바로 입원하기 (회원가입)
              </Link>
            )}

            <Link href="/community" className="btn btn-secondary">
              <span className="btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </span>
              응급실 현황 보기
            </Link>
          </div>
        </section>

        {/* Hot Community Posts Section - Enticing Preview */}
        <section className="container" style={{ marginTop: "60px", marginBottom: "60px" }}>
          <h2 className="section-title">🔥 실시간 응급실 현황 (HOT)</h2>
          <div className="hot-posts-wrapper">
            <HotPostsList session={session} />
          </div>
        </section>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <span className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </span>
            <h3 className="card-title">익명 보장 상담소</h3>
            <p className="card-desc">
              IP 추적 불가. 완벽한 익명으로 <br />
              마음껏 하소연하세요.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <span className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <h3 className="card-title">비상금 은닉 기술</h3>
            <p className="card-desc">
              베란다 타일 밑부터 PC 본체 안까지, <br />
              선배들의 목숨 건 노하우 전수.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <span className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h.01M18 12h.01" />
                <path d="M9 12a3 3 0 1 0 6 0" />
              </svg>
            </span>
            <h3 className="card-title">장비 구매 핑계</h3>
            <p className="card-desc">
              "이거 회사에서 준 거야..." <br />
              완벽한 알리바이를 생성해드립니다.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 남편응급실. Designed by Sera & Developed by Kodari.</p>
      </footer>
    </>
  );
}
