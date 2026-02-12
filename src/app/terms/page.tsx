"use client";

import Link from "next/link";

export default function TermsPage() {
    const containerStyle = {
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#e0e0e0",
        display: "flex",
        justifyContent: "center",
        padding: "3rem 1rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    };

    const wrapperStyle = {
        maxWidth: "56rem", // max-w-4xl equivalent
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center", // Center everything in wrapper
    };

    const headerStyle = {
        textAlign: "center" as const,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const contentBoxStyle = {
        backgroundColor: "rgba(26, 26, 26, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "2rem", // smaller padding for mobile, can adjust
        borderRadius: "1rem",
        border: "1px solid #333",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        width: "100%",
        textAlign: "center" as const,
        lineHeight: "1.6",
        fontSize: "0.95rem",
    };

    const badgeWrapperStyle = {
        display: "inline-block",
        backgroundColor: "rgba(0, 255, 65, 0.1)",
        border: "1px solid rgba(0, 255, 65, 0.3)",
        borderRadius: "9999px",
        padding: "0.25rem 1rem",
        marginBottom: "1rem",
    };

    const badgeTextStyle = {
        color: "#00ff41",
        fontWeight: "bold",
        fontSize: "1.125rem", // text-lg
        margin: 0,
    };

    const sectionStyle = {
        marginBottom: "2.5rem",
    };

    const listStyle = {
        listStyleType: "none",
        padding: "1rem",
        margin: "0.5rem auto",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: "0.5rem",
        display: "inline-block",
        textAlign: "left" as const, // List items left-aligned within centered block
        color: "#9ca3af", // text-gray-400
    };

    const buttonStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.75rem 2rem",
        backgroundColor: "#00ff41",
        color: "#000",
        borderRadius: "9999px",
        fontWeight: "500",
        textDecoration: "none",
        fontSize: "1rem",
        boxShadow: "0 0 15px rgba(0, 255, 65, 0.4)",
        marginTop: "1rem",
        transition: "transform 0.2s, box-shadow 0.2s",
    };

    return (
        <div style={containerStyle}>
            <div style={wrapperStyle}>

                {/* Header */}
                <div style={headerStyle}>
                    <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
                        <h2 style={{
                            fontSize: "1.875rem",
                            fontWeight: "800",
                            color: "#00ff41",
                            letterSpacing: "-0.025em",
                            margin: 0,
                            textAlign: "center"
                        }}>
                            🚑 남편응급실
                        </h2>
                    </Link>
                    <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#9ca3af", textAlign: "center" }}>
                        대한민국 1등 유부남 익명 커뮤니티
                    </p>
                    <h1 style={{ marginTop: "1.5rem", fontSize: "2.25rem", fontWeight: "bold", color: "#fff", textAlign: "center" }}>
                        서비스 이용약관
                    </h1>
                    <p style={{ marginTop: "0.5rem", fontSize: "1.125rem", color: "#9ca3af", textAlign: "center" }}>
                        (a.k.a 유부남 생존 협약서)
                    </p>
                </div>

                {/* Content Box */}
                <div style={contentBoxStyle}>

                    <section style={sectionStyle}>
                        <div style={badgeWrapperStyle}>
                            <h3 style={badgeTextStyle}>제 1 조 (목적)</h3>
                        </div>
                        <p style={{ color: "#d1d5db", maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
                            본 약관은 <span style={{ color: "#fff", fontWeight: "bold" }}>남편응급실</span>(이하 "생존본부")이 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 생존본부의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
                            <br style={{ display: "none" }} className="sm:inline" />
                            궁극적으로는 <span style={{ color: "#00ff41" }}>대한민국 유부남들의 정신적 평화와 가정 내 생존</span>을 도모하기 위함입니다.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <div style={badgeWrapperStyle}>
                            <h3 style={badgeTextStyle}>제 2 조 (비밀 엄수 의무)</h3>
                        </div>
                        <div style={{ color: "#d1d5db", maxWidth: "42rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                            <p>1. 본 커뮤니티에서 취득한 모든 정보(비상금 은닉처, 게임기 구매 꿀팁 등)는 <span style={{ color: "#ef4444", fontWeight: "bold", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0 0.25rem", borderRadius: "0.25rem" }}>1급 기밀(Top Secret)</span>로 취급합니다.</p>
                            <p>2. 아내 또는 여자친구에게 본 사이트의 존재를 알리는 행위는 <span style={{ fontWeight: "bold", color: "#fff" }}>가장 큰 배신 행위</span>로 간주하며, 이에 따른 가정 불화에 대해 생존본부는 책임지지 않습니다.</p>
                            <p style={{ color: "#fff", fontWeight: "bold", fontSize: "1.125rem", paddingTop: "0.5rem" }}>"여기서 본 것은 무덤까지 가져간다."</p>
                        </div>
                    </section>

                    <section style={sectionStyle}>
                        <div style={badgeWrapperStyle}>
                            <h3 style={badgeTextStyle}>제 3 조 (게시물의 관리 및 책임)</h3>
                        </div>
                        <div style={{ color: "#d1d5db", maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
                            <p>1. 회원이 작성한 게시물에 대한 모든 책임은 회원 본인에게 있습니다.</p>
                            <p style={{ marginTop: "0.5rem" }}>2. 다음 각 호에 해당하는 게시물은 <span style={{ color: "#f87171" }}>사전 통보 없이 삭제</span>되거나 작성이 금지될 수 있습니다.</p>
                            <ul style={listStyle}>
                                <li>🚫 아내를 지나치게 찬양하여 타 회원의 사기를 저하시키는 글</li>
                                <li>🚫 실명, 주소 등 개인 신상을 노출하여 익명성을 해치는 글</li>
                                <li>🚫 특정인에 대한 인신공격, 욕설 등 비매너 행위</li>
                                <li>🚫 광고, 도배, 스팸성 게시물</li>
                            </ul>
                        </div>
                    </section>

                    <section style={sectionStyle}>
                        <div style={badgeWrapperStyle}>
                            <h3 style={badgeTextStyle}>제 4 조 (서비스 이용 제한)</h3>
                        </div>
                        <p style={{ color: "#d1d5db", maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
                            생존본부는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.<br />
                            특히 <span style={{ color: "#00ff41", fontWeight: "bold" }}>"아내가 보고 있다"</span>는 첩보가 입수될 경우, 해당 회원의 계정은 즉시 <span style={{ backgroundColor: "#374151", color: "#fff", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", verticalAlign: "middle" }}>LOGOUT</span> 처리됩니다.
                        </p>
                    </section>

                    <section style={sectionStyle}>
                        <div style={badgeWrapperStyle}>
                            <h3 style={badgeTextStyle}>제 5 조 (면책 조항)</h3>
                        </div>
                        <p style={{ color: "#d1d5db", maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
                            1. 생존본부는 천재지변, 서버 장애 또는 아내의 급습 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.<br />
                            2. 회원이 본 서비스의 정보를 이용하여 발생한 가정 내 분쟁(등짝 스매싱 등)에 대해 생존본부는 어떠한 책임도 지지 않습니다. <span style={{ display: "block", marginTop: "0.5rem", color: "#00ff41", fontWeight: "bold" }}>모든 작전의 실행은 본인의 책임하에 수행하십시오.</span>
                        </p>
                    </section>

                    <div style={{ paddingTop: "2rem", borderTop: "1px solid #333", width: "100%", textAlign: "center" }}>
                        <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
                            본 약관은 2026년 2월 12일부터 시행됩니다.
                        </p>
                        <Link
                            href="/"
                            style={buttonStyle}
                        >
                            동의하고 생존하러 가기
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
