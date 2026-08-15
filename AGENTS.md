# Repository agent instructions

홈페이지 관리·배포·AWS 자동화 작업을 시작하기 전에 반드시 [`docs/website-admin-handoff.md`](docs/website-admin-handoff.md)를 읽습니다.

- 공개 사이트는 `frontend/`, 관리자 앱은 `admin/`, 인증 게시 서버는 `publisher/`입니다.
- 홈페이지 데이터의 기준은 `frontend/src/`의 JSON 5개입니다. 같은 데이터를 Vue 파일에 다시 하드코딩하지 않습니다.
- 작업 전 `git status`를 확인하고 다른 사용자의 변경을 stage, 덮어쓰기, revert하지 않습니다.
- PEM, Cognito 비밀번호, AWS 키, GitHub PAT 등 비밀값을 코드·로그·문서에 넣지 않습니다.
- 빌드 성공과 배포 성공을 구분합니다. GitHub Actions, CloudFormation, 실제 URL을 각각 확인합니다.
- 수정 범위에 따라 frontend/admin 빌드, publisher 테스트, `git diff --check`를 수행합니다.

상세 데이터 스키마, 파일 업로드 경로, AWS/GitHub 재설정, 문제 해결 및 되돌리기 절차는 인수인계 가이드를 따릅니다.
