"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "./write.css";

export default function WritePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            alert("🚨 로그인이 필요합니다! (입원 수속부터 해주세요)");
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="write-container"><p style={{ textAlign: "center" }}>확인 중...</p></div>;
    }

    if (!session) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요. (절박함이 느껴져야 합니다.)");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            alert("✅ 구조 요청이 접수되었습니다! \n베테랑 유부남들이 곧 달려올 것입니다.");
            router.push("/community");
        }, 1200);
    };

    return (
        <div className="write-container">
            <h1 className="write-title">🚑 긴급 구조 요청서</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="title">
                        사태 개요 (Title)
                    </label>
                    <input
                        className="input-field"
                        type="text"
                        id="title"
                        placeholder="예: 와이프가 300만 원짜리 명품백을 샀는데..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <p className="help-text">최대한 자극적이고 급박하게 적어야 구조대가 빨리 옵니다.</p>
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="content">
                        피해 상황 보고 (Content)
                    </label>
                    <textarea
                        className="textarea-field"
                        id="content"
                        placeholder="육하원칙에 의거하여 현재의 위기 상황을 상세히 기술하십시오. (비방, 욕설 금지)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "전송 중... 📡" : "🆘 즉시 전송 (구조 요청)"}
                </button>
            </form>
        </div>
    );
}
