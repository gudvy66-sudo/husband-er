"use client";

import { useState } from "react";

export default function AdminReports() {
    // Mock data for now, waiting for reports collection
    const [reports] = useState<any[]>([]);

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="title">🚨 신고 접수 (Reports)</h2>
                <div className="header-actions">
                    <button className="btn-refresh">새로고침 🔄</button>
                </div>
            </div>

            <div className="content-container">
                {reports.length > 0 ? (
                    <div>신고 목록이여기에 표시됩니다.</div>
                ) : (
                    <div className="empty-state">
                        <div className="icon">✅</div>
                        <h3>현재 접수된 신고가 없습니다.</h3>
                        <p>모든 게시글과 댓글이 평화롭습니다.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .admin-page-container { padding: 0 4px; }
                .page-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
                }
                .title { font-size: 1.5rem; font-weight: 700; color: #333; }
                .btn-refresh {
                    padding: 8px 16px; background: #fff; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;
                }
                
                .content-container {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    padding: 40px;
                    min-height: 400px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .empty-state { text-align: center; color: #555; }
                .icon { font-size: 3rem; margin-bottom: 16px; }
                .empty-state h3 { font-size: 1.2rem; margin-bottom: 8px; color: #333; }
                .empty-state p { color: #888; }
            `}</style>
        </div>
    );
}
