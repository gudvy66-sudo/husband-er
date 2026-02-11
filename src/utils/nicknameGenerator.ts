
const ADJECTIVES = [
    "설거지하는", "분리수거하는", "음쓰버리는", "플스숨기는", "비상금털린",
    "낚시가고픈", "회식핑계대는", "거실에서자는", "용돈받는", "주말에출근한",
    "기저귀가는", "육퇴기다리는", "몰래라면먹는", "등짝스매싱맞은", "반찬투정하는",
    "소파와물아일체된", "리모컨사수하는", "아내눈치보는", "자유를갈망하는", "로또당첨꿈꾸는"
];

const NOUNS = [
    "유부남", "남편", "아빠", "가장", "머슴",
    "집사", "운전기사", "노예", "투사", "생존자"
];

export function generateRandomNickname(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(Math.random() * 999) + 1;

    return `${adj} ${noun} ${number}호`;
}
