"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMockStore, Post } from "@/hooks/useMockStore";

export default function Community() {
  const { data: session } = useSession();
  const { posts } = useMockStore();
  const [activeTab, setActiveTab] = useState("all");

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
          onClick={() => setActiveTab("all")}
        >
          전체
        </button>
        <button
          className={`tab ${activeTab === "urgent" ? "active" : ""}`}
          onClick={() => setActiveTab("urgent")}
        >
          🚨 긴급
        </button>
        <button
          className={`tab ${activeTab === "free" ? "active" : ""}`}
          onClick={() => setActiveTab("free")}
        >
          🗣️ 자유
        </button>
        <button
          className={`tab ${activeTab === "question" ? "active" : ""}`}
          onClick={() => setActiveTab("question")}
        >
          ❓ 질문
        </button>
        <button
          className={`tab ${activeTab === "secret" ? "active" : ""}`}
          onClick={() => setActiveTab("secret")}
        >
          🔒 비밀
        </button>
      </div>

      <div className="post-list-wrapper">
        {filteredPosts.length > 0 ? (
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
                  <span className="author">{post.author}</span>
                  <span className="meta">
                    👀 {post.views} · 💬 {post.comments} · {post.createdAt}
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
        }
        .page-title {
            font-size: 1.8rem;
            font-weight: 800;
            margin: 0;
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 5px;
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
      `}</style>
    </main>
  );
}
