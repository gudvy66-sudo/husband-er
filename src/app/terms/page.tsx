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
                <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-[#333] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-10 text-sm leading-relaxed text-center">

                    <section>
                        <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-full px-4 py-1 mb-4">
                            <h3 className="text-lg font-bold text-[#00ff41]">
                                제 1 조 (목적)
                            </h3>
                        </div>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            본 약관은 <span className="text-white font-bold">남편응급실</span>(이하 "생존본부")이 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 생존본부의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
                            <br className="hidden sm:block" />
                            궁극적으로는 <span className="text-[#00ff41]">대한민국 유부남들의 정신적 평화와 가정 내 생존</span>을 도모하기 위함입니다.
                        </p>
                    </section>

                    <section>
                        <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-full px-4 py-1 mb-4">
                            <h3 className="text-lg font-bold text-[#00ff41]">
                                제 2 조 (비밀 엄수 의무)
                            </h3>
                        </div>
                        <div className="space-y-2 text-gray-300 max-w-2xl mx-auto">
                            <p>1. 본 커뮤니티에서 취득한 모든 정보(비상금 은닉처, 게임기 구매 꿀팁 등)는 <span className="text-red-500 font-bold bg-red-500/10 px-2 rounded">1급 기밀(Top Secret)</span>로 취급합니다.</p>
                            <p>2. 아내 또는 여자친구에게 본 사이트의 존재를 알리는 행위는 <span className="font-bold text-white">가장 큰 배신 행위</span>로 간주하며, 이에 따른 가정 불화에 대해 생존본부는 책임지지 않습니다.</p>
                            <p className="text-white font-bold text-lg pt-2">"여기서 본 것은 무덤까지 가져간다."</p>
                        </div>
                    </section>

                    <section>
                        <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-full px-4 py-1 mb-4">
                            <h3 className="text-lg font-bold text-[#00ff41]">
                                제 3 조 (게시물의 관리 및 책임)
                            </h3>
                        </div>
                        <div className="space-y-2 text-gray-300 max-w-2xl mx-auto">
                            <p>1. 회원이 작성한 게시물에 대한 모든 책임은 회원 본인에게 있습니다.</p>
                            <p>2. 다음 각 호에 해당하는 게시물은 <span className="text-red-400">사전 통보 없이 삭제</span>되거나 작성이 금지될 수 있습니다.</p>
                            <ul className="list-none space-y-1 text-gray-400 mt-2 bg-[#000]/30 p-4 rounded-lg inline-block mx-auto">
                                <li>🚫 아내를 지나치게 찬양하여 타 회원의 사기를 저하시키는 글</li>
                                <li>🚫 실명, 주소 등 개인 신상을 노출하여 익명성을 해치는 글</li>
                                <li>🚫 특정인에 대한 인신공격, 욕설 등 비매너 행위</li>
                                <li>🚫 광고, 도배, 스팸성 게시물</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-full px-4 py-1 mb-4">
                            <h3 className="text-lg font-bold text-[#00ff41]">
                                제 4 조 (서비스 이용 제한)
                            </h3>
                        </div>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            생존본부는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.<br />
                            특히 <span className="text-[#00ff41] font-bold">"아내가 보고 있다"</span>는 첩보가 입수될 경우, 해당 회원의 계정은 즉시 <span className="bg-gray-700 text-white px-2 py-0.5 rounded text-xs align-middle">LOGOUT</span> 처리됩니다.
                        </p>
                    </section>

                    <section>
                        <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-full px-4 py-1 mb-4">
                            <h3 className="text-lg font-bold text-[#00ff41]">
                                제 5 조 (면책 조항)
                            </h3>
                        </div>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            1. 생존본부는 천재지변, 서버 장애 또는 아내의 급습 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.<br />
                            2. 회원이 본 서비스의 정보를 이용하여 발생한 가정 내 분쟁(등짝 스매싱 등)에 대해 생존본부는 어떠한 책임도 지지 않습니다. <span className="block mt-2 text-[#00ff41] font-bold">모든 작전의 실행은 본인의 책임하에 수행하십시오.</span>
                        </p>
                    </section>

                    <div className="pt-8 border-t border-[#333]">
                        <p className="text-gray-500 text-xs mb-6">
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
