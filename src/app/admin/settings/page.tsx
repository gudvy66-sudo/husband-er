"use client";

import { useState } from "react";

export default function AdminSettings() {
    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="title">⚙️ 관리자 설정 (Settings)</h2>
            </div>

            <div className="settings-grid">
                <div className="setting-card">
                    <h3>사이트 상태</h3>
                    <div className="control-group">
                        <label className="switch-label">
                            <span>점검 모드 (Maintenance)</span>
                            <input type="checkbox" disabled />
                            <span className="slider"></span>
                        </label>
                        <p className="desc">활성화 시 일반 사용자의 접속이 차단됩니다.</p>
                    </div>
                </div>

                <div className="setting-card">
                    <h3>가입 설정</h3>
                    <div className="control-group">
                        <label className="switch-label">
                            <span>신규 회원가입 허용</span>
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                        <p className="desc">체크 해제 시 신규 가입이 중단됩니다.</p>
                    </div>
                </div>

                <div className="setting-card">
                    <h3>시스템 정보</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="label">Next.js Version</span>
                            <span className="value">14.x</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Environment</span>
                            <span className="value">Production</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Database</span>
                            <span className="value">Firestore (Connected)</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-page-container {
                    padding: 0 4px;
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                }
                .page-header {
                    margin-bottom: 30px;
                }
                .title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #2c3e50;
                    letter-spacing: -0.5px;
                }
                
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                }

                .setting-card {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.02);
                    padding: 28px;
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .setting-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.05);
                }

                .setting-card h3 {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #32325d;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #f6f9fc;
                    padding-bottom: 16px;
                    letter-spacing: -0.5px;
                }

                .control-group { margin-bottom: 20px; }
                .desc { font-size: 0.85rem; color: #8898aa; margin-top: 8px; line-height: 1.5; }

                .switch-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    font-weight: 600;
                    color: #525f7f;
                    font-size: 0.95rem;
                }

                /* Custom Toggle Switch CSS */
                .switch-label input { display: none; }
                .slider {
                    width: 44px;
                    height: 24px;
                    background-color: #e9ecef;
                    border-radius: 24px;
                    position: relative;
                    transition: 0.3s;
                }
                .slider::before {
                    content: "";
                    position: absolute;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    top: 3px;
                    left: 3px;
                    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                input:checked + .slider { background-color: #2dce89; }
                input:checked + .slider::before { transform: translateX(20px); }
                input:disabled + .slider { opacity: 0.5; cursor: not-allowed; }

                .info-list { display: flex; flex-direction: column; gap: 16px; }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    padding: 8px 0;
                    border-bottom: 1px dashed #f6f9fc;
                }
                .info-item:last-child { border-bottom: none; }
                .info-item .label { color: #8898aa; font-weight: 500; }
                .info-item .value { font-weight: 600; color: #32325d; }
            `}</style>
        </div>
    );
}
