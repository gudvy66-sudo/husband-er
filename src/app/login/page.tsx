"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleNaverLogin = async () => {
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

        <div className="login-buttons">
          <button onClick={handleNaverLogin} className="btn-social naver" disabled={loading}>
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
      `}</style>
    </main>
  );
}
