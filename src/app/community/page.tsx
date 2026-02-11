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
        <h1 className="page-title">📋 응급실 현황 (게시판)</h1>
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
                <li key={post.id} className="post-li">
                  <Link href={session ? `/community/${post.id}` : "/login"} className="post-item-link">
                    <span className={`post-badge ${getBadgeType(post.category)}`}>
                      {getKoreanCategory(post.category)}
                    </span>

                    <span className="post-title">{post.title}</span>

                    <div className="post-info">
                      <span className="author">{post.authorName || "익명"}</span>
                      <span className="meta">
                        👀 {post.views || 0} · 💬 {post.commentCount || 0} · {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </Link>
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
        .post-li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .post-li:last-child {
            border-bottom: none;
        }
        .post-item-link {
            display: flex;
            align-items: center;
            padding: 16px 0;
            text-decoration: none;
            color: inherit;
            width: 100%;
            transition: background 0.2s;
        }
        .post-item-link:hover {
            background: rgba(255, 255, 255, 0.02);
        }

        .post-badge {
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 700;
            margin-right: 12px;
            min-width: 50px;
            text-align: center;
            flex-shrink: 0;
        }
        .post-badge.emergency { background: rgba(255, 71, 87, 0.2); color: #FF4757; }
        .post-badge.warning { background: rgba(255, 165, 2, 0.2); color: #FFA502; }
        .post-badge.normal { background: rgba(46, 213, 115, 0.2); color: #2ED573; }
        .post-badge.best { background: rgba(55, 66, 250, 0.2); color: #3742FA; }
        .post-badge.secret { background: rgba(164, 176, 190, 0.2); color: #A4B0BE; }

        .post-title {
            flex: 1;
            color: #eee;
            margin-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
        }
        
        .post-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 0.8rem;
            color: #888;
            min-width: 120px;
            flex-shrink: 0;
        }
        .author {
            color: #aaa;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100px; /* Limit author width on mobile */
            text-align: right;
        }
        .empty-state {
            padding: 40px;
            text-align: center;
            color: #666;
        }

        /* ... existing login wall styles ... */
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
            .post-item-link {
                flex-wrap: wrap;
            }
            .post-title {
                min-width: 0; /* Enable truncation inside flex item */
            }
            .post-info {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 6px;
                color: #666;
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
