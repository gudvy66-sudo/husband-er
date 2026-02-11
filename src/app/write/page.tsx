"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function WritePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    // Check if we are in edit mode
    const editPostId = searchParams.get("id");
    const isEditMode = !!editPostId;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("free");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode); // Loading state for fetching data

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            alert("🚨 로그인이 필요합니다! (입원 수속부터 해주세요)");
            router.push("/login");
        }
    }, [status, router]);

    // Fetch post data if in edit mode
    useEffect(() => {
        if (!isEditMode || !session?.user) return;

        const fetchPostData = async () => {
            try {
                const { doc, getDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                const postRef = doc(db, "posts", editPostId);
                const postSnap = await getDoc(postRef);

                if (postSnap.exists()) {
                    const data = postSnap.data();
                    // Check authorization
                    if (data.authorId !== (session.user as any).id) {
                        alert("본인의 글만 수정할 수 있습니다.");
                        router.push("/community");
                        return;
                    }

                    setTitle(data.title);
                    setContent(data.content);
                    setCategory(data.category);
                } else {
                    alert("존재하지 않는 게시글입니다.");
                    router.push("/community");
                }
            } catch (e) {
                console.error("Error fetching post:", e);
                alert("게시글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchPostData();
        }
    }, [isEditMode, editPostId, session, status, router]);

    if (status === "loading" || isLoading) {
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
            const { collection, addDoc, doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            if (isEditMode) {
                // Update existing post
                const postRef = doc(db, "posts", editPostId);
                await updateDoc(postRef, {
                    title,
                    content,
                    category,
                    updatedAt: serverTimestamp()
                });
                alert("✅ 게시글이 수정되었습니다!");
                router.push(`/community/${editPostId}`);
            } else {
                // Create new post
                await addDoc(collection(db, "posts"), {
                    title,
                    content,
                    category,
                    authorId: (session.user as any).id,
                    authorName: session.user?.name || "익명",
                    views: 0,
                    likes: 0,
                    commentCount: 0,
                    createdAt: serverTimestamp(),
                });
                alert("✅ 구조 요청이 접수되었습니다! \n베테랑 유부남들이 곧 달려올 것입니다.");
                router.push("/community");
            }

        } catch (error) {
            console.error("Error saving document: ", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container flex-col" style={{ marginTop: "100px", display: "flex", alignItems: "center" }}>
            <h1 className="page-title">{isEditMode ? "✏️ 게시글 수정" : "🚑 긴급 구조 요청서"}</h1>

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
                        취소 ({isEditMode ? "수정 취소" : "작성 취소"})
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "저장 중..." : (isEditMode ? "수정 완료" : "등록하기")}
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

export default function WritePage() {
    return (
        <Suspense fallback={<div className="container" style={{ marginTop: "100px", textAlign: "center" }}>Loading...</div>}>
            <WritePageContent />
        </Suspense>
    );
}
