"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock Data (Shared with list)
const MOCK_POSTS = {
  "1": {
    id: 1,
    title: "와이프가 300만 원짜리 명품백 샀는데 저도 플스5 사도 될까요? (급)",
    content: "형님들, 지금 백화점입니다. 와이프가 카드 긁는 순간 제 머릿속에 '플스5 프로'가 스쳐 지나갔습니다. \n\n이거 공평한 거 아닙니까? 지금 지르면 등짝 스매싱일까요, 아니면 합리적 소비일까요? \n\n솔직히 저도 게임 좀 하고 싶습니다. 육아 스트레스 풀 데가 없어요. 투표 좀 부탁드립니다. \n\n1. 사라 (질러라) \n2. 참아라 (사면 죽는다) \n3. 몰래 중고로 사라",
    author: "플스마려운놈",
    date: "10분 전",
    views: 1240,
    likes: 56,
    comments: [
      { id: 101, user: "생존왕", text: "절대 안 됩니다. '나도 샀으니 너도 사'는 통하지 않습니다. 와이프 꺼는 '필수품'이고 님 꺼는 '장난감' 취급 당합니다. 팩트입니다." },
      { id: 102, user: "이미죽은자", text: "그냥 사세요. 허락보다 용서가 쉽습니다. 전 이미 샀고 베란다에서 자고 있습니다." },
      { id: 103, user: "치킨감별사", text: "차라리 그 돈으로 맛있는 거 사먹고 점수 따세요. 플스는 친구 집에서 하시고." }
    ]
  },
  "2": {
    id: 2,
    title: "비상금 들켰습니다... 베란다 타일 밑이었는데... 하...",
    content: "아니 거기를 어떻게 안 거죠? 청소하다가 발견했다는데 말이 됩니까? \n\n3년 동안 모은 450만 원... \n저녁에 압수수색 들어온다는데 어디로 튀어야 합니까? \n\n지금 친구네 집으로 도망칠까 생각 중인데 더 수상해 보이겠죠? \n급합니다. 살려주세요.",
    author: "타일공",
    date: "30분 전",
    views: 3402,
    likes: 128,
    comments: [
      { id: 201, user: "독심술사", text: "일단 무릎 꿇고 '서프라이즈 여행 가려고 모은 거야'라고 우기세요. 안 통하겠지만 10% 정도 감형 가능합니다." }
    ]
  },
  "4": {
    id: 4,
    title: "장모님 오신다는데 '야근' 핑계 댈 수 있는 앱 추천 좀...",
    content: "이번 주말입니다. 도와주십시오. \n\n회사에서 긴급 호출 온 것처럼, 부장님한테 전화 오는 것처럼 알람 울리게 하는 앱 없습니까? \n\n연기력은 자신 있습니다. 타이밍만 맞춰주면 됩니다.",
    author: "사위1호",
    date: "2시간 전",
    views: 890,
    likes: 34,
    comments: []
  }
};

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const post = MOCK_POSTS[unwrappedParams.id as keyof typeof MOCK_POSTS];
  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 주소가 복사되었습니다! (친구에게 구조 요청 보내세요)");
  };

  if (!post) {
    return (
      <div className="container" style={{ paddingTop: "100px", textAlign: "center" }}>
        <h2>존재하지 않는 글입니다. (삭제되었거나 검열당했습니다.)</h2>
        <Link href="/community" className="btn btn-primary" style={{ marginTop: "20px" }}>
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "100px", paddingBottom: "60px", maxWidth: "800px" }}>
      <button onClick={() => router.back()} className="back-btn">
        <span style={{ marginRight: "8px" }}>↩</span> 목록으로 돌아가기
      </button>

      <div className="post-detail-container">
        <div className="detail-header">
          <span className="cat-badge">잡담</span>
          <h1 className="detail-title">{post.title}</h1>
          <div className="auth-info">
            <div className="avatar">👤</div>
            <span>{post.author}</span>
            <div className="meta-divider"></div>
            <span>{post.date}</span>
            <div className="meta-divider"></div>
            <span>조회 {post.views}</span>
          </div>
        </div>

        <div className="detail-content">
          {post.content.split('\n').map((line, i) => (
            <p key={i} style={{ minHeight: line ? 'auto' : '1.2em' }}>{line}</p>
          ))}
        </div>

        <div className="interaction-bar">
          <button
            className={`inter-btn ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span> 좋아요 {likes}
          </button>
          <button className="inter-btn" onClick={handleShare}>
            <span>🔗</span> 공유하기
          </button>
          <button className="inter-btn" style={{ color: '#ffcc00', borderColor: '#ffcc00' }}>
            <span>🚨</span> 신고
          </button>
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3 className="comments-header">댓글 {post.comments.length}개</h3>

          <div className="comment-list">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <span className="comment-author">{comment.user}</span>
                  <p className="comment-body">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">가장 먼저 위로의 한마디를 남겨주세요.</p>
            )}
          </div>

          <div className="login-wall">
            <p>🔒 <strong>로그인</strong>하면 형님들의 특급 조언을 더 볼 수 있습니다.</p>
            <Link href="/login" className="btn btn-primary btn-sm">
              3초 만에 로그인하고 댓글 쓰기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
