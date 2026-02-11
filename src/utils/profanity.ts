
// Basic Profanity List (Expand as needed)
// MVP version: Hardcoded list. In production, consider using a database or external API.

const BAD_WORDS = [
    "개새끼", "씨발", "시발", "병신", "미친년", "미친놈", "꺼져", "죽어",
    "느금마", "니애미", "창녀", "걸레", "따먹", "섹스", "자지", "보지",
    "강간", "자살", "살인", "마약"
    // Add more severe words here.
    // 'ㅅㅂ', '존나' are excluded as per user request (colloquial allowed).
];

export const checkProfanity = (text: string): { hasProfanity: boolean; badWord?: string } => {
    if (!text) return { hasProfanity: false };

    // Remove spaces and special chars to catch bypass attempts (e.g., '개 새 끼')
    const cleanText = text.replace(/[\s\t\n!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "");

    for (const word of BAD_WORDS) {
        if (text.includes(word) || cleanText.includes(word)) {
            return { hasProfanity: true, badWord: word };
        }
    }

    return { hasProfanity: false };
};
