"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function WritePage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // Default category 'free'
    const [category, setCategory] = useState("free");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            alert("🚨 로그인이 필요합니다! (입원 수속부터 해주세요)");
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="container" style={{ marginTop: "100px", textAlign: "center" }}>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Dynamic import to avoid SSR issues with Firebase if any (though usually fine in useEffect/handlers)
            // But let's import at top level for cleaner code as this is a "use client" file.
            // Wait, to be safe and consistent with previous patterns, we can use dynamic or top level.
            // Let's use top level imports since we are in "use client" and it's standard Next.js 13+ practice.
            // However, the tool replacement will replace the whole file content or block.
            // I need to make sure imports are present. 
            // The constraint is I am replacing the function body. I should add imports at the top using a separate block or include them here?
            // "Rewrite the WritePage component" implies I can change the whole file or large chunks.
            // Efficient way: Replace the whole file content to ensure imports are correct.

            // Actually, I'll use the 'replace_file_content' on the whole file or large range.
            // Let's replace the whole file content to be safe and clean.

            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await addDoc(collection(db, "posts"), {
                title,
                content,
                category,
                authorId: (session.user as any).id, // Ensure id is available in session
                authorName: session.user?.name || "익명",
                views: 0,
                likes: 0,
                commentCount: 0,
                createdAt: serverTimestamp(),
            });

            alert("✅ 구조 요청이 접수되었습니다! \n베테랑 유부남들이 곧 달려올 것입니다.");
            router.push("/community");

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container flex-col" style={{ marginTop: "100px", display: "flex", alignItems: "center" }}>
            <h1 className="page-title">🚑 긴급 구조 요청서</h1>

            <form onSubmit={handleSubmit} className="write-form">
                <div className="form-group">
                    <label className="label" htmlFor="category">유형 선택</label>
                    <select
                        className="input-field"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="free">자유게시판 (잡담/후기)</option>
                        <option value="question">질문/답변 (조언구함)</option>
                        <option value="urgent">🚨 긴급상황 (SOS)</option>
                        <option value="secret">🔒 비밀보장 (익명/19금)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="title">제목</label>
                    <input
                        className="input-field"
                        type="text"
                        id="title"
                        placeholder="예: 와이프가 명품백을 샀는데..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="content">상세 내용</label>
                    <textarea
                        className="textarea-field"
                        id="content"
                        placeholder="상황을 상세히 기술해주십시오."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="btn-group">
                    <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                        취소
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "전송 중..." : "등록하기"}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .write-form {
                    width: 100%;
                    max-width: 600px;
                    background: rgba(30, 30, 30, 0.6);
                    backdrop-filter: blur(10px);
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #ddd;
                }
                .input-field, .textarea-field {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 1rem;
                }
                .input-field option {
                    background: #222;
                    color: white;
                }
                .textarea-field {
                    height: 200px;
                    resize: vertical;
                }
                .btn-group {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 20px;
                }
                .page-title {
                    font-size: 2rem;
                    margin-bottom: 30px;
                    text-align: center;
                }
            `}</style>
        </main>
    );
}
