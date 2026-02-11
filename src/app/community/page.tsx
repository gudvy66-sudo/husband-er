"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMockStore, Post } from "@/hooks/useMockStore";

function CommunityContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial tab from URL or default to 'all'
  const initialTab = searchParams.get("category") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL when params change (e.g. back button)
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setActiveTab(category);
  }, [searchParams]);

  // Fetch Posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Dynamic imports for performance/client-side safety
        const { collection, query, orderBy, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        // Fetch all posts ordered by date (desc)
        // Filtering client-side to avoid "Index Required" errors for now
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const loadedPosts: any[] = [];
        querySnapshot.forEach((doc) => {
          loadedPosts.push({ id: doc.id, ...doc.data() });
        });

        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without reloading
    router.push(`?category=${tab}`, { scroll: false });
  };

  const filteredPosts = activeTab === "all"
    ? posts
    : posts.filter(post => post.category === activeTab);

  const getBadgeType = (category: string) => {
    switch (category) {
      case 'urgent': return 'emergency';
      case 'question': return 'normal';
      case 'secret': return 'secret';
      default: return 'warning';
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

  const getKoreanCategory = (category: string) => {
    switch (category) {
      case 'urgent': return '긴급';
      case 'question': return '질문';
      case 'secret': return '비밀';
      default: return '자유';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="container flex-col" style={{ marginTop: "80px", maxWidth: "800px" }}>
      <div className="community-header">
        <h1 className="page-title">
          <span className="title-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2ED573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </span>
          응급실 현황 (게시판)
        </h1>
        <Link href={session ? "/write" : "/login"} className="btn btn-primary btn-sm">
          ✍️ 구조 요청 (글쓰기)
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          전체
        </button>
        <button
          className={`tab ${activeTab === "urgent" ? "active" : ""}`}
          onClick={() => handleTabChange("urgent")}
        >
          🚨 긴급
        </button>
        <button
          className={`tab ${activeTab === "free" ? "active" : ""}`}
          onClick={() => handleTabChange("free")}
        >
          🗣️ 자유
        </button>
        <button
          className={`tab ${activeTab === "question" ? "active" : ""}`}
          onClick={() => handleTabChange("question")}
        >
          ❓ 질문
        </button>
        <button
          className={`tab ${activeTab === "secret" ? "active" : ""}`}
          onClick={() => handleTabChange("secret")}
        >
          🔒 비밀
        </button>
      </div>

      <div className="post-list-wrapper" style={{ position: 'relative' }}>
        {loading ? (
          <div className="empty-state">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <ul className="post-list">
              {(session ? filteredPosts : filteredPosts.slice(0, 3)).map((post) => (
                <li key={post.id} className="post-item">
                  <span className={`post-badge ${getBadgeType(post.category)}`}>
                    {getCategoryIcon(post.category)}
                    <span>{getKoreanCategory(post.category)}</span>
                  </span>

                  <Link href={session ? `/community/${post.id}` : "/login"} className="post-link">
                    <span className="post-title">{post.title}</span>
                  </Link>
                  <div className="post-info">
                    <span className="author">{post.authorName || "익명"}</span>
                    <span className="meta">
                      👀 {post.views || 0} · 💬 {post.commentCount || 0} · {formatDate(post.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {!session && filteredPosts.length > 3 && (
              <div className="community-login-wall">
                <div className="community-login-cta">
                  <span style={{ fontSize: '2rem' }}>🔒</span>
                  <h3>나머지 {filteredPosts.length - 3}개 글이 더 있습니다</h3>
                  <p>로그인하면 전체 게시판을 이용할 수 있어요</p>
                  <Link href="/login" className="btn btn-primary btn-sm">
                    🚑 3초 만에 로그인하기
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>📭 아직 등록된 글이 없습니다. 첫 번째 구조 요청을 보내보세요!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .community-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 24px;
            gap: 12px;
            flex-wrap: wrap;
        }
        .page-title {
            font-size: clamp(1.2rem, 4vw, 1.8rem);
            font-weight: 800;
            margin: 0;
            line-height: 1.3;
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 2px;
        }
        .tabs::-webkit-scrollbar {
            display: none;
        }
        .tab {
            padding: 8px 16px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #aaa;
            cursor: pointer;
            font-size: 0.9rem;
            white-space: nowrap;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .tab.active {
            background: #FF4757;
            color: white;
            border-color: #FF4757;
            font-weight: bold;
        }
        .tab:hover:not(.active) {
            background: rgba(255, 255, 255, 0.1);
        }

        .post-list-wrapper {
            width: 100%;
            background: rgba(30, 30, 30, 0.4);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 20px;
            min-height: 300px;
        }
        .post-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .post-item {
            display: flex;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .post-item:last-child {
            border-bottom: none;
        }
        .post-badge {
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 700;
            margin-right: 12px;
            min-width: 60px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .post-badge.emergency { background: rgba(255, 71, 87, 0.2); color: #FF4757; }
        .post-badge.warning { background: rgba(255, 165, 2, 0.2); color: #FFA502; }
        .post-badge.normal { background: rgba(46, 213, 115, 0.2); color: #2ED573; }
        .post-badge.best { background: rgba(55, 66, 250, 0.2); color: #3742FA; }
        .post-badge.secret { background: rgba(164, 176, 190, 0.2); color: #A4B0BE; }

        .post-link {
            flex: 1;
            text-decoration: none;
            color: #eee;
            margin-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .post-title:hover {
            text-decoration: underline;
            color: white;
        }
        
        .post-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 0.8rem;
            color: #888;
            min-width: 120px;
        }
        .author {
            color: #aaa;
            margin-bottom: 2px;
        }
        .empty-state {
            padding: 40px;
            text-align: center;
            color: #666;
        }

        .community-login-wall {
            padding: 40px 20px;
            background: linear-gradient(to bottom, rgba(30, 30, 30, 0), rgba(30, 30, 30, 0.98) 30%);
            text-align: center;
            margin-top: -20px;
        }
        .community-login-cta {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .community-login-cta h3 {
            font-size: 1.1rem;
            color: #fff;
            margin: 0;
        }
        .community-login-cta p {
            font-size: 0.9rem;
            color: #888;
            margin: 0;
        }

        @media (max-width: 480px) {
            .community-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .page-title {
                font-size: 1.3rem;
            }
        }
      `}</style>
    </main>
  );
}

export default function Community() {
  return (
    <Suspense fallback={<div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
