# Hanyang-HCC-Lab

## 홈페이지 관리

- [코딩 에이전트 콘텐츠 작업 가이드](docs/coding-agent-guide.md): 입력 정보, JSON 수정, 사진/PDF 추가, 검증, 커밋·배포 완료 기준
- [관리자 운영·인수인계 가이드](docs/website-admin-handoff.md): 콘텐츠 수정, 파일 업로드, 게시, AWS/GitHub 설정, 장애 대응, 다음 담당자 체크리스트
- [공개 홈페이지 수동 배포](docs/website-deployment.md)
- [인증 게시 서버 설정](publisher/README.md)
- [관리자 앱 개발](admin/README.md)

### 처음 넘겨받았다면

1. 저장소를 clone하고 [AGENTS.md](AGENTS.md)의 문서 읽기 순서를 따릅니다.
2. 로컬 개발에는 Node.js 20과 npm을 준비합니다. 각 앱의 의존성은 `npm ci --prefix frontend`, `npm ci --prefix admin`으로 설치합니다.
3. 콘텐츠만 바꿀 때는 관리자 페이지를 사용하거나, 원본 JSON과 `frontend/public/`의 파일을 Git으로 수정할 수 있습니다. 수업 목록은 Git으로 수정합니다.
4. GitHub 협업·Actions 실행 권한과 관리자 Cognito 계정은 기존 담당자에게 별도로 요청합니다. GitHub Actions로 사이트를 배포하는 데 개인 AWS 키를 저장소에 넣을 필요는 없습니다.
5. Git으로 수정한 콘텐츠는 PR로 검토·반영한 뒤 수동 배포해야 실제 사이트에 보입니다. 문서만 수정했다면 사이트 배포는 필요 없습니다.

권한·인프라 이전은 [인수인계 체크리스트](docs/website-admin-handoff.md#10-다음-담당자-인수인계-체크리스트)를 확인합니다. 저장소 전달만으로 로그인·게시·배포 권한까지 이전되는 것은 아닙니다.

### 코딩 에이전트에게 전달할 요청 예시

저장소 루트에서 에이전트를 실행하고 아래처럼 요청하면 됩니다. 도구가 `AGENTS.md`를 자동으로 읽지 않는다면 읽도록 명시합니다.

```text
AGENTS.md와 거기서 지정한 운영·콘텐츠 작업 가이드를 먼저 읽어줘.
첨부 자료와 아래 정보로 홈페이지의 [수정할 영역]을 업데이트해줘.
기존 항목 여부를 확인하고 JSON과 필요한 사진/PDF만 수정해줘.
관련 없는 영역이나 디자인은 바꾸지 말고, 빠진 사실은 추측하지 마.

수정할 영역: [국제 논문 / 국내 논문 / 멤버 / Alumni / 갤러리 / 뉴스 / 수업]
정보: [제목, 저자, 학회, 날짜 등]
파일: [사진 또는 PDF 경로]
완료 범위: [로컬 수정만 / 커밋·PR까지 / main 반영·배포·실제 사이트 확인까지]
```

영역별 필수 정보와 검증 방법은 [작업 가이드](docs/coding-agent-guide.md)에 있습니다. 에이전트는 요청받은 정보로 업데이트하며, 이 가이드 자체가 자동 수집·주기적 게시를 실행하지는 않습니다.

### 신규 기능 제안 / Bug Reporting 가이드
- 상단의 issue tab에서 New Issue 버튼을 눌러 신규 issue 생성  
  - 적절한 Issue Templates을 선택하고, 기존에 생성되어 있는 issue를 참고하여, Title과 Body를 작성. (목록에 하나도 안 보이는 경우, close 눌러서 이미 완료된 issue 확인)
  - issue 반영이 완료되면 해당 issue는 close되어, close category로 분류됨. (발행 후 해결 전까지 open category로 유지됨)
