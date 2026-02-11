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

  return (
    <>
      <ul className="post-list">
        {posts.length > 0 ? posts.map((post) => (
          <Link key={post.id} href={session ? `/community/${post.id}` : "/login"} style={{ textDecoration: 'none', color: 'inherit' }}>
            <li className="post-item">
              <span className={`post-badge ${getBadgeType(post.category)}`}>{getKoreanCategory(post.category)}</span>
              <span className="post-title">{post.title}</span>
              <span className="post-meta">댓글 {post.commentCount || 0} · 조회 {post.views || 0}</span>
            </li>
          </Link>
        )) : (
          <li className="post-item" style={{ justifyContent: 'center', color: '#888' }}>
            아직 게시글이 없습니다
          </li>
        )}
        {/* Dummy Secret Post for non-logged in users */}
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
                📋 게시판 입장하기
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary">
                🚑 지금 바로 입원하기 (회원가입)
              </Link>
            )}

            <Link href="/community" className="btn btn-secondary">
              👀 응급실 현황 보기
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
        <p>© 2026 남편응급실. Designed by Sera & Developed by Kodari.</p>
      </footer>
    </>
  );
}
