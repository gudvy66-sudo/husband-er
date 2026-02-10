"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// The Husband Exam - Question Bank
const QUESTIONS = [
  {
    id: 1,
    question: "Q1. 아내가 '나 뭐 달라진 거 없어?'라고 물었을 때, 가장 적절한 생존 답변은?",
    options: [
      { id: "A", text: "머리 잘랐어? (단발성 대답)", score: 10 },
      { id: "B", text: "살 빠졌나? (위험한 도박)", score: 0 },
      { id: "C", text: "(동공 지진 후) 오늘따라 더 예뻐 보이는데? (회피 기동)", score: 100 },
      { id: "D", text: "글쎄, 잘 모르겠는데. (사망)", score: -50 },
    ],
  },
  {
    id: 2,
    question: "Q2. 주말 아침, 소파에 누워있는데 청소기 소리가 들린다. 당신의 행동은?",
    options: [
      { id: "A", text: "다리를 들어 청소기가 지나가게 해준다. (매너남?)", score: 20 },
      { id: "B", text: "벌떡 일어나서 걸레를 빨아온다. (생존 본능)", score: 100 },
      { id: "C", text: "TV 볼륨을 높인다. (용자)", score: -100 },
      { id: "D", text: "자는 척한다. (비겁함)", score: 10 },
    ],
  },
  {
    id: 3,
    question: "Q3. 친구들과 술 한잔하고 늦게 귀가했다. 현관 도어락 소리에 안방 불이 탁 켜졌다. 이때 첫 마디는?",
    options: [
      { id: "A", text: "어, 자? (현실 파악 불가)", score: 0 },
      { id: "B", text: "배고프다 밥 줘. (간 큰 남자)", score: -200 },
      { id: "C", text: "(검은 봉지를 흔들며) 붕어빵 사 왔지~ (뇌물 공세)", score: 100 },
      { id: "D", text: "야, 김 부장 진짜 웃기더라. (화제 전환)", score: 30 },
    ],
  },
];

export default function HusbandExam() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionScore: number) => {
    const nextScore = score + optionScore;
    setScore(nextScore);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRank = (finalScore: number) => {
    if (finalScore >= 300) return { title: "👑 생존 고수 (만렙)", desc: "당신은 아내의 마음을 읽는 독심술사!" };
    if (finalScore >= 200) return { title: "🛡️ 중급 생존자", desc: "이 정도면 웬만한 위기는 넘길 수 있습니다." };
    if (finalScore >= 100) return { title: "🚑 응급 환자", desc: "아직 위험합니다. 더 공부하고 오세요." };
    return { title: "☠️ 사망 확정", desc: "오늘 밤 집에 들어가지 마시는 게 좋겠습니다." };
  };

  const rank = getRank(score);
  const isPassed = score >= 200; // Adjusted passing score

  return (
    <div className="exam-container">
      <div className="exam-card">
        {!showResult ? (
          <>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            <span className="question-badge">제 {currentStep + 1} 문 (난이도: {currentStep === 2 ? '최상' : '중'})</span>
            <h2 className="question-text">{QUESTIONS[currentStep].question}</h2>

            <div className="options-grid">
              {QUESTIONS[currentStep].options.map((opt) => (
                <button
                  key={opt.id}
                  className="option-btn"
                  onClick={() => handleAnswer(opt.score)}
                >
                  <span className="option-id">{opt.id}</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="result-view">
            <h2 className="result-title">
              {rank.title}
            </h2>
            <p className="result-desc">
              획득 점수: {score}점 <br />
              <span className="rank-desc" style={{ display: 'block', marginTop: '8px', color: '#00ff41' }}>
                "{rank.desc}"
              </span>
            </p>

            {isPassed ? (
              <button
                className="btn-primary"
                onClick={async () => {
                  // Sign in the user (creates session)
                  await signIn("credentials", {
                    username: "exam_passed_user",
                    password: "exam_passed_user",
                    redirect: true,
                    callbackUrl: "/community"
                  });
                }}
              >
                🎊 {rank.title}로 입장하기
              </button>
            ) : (
              <button
                className="btn-retry"
                onClick={() => window.location.reload()}
              >
                🔄 재시험 (생존 훈련 다시 하기)
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .exam-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #0d0d0d URL('/grid-pattern.png'); 
        }

        .exam-card {
           background: rgba(30, 30, 30, 0.8);
           backdrop-filter: blur(16px);
           border: 1px solid rgba(255, 255, 255, 0.1);
           padding: 40px;
           border-radius: 20px;
           width: 100%;
           max-width: 600px;
           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
           animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #333;
          border-radius: 3px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: var(--primary, #00ff41);
          transition: width 0.3s ease;
        }

        .question-badge {
          display: inline-block;
          background: #333;
          color: #aaa;
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .question-text {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 32px;
          line-height: 1.4;
          color: #fff;
        }

        .options-grid {
          display: grid;
          gap: 12px;
        }

        .option-btn {
          display: flex;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ddd;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .option-btn:hover {
          background: rgba(0, 255, 65, 0.1);
          border-color: var(--primary, #00ff41);
        }

        .option-id {
          font-weight: 800;
          margin-right: 12px;
          color: var(--primary, #00ff41);
          min-width: 20px;
        }

        /* Result View */
        .result-view {
          text-align: center;
        }

        .result-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: #fff;
        }

        .result-desc {
          color: #aaa;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .btn-primary, .btn-retry {
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          border: none;
          transition: transform 0.2s;
        }

        .btn-primary {
          background: var(--primary, #00ff41);
          color: #000;
        }

        .btn-retry {
          background: #444;
          color: #fff;
        }

        .btn-primary:hover, .btn-retry:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
