"use client";

import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h2 className="text-3xl font-extrabold text-[#00ff41] tracking-tight hover:scale-105 transition-transform">
                            🚑 남편응급실
                        </h2>
                    </Link>
                    <p className="mt-2 text-sm text-gray-400">
                        대한민국 1등 유부남 익명 커뮤니티
                    </p>
                    <h1 className="mt-6 text-4xl font-bold text-white">
                        서비스 이용약관
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        (a.k.a 유부남 생존 협약서)
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] shadow-2xl space-y-8 text-sm leading-relaxed">

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-[#00ff41] pl-3">
                            제 1 조 (목적)
                        </h3>
                        <p className="text-gray-300">
                            본 약관은 <span className="text-[#00ff41] font-bold">남편응급실</span>(이하 "생존본부")이 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 생존본부의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
                            궁극적으로는 대한민국 유부남들의 정신적 평화와 가정 내 생존을 도모하기 위함입니다.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-[#00ff41] pl-3">
                            제 2 조 (비밀 엄수 의무)
                        </h3>
                        <p className="text-gray-300">
                            1. 본 커뮤니티에서 취득한 모든 정보(비상금 은닉처, 게임기 구매 꿀팁 등)는 <span className="text-red-500 font-bold">대외비</span>로 취급합니다.<br />
                            2. 아내 또는 여자친구에게 본 사이트의 존재를 알리는 행위는 <span className="font-bold text-white">배신 행위</span>로 간주하며, 이에 따른 가정 불화에 대해 생존본부는 책임지지 않습니다.<br />
                            3. "여기서 본 것은 무덤까지 가져간다." 이것이 우리의 철칙입니다.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-[#00ff41] pl-3">
                            제 3 조 (게시물의 관리 및 책임)
                        </h3>
                        <p className="text-gray-300">
                            1. 회원이 작성한 게시물에 대한 모든 책임은 회원 본인에게 있습니다.<br />
                            2. 다음 각 호에 해당하는 게시물은 사전 통보 없이 삭제되거나 작성이 금지될 수 있습니다.<br />
                            &nbsp;&nbsp;가. 아내를 지나치게 찬양하여 타 회원의 사기를 저하시키는 글 (기만 행위)<br />
                            &nbsp;&nbsp;나. 실명, 주소 등 개인 신상을 노출하여 익명성을 해치는 글<br />
                            &nbsp;&nbsp;다. 특정인에 대한 인신공격, 욕설 등 비매너 행위<br />
                            &nbsp;&nbsp;라. 광고, 도배, 스팸성 게시물
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-[#00ff41] pl-3">
                            제 4 조 (서비스 이용 제한)
                        </h3>
                        <p className="text-gray-300">
                            생존본부는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.<br />
                            특히 <span className="text-[#00ff41]">"아내가 보고 있다"</span>는 첩보가 입수될 경우, 해당 회원의 계정은 즉시 <span className="text-gray-500 font-mono">가사상태(Logout)</span>로 전환됩니다.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-[#00ff41] pl-3">
                            제 5 조 (면책 조항)
                        </h3>
                        <p className="text-gray-300">
                            1. 생존본부는 천재지변, 서버 장애 또는 아내의 습격 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다.<br />
                            2. 회원이 본 서비스의 정보를 이용하여 발생한 가정 내 분쟁(등짝 스매싱 등)에 대해 생존본부는 어떠한 책임도 지지 않습니다. 모든 작전의 실행은 본인의 책임하에 수행하십시오.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-[#333] text-center">
                        <p className="text-gray-500 text-xs mb-4">
                            본 약관은 2026년 2월 12일부터 시행됩니다.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-[#00ff41] hover:bg-[#00cc33] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]"
                        >
                            동의하고 생존하러 가기
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
