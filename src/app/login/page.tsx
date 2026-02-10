"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMockLogin = async (provider: string) => {
    setIsLoading(true);
    // Simulate API delay for UX
    setTimeout(async () => {
      // For demo/testing purposes, all login methods work!
      await signIn("credentials", {
        username: `${provider}_user`,
        password: `${provider}_user`,
        callbackUrl: "/exam"
      });
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          <span>🚔</span> 신원 확인
        </h1>
        <p className="login-desc">
          여기는 유부남 전용 구역입니다. <br />
          간편 로그인으로 3초 만에 입장하세요.
        </p>

        <div className="auth-buttons">
          <button
            className="btn-auth kakao"
            onClick={() => handleMockLogin("kakao")}
            disabled={isLoading}
          >
            <span className="icon">💬</span> 카카오로 3초 만에 시작 (테스트)
          </button>

          <button
            className="btn-auth naver"
            onClick={() => handleMockLogin("naver")}
            disabled={isLoading}
          >
            <span className="icon">🇳</span> 네이버로 시작하기 (테스트)
          </button>
        </div>

        <div className="divider">
          <span>또는</span>
        </div>

        <button
          className="btn-text"
          onClick={() => handleMockLogin("admin")}
        >
          🕵️ 테스트 계정으로 입장 (관리자용)
        </button>

        <p className="login-footer">
          가입 시 <strong>아내의 접근</strong>으로부터 보호받을 수 있습니다. <br />
          (물론 책임은 본인에게 있습니다.)
        </p>
      </div>

      <style jsx>{`
        .login-container {
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
           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
           animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: #fff;
        }

        .login-title span {
          margin-right: 8px;
          font-size: 2rem;
        }

        .login-desc {
          color: #888;
          font-size: 0.95rem;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-auth {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
        }

        .btn-auth:hover {
          transform: scale(1.02);
          filter: brightness(1.1);
        }

        .btn-auth:active {
          transform: scale(0.98);
        }

        .btn-auth .icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .kakao {
          background-color: #FEE500;
          color: #000;
        }

        .naver {
          background-color: #03C75A;
          color: #fff;
        }

        .divider {
          margin: 24px 0;
          position: relative;
          color: #444;
          font-size: 0.8rem;
        }

        .divider::before, .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #333;
        }

        .divider::before { left: 0; }
        .divider::after { right: 0; }

        .btn-text {
          background: none;
          border: none;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-text:hover { color: #fff; }

        .login-footer {
          margin-top: 32px;
          font-size: 0.75rem;
          color: #444;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
