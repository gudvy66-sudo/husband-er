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
                .admin-page-container { padding: 0 4px; }
                .title { font-size: 1.5rem; font-weight: 700; color: #333; margin-bottom: 24px; }
                
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                .setting-card {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    padding: 24px;
                }

                .setting-card h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }

                .control-group { margin-bottom: 12px; }
                .desc { font-size: 0.85rem; color: #888; margin-top: 8px; }

                .switch-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    font-weight: 500;
                    color: #555;
                }

                .info-list { display: flex; flex-direction: column; gap: 12px; }
                .info-item { display: flex; justify-content: space-between; font-size: 0.9rem; }
                .info-item .label { color: #888; }
                .info-item .value { font-weight: 600; color: #333; }
            `}</style>
        </div>
    );
}
