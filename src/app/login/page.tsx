"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleNaverLogin = async () => {
    if (!agreed) {
      alert("🚨 약관에 동의해야 입장 가능합니다!");
      return;
    }
    setLoading(true);
    await signIn("naver", { callbackUrl: "/community" });
  };

  const handleAdminLogin = async () => {
    // Secret Admin Login for Testing
    if (confirm("관리자 계정으로 접속하시겠습니까?")) {
      await signIn("credentials", {
        username: "admin",
        password: "admin",
        callbackUrl: "/community"
      });
    }
  };

  return (
    <main>
      <div className="login-card">
        <h1 className="login-title">🚨 긴급 입원 수속</h1>
        <p className="login-desc">
          대한민국 유부남들의 마지막 대피소 <br />
          <span className="highlight">남편응급실</span>에 오신 것을 환영합니다.
        </p>

        {/* Terms Checkbox */}
        <div className="terms-container">
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span style={{ marginLeft: "8px" }}>
              <span className="terms-link" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>
                [필수] 이용약관 및 개인정보처리방침
              </span>에 동의합니다.
            </span>
          </label>
        </div>

        <div className="login-buttons">
          <button
            onClick={handleNaverLogin}
            className={`btn-social naver ${!agreed ? 'disabled' : ''}`}
            disabled={loading || !agreed}
          >
            {loading ? "연결 중..." : "N 네이버로 시작하기"}
          </button>

          <div className="division-line"></div>

          {/* Dev Only: Admin Login */}
          <button
            onClick={handleAdminLogin}
            className="btn-admin"
          >
            🕵️ 관리자(테스트) 접속
          </button>
        </div>

        <p className="login-footer">
          아직 회원이 아니신가요? <br />
          네이버 아이디 하나로 즉시 입원 가능합니다.
        </p>

        <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#666" }}>
          <p>⚠️ 아내분이 보고 계신가요?</p>
          <p>
            <Link href="https://www.naver.com" style={{ color: "#888", textDecoration: "underline" }}>
              긴급 탈출 버튼 (네이버 메인으로 이동)
            </Link>
          </p>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📜 이용약관 및 개인정보 동의</h3>
            <div className="terms-text">
              <p><strong>1. 서비스 목적</strong><br />본 커뮤니티는 대한민국 기혼 남성들의 고충을 나누는 익명 공간입니다.</p>
              <p><strong>2. 가입 제한</strong><br />미혼 남성 및 여성의 가입을 엄격히 금지하며, 적발 시 즉시 추방됩니다.</p>
              <p><strong>3. 개인정보 수집</strong><br />로그인 식별 및 성별 확인을 위해 네이버 아이디 고유값, 성별 정보를 수집하며 그 외 개인정보는 저장하지 않습니다.</p>
              <p><strong>4. 책임의 한계</strong><br />작성된 게시글의 법적 책임은 작성자 본인에게 있습니다.</p>
              <p><strong>5. 금지 행위</strong><br />욕설, 비방, 음란물 게시 등 미풍양속을 해치는 행위 시 통보 없이 활동이 정지됩니다.</p>
            </div>
            <button className="btn-close" onClick={() => { setAgreed(true); setShowTerms(false); }}>
              동의하고 닫기
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        main {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
        }

        .login-card {
          background: rgba(25, 25, 25, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 24px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .highlight {
          color: #FF4757;
          text-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
        }

        .login-desc {
          font-size: 1rem;
          color: #aaa;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        /* Terms Styles */
        .terms-container {
            margin-bottom: 20px;
            font-size: 0.9rem;
            color: #ccc;
            text-align: left;
            padding: 0 10px;
        }
        .terms-label {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .terms-link {
            color: #FF4757;
            text-decoration: underline;
            cursor: pointer;
        }
        .terms-link:hover {
            color: #eb4d4b;
        }

        .login-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-social {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .btn-social:hover {
          transform: scale(1.02);
          filter: brightness(1.1);
        }
        
        .btn-social.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            filter: grayscale(1);
        }
        .btn-social.disabled:hover {
            transform: none;
        }

        .btn-social:active {
          transform: scale(0.98);
        }

        .naver {
          background: #03C75A;
          color: white;
        }

        .division-line {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 16px 0;
        }

        .btn-admin {
          margin-top: 10px;
          background: transparent;
          border: 1px dashed #444;
          color: #666;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          width: 100%;
        }

        .btn-admin:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #888;
        }

        .login-footer {
          margin-top: 32px;
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        }
        .modal-content {
            background: #222;
            padding: 30px;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            border: 1px solid #444;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-content h3 {
            color: #fff;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
        }
        .terms-text {
            font-size: 0.9rem;
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 24px;
            background: rgba(0,0,0,0.3);
            padding: 16px;
            border-radius: 8px;
            text-align: left;
        }
        .terms-text p {
            margin-bottom: 12px;
        }
        .terms-text strong {
            color: #FF4757;
        }
        .btn-close {
            width: 100%;
            padding: 12px;
            background: #FF4757;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        }
        .btn-close:hover {
            background: #eb4d4b;
        }
      `}</style>
    </main>
  );
}
