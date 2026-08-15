# HCC Lab Content Admin

공개 `frontend/`와 분리된 Vue/Vite 관리자 애플리케이션입니다. 배포 주소는 <https://hcc.hanyang.ac.kr/admin/index.html>입니다.

운영자가 알아야 할 전체 절차는 먼저 [관리자 운영·인수인계 가이드](../docs/website-admin-handoff.md)를 읽으세요. 인증·GitHub 게시 서버 설정은 [`publisher/README.md`](../publisher/README.md)에 있습니다.

## 로컬 실행

```bash
cd admin
npm install
npm run dev
```

```bash
npm run build
```

관리자 앱은 `frontend/src/`의 JSON 5개를 초기 데이터로 읽고, 편집 내용을 브라우저 localStorage의 로컬 초안으로 보관합니다.

## 현재 기능

- News, 국제·국내 논문, Members, Alumni, Gallery 편집·추가·삭제
- 공개 사이트가 지원하는 논문 태그·수상·수락률·등재 정보 선택 및 검증
- 멤버 사진·CV, 갤러리 이미지, 논문 PDF·Poster·Slides 직접 업로드
- Cognito 로그인 후 JSON 5개를 GitHub에 한 번에 게시
- 게시 성공 후 공개 홈페이지 배포 워크플로 자동 실행
- 개별 JSON 내려받기와 브라우저 로컬 초안 복구

## 빌드 설정

프로덕션 빌드에는 GitHub Actions의 Repository variables가 주입됩니다.

- `HCC_PUBLISH_API_URL`
- `HCC_COGNITO_USER_POOL_ID`
- `HCC_COGNITO_CLIENT_ID`

이 값은 공개 리소스 식별자입니다. AWS 키, GitHub App private key, Cognito 비밀번호를 Vite 환경변수나 이 폴더에 넣으면 안 됩니다.

## 배포

GitHub Actions의 **Deploy HCC Lab Admin Preview** 워크플로를 수동 실행합니다.

1. 변경을 Git에 커밋·푸시합니다.
2. 필요하면 `dry-run`으로 업로드 대상을 확인합니다.
3. `deploy`를 실행합니다.
4. 워크플로는 `admin/dist`만 `s3://hcc.hanyang.ac.kr/admin`에 올리고 CloudFront의 `/admin/*`만 무효화합니다.

관리자 URL은 공개되어 있지만 업로드와 게시 권한은 Cognito 로그인 및 서버의 허용 이메일 검사로 보호됩니다. 로컬 초안 자체는 게시가 아니며 **지금 게시**를 눌러야 공개 홈페이지에 반영됩니다.
