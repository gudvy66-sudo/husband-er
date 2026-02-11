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

      <div className="post-list-wrapper">
        {loading ? (
          <div className="empty-state">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <ul className="post-list">
            {filteredPosts.map((post) => (
              <li key={post.id} className="post-item">
                <span className={`post-badge ${getBadgeType(post.category)}`}>
                  {getKoreanCategory(post.category)}
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
            min-width: 50px;
            text-align: center;
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
