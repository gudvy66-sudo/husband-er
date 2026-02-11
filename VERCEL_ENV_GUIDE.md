# 🚨 긴급 조치: Vercel 환경변수 등록 가이드

형님, 현재 배포된 사이트(`www.남편응급실.com`)에서 에러가 뜨는 이유는 **비밀 열쇠(환경변수)**가 운영 서버(Vercel)에 전달되지 않았기 때문입니다.
아래 절차대로 열쇠를 등록해주시면 1분 내로 정상화됩니다!

## 1. Vercel 대시보드 접속
1. [Vercel Dashboard](https://vercel.com/dashboard)에 들어갑니다.
2. `husband-er` (또는 해당 프로젝트)를 클릭합니다.
3. 상단 메뉴바의 **[Settings]**를 클릭합니다.
4. 왼쪽 사이드바에서 **[Environment Variables]**를 클릭합니다.

## 2. 변수 등록 (복붙만 하면 끝!)
로컬 컴퓨터의 `.env.local` 파일 내용을 전체 복사해서, Vercel의 입력창에 **한 번에 붙여넣기** 하시면 됩니다.

**[등록해야 할 필수 변수 목록]**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (배포된 주소, 예: `https://www.xn--kj0bs3cfzzpfetvs.com` 또는 `https://husband-er.vercel.app`)
  - **주의**: `NEXTAUTH_URL`은 로컬(`localhost:3000`)이 아닌 **실제 배포 주소**로 바꿔서 입력해주세요!

## 3. 재배포 (Redeploy)
변수를 다 넣고 **[Save]** 하신 뒤, 상단 메뉴의 **[Deployments]** 탭으로 가서 가장 최신 배포 항목의 **[Redeploy]** 버튼을 눌러주세요.
(환경변수는 빌드 시점에 적용되므로, 꼭 **재배포(Rebuild)**를 해야 적용됩니다.)

완료되면 **"재배포 완료!"**라고 알려주십시오. 바로 접속 테스트하겠습니다! 🔥
