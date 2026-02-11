# 🔥 Firebase 설정값 가져오는 방법 (3분 컷)

남편응급실 서버 구축을 위해 **Firebase 프로젝트 키**가 필요합니다.
아래 순서대로 따라하시면 금방 찾으실 수 있습니다!

## 1. Firebase 접속 및 로그인
- [Firebase 콘솔(클릭)](https://console.firebase.google.com/)에 접속합니다.
- 구글 아이디로 로그인합니다.

## 2. 프로젝트 만들기
1. **'프로젝트 만들기'** (또는 '프로젝트 추가') 버튼을 클릭합니다.
2. 프로젝트 이름 입력: `husband-er` (또는 원하시는 이름) -> **계속**
3. 구글 애널리틱스 설정: **'사용 설정 안함'** (지금은 필요 없습니다) -> **프로젝트 만들기**
4. 잠시 기다리면 **'새 프로젝트가 준비되었습니다'** -> **계속**

## 3. 웹 앱 추가하기
1. 프로젝트 홈 화면 중앙에 있는 아이콘 중 **`</>` (웹)** 아이콘을 클릭합니다.
2. **앱 닉네임 등록**: `husband-er-web` (아무거나 상관없음)
3. **'또한 이 앱의 Firebase 호스팅을 설정합니다'** -> **체크 해제** (나중에 필요하면 함)
4. **앱 등록** 버튼 클릭.

## 4. 설정값 복사하기 ✨
1. 잠시 후 `npm install firebase` 등의 명령어가 보이고, 그 아래에 `const firebaseConfig = { ... }` 코드가 보입니다.
2. 그 안에 있는 값들을 복사해서 `.env.local` 파일에 채워넣습니다.

---

### 📝 `.env.local` 파일 작성 예시
아래 내용을 복사해서 `.env.local` 파일 **맨 아래**에 붙여넣고, 따옴표(`"`) 안의 내용만 채워주세요.

```properties
# FIREBASE CONFIG
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (복사한 apiKey)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=husband-er.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=husband-er
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=husband-er.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. 마지막 단계: Firestore 데이터베이스 만들기 (중요!)
로그인 기능을 쓰려면 DB가 있어야 합니다.
1. 왼쪽 메뉴에서 **빌드 > Firestore Database** 클릭.
2. **데이터베이스 만들기** 클릭.
3. 위치: `asia-northeast3` (서울) 선택 -> **다음**.
4. 보안 규칙: **'테스트 모드에서 시작'** 선택 -> **만들기**.

**여기까지 완료하시면 "설정 끝!"이라고 알려주세요. 바로 다음 작업 들어갑니다!** 🫡
