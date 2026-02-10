"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_POSTS = [
    {
        id: 1,
        title: "와이프가 300만 원짜리 명품백 샀는데 저도 플스5 사도 될까요? (급)",
        content: "형님들, 지금 백화점입니다. 와이프가 카드 긁는 순간 제 머릿속에 '플스5 프로'가 스쳐 지나갔습니다. 이거 공평한 거 아닙니까? 지금 지르면 등짝 스매싱일까요, 아니면 합리적 소비일까요? 투표 좀 부탁드립니다.",
        author: "플스마려운놈",
        date: "10분 전",
        views: 1240,
        likes: 56,
        comments: [
            { user: "생존왕", text: "절대 안 됩니다. '나도 샀으니 너도 사'는 통하지 않습니다. 와이프 꺼는 '필수품'이고 님 꺼는 '장난감' 취급 당합니다." },
            { user: "이미죽은자", text: "그냥 사세요. 허락보다 용서가 쉽습니다." }
        ]
    },
    {
        id: 2,
        title: "비상금 들켰습니다... 베란다 타일 밑이었는데... 하...",
        content: "아니 거기를 어떻게 안 거죠? 청소하다가 발견했다는데 말이 됩니까? 3년 동안 모은 450만 원... 저녁에 압수수색 들어온다는데 어디로 튀어야 합니까? 급합니다.",
        author: "타일공",
        date: "30분 전",
        views: 3402,
        likes: 128,
        comments: [
            { user: "독심술사", text: "일단 무릎 꿇고 '서프라이즈 여행 가려고 모은 거야'라고 우기세요. 안 통하겠지만..." }
        ]
    },
    {
        id: 3,
        title: "[19금 생존 비법] 주말에 아내를 잠재우는 마사지 스킬 (후방주의)",
        content: "이 글은 회원 등급 '중급 생존자' 이상만 열람 가능합니다. (로그인이 필요합니다)",
        isLocked: true,
        author: "마사지신",
        date: "1시간 전",
        views: 5100,
        likes: 450,
        comments: []
    },
    {
        id: 4,
        title: "장모님 오신다는데 '야근' 핑계 댈 수 있는 앱 추천 좀...",
        content: "이번 주말입니다. 도와주십시오. 회사에서 긴급 호출 온 것처럼 알람 울리게 하는 앱 없습니까?",
        author: "사위1호",
        date: "2시간 전",
        views: 890,
        likes: 34,
        comments: []
    }
];

export default function CommunityList() {
    const [filter, setFilter] = useState("all");

    return (
        <div className="container" style={{ paddingTop: "100px", paddingBottom: "60px" }}>
            <div className="community-header">
                <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "10px" }}>📋 응급실 대기 현황</h1>
                <p style={{ color: "#aaa" }}>
                    현재 {MOCK_POSTS.length}명의 유부남이 구조를 기다리고 있습니다.
                </p>
                <Link href="/write" className="btn btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>
                    🖊️ 구조 요청 (글쓰기)
                </Link>
            </div>

            <div className="post-list-card">
                {MOCK_POSTS.map((post) => (
                    <div key={post.id} className={`post-item ${post.isLocked ? 'locked' : ''}`}>
                        <div className="post-content">
                            <Link href={post.isLocked ? "/login" : `/community/${post.id}`} className="post-link">
                                <h3 className="post-title">
                                    {post.isLocked && <span className="lock-icon">🔒 </span>}
                                    {post.title}
                                </h3>
                                <div className="post-meta">
                                    <span>{post.author}</span> · <span>{post.date}</span> · <span>조회 {post.views}</span>
                                </div>
                            </Link>
                        </div>
                        <div className="post-actions">
                            <span className="likes">❤️ {post.likes}</span>
                            <span className="comments">💬 {post.comments.length}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .community-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .post-list-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .post-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }

        .post-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .post-item.locked {
          opacity: 0.7;
          background: rgba(0, 0, 0, 0.2);
        }

        .post-link {
          display: block;
          width: 100%;
        }

        .post-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .lock-icon {
          margin-right: 5px;
        }

        .post-meta {
          font-size: 0.85rem;
          color: #888;
        }

        .post-actions {
          display: flex;
          gap: 12px;
          color: #aaa;
          font-size: 0.9rem;
          min-width: 80px;
          justify-content: flex-end;
        }
      `}</style>
        </div>
    );
}
