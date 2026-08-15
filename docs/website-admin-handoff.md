# HCC Lab 홈페이지 관리자 운영·인수인계 가이드

이 문서는 HCC Lab 홈페이지의 콘텐츠 수정, 파일 업로드, 게시, 서버 재배포와 장애 대응을 다음 담당자 또는 자동화 에이전트가 안전하게 이어받기 위한 기준 문서입니다.

## 1. 가장 먼저 알아둘 것

일상적인 콘텐츠 수정은 아래 흐름만 따르면 됩니다.

1. [관리자 페이지](https://hcc.hanyang.ac.kr/admin/index.html)를 연다.
2. 소식·논문·멤버·Alumni·갤러리 정보를 수정한다.
3. 필요한 사진이나 PDF를 관리자 페이지에서 업로드한다.
4. **검사**를 누른다.
5. **배포** 탭에서 Cognito 관리자 계정으로 로그인한다.
6. **지금 게시**를 누른다.
7. GitHub Actions의 **Deploy HCC Lab Website**가 성공했는지 확인한 뒤 [공개 홈페이지](https://hcc.hanyang.ac.kr)를 확인한다.

관리자 페이지의 수정 내용은 먼저 현재 브라우저의 로컬 초안에 저장됩니다. 파일을 S3에 올리는 것만으로 공개 홈페이지의 JSON이 바뀌지는 않으며, 반드시 **지금 게시**까지 눌러야 합니다.

## 2. 전체 구조

```text
관리자 브라우저
  ├─ 콘텐츠 편집 → 브라우저 로컬 초안
  ├─ 로그인 → Amazon Cognito
  ├─ 파일 업로드 요청 → API Gateway → Lambda → 2분짜리 S3 업로드 URL
  └─ 게시 요청 → API Gateway → Lambda → GitHub App
                                      ├─ JSON 5개를 main에 한 번에 커밋
                                      └─ Deploy HCC Lab Website 실행
                                                        ├─ frontend 빌드
                                                        ├─ S3 반영
                                                        └─ CloudFront 무효화
```

- 공개 사이트 소스: `frontend/`
- 별도 관리자 앱: `admin/`
- 인증·게시·업로드 서버: `publisher/`
- 공개 사이트 주소: <https://hcc.hanyang.ac.kr>
- 관리자 주소: <https://hcc.hanyang.ac.kr/admin/index.html>
- AWS 리전: `ap-northeast-2` (서울)
- SAM/CloudFormation 스택: `hcc-lab-content-publisher`
- CloudFront 배포 ID: `E1T8AEW131QA8T`

관리자 페이지 URL 자체는 공개되어 있으므로 누구나 화면은 열 수 있습니다. 그러나 업로드와 게시는 Cognito 로그인, API의 이메일 일치 검사, GitHub App 권한을 모두 통과해야만 가능합니다. 브라우저 빌드에는 AWS 키나 GitHub 비밀키가 들어가지 않습니다.

## 3. 관리하는 JSON 5개

게시 서버는 아래 파일을 한 번의 Git 커밋으로 함께 저장합니다.

| 관리자 메뉴 | 원본 파일 |
| --- | --- |
| 소식 | `frontend/src/news.json` |
| 국제 논문 | `frontend/src/publications.json` |
| 국내 논문 | `frontend/src/publications_domestic.json` |
| 멤버 + Alumni | `frontend/src/members.json` |
| 갤러리 | `frontend/src/gallery.json` |

“JSON 5개를 한 번에 커밋”한다는 말은 5개의 복사본을 만든다는 뜻이 아닙니다. 관리자 화면의 전체 상태를 하나의 일관된 스냅샷으로 저장한다는 뜻입니다. 한 영역만 수정했더라도 나머지 네 파일은 현재 초안 상태로 함께 검증·저장됩니다. 따라서 게시 직전에 다른 메뉴에 실수로 남긴 변경이 없는지도 확인해야 합니다.

### 3.1 소식

```json
{
  "index": 106,
  "date": "Aug. 2026",
  "content": "New member has joined our lab."
}
```

- `index`: 중복되지 않는 표시 번호
- `date`: 공개 페이지에 그대로 표시할 날짜 문자열
- `content`: 기존 데이터처럼 `<i>`, `<a>` 등의 제한적인 HTML을 사용할 수 있음

### 3.2 국제·국내 논문

```json
{
  "index": 141,
  "year": 2026,
  "title": "Paper title.",
  "author": "Author One, Author Two.",
  "venue": "Conference name.",
  "date": "January 2026.",
  "kImpact": ["컴퓨터공학분야 우수국제학술대회"],
  "additional": {},
  "link": {
    "paper": "https://...",
    "DOI": "https://...",
    "slide": "https://...",
    "poster": "https://...",
    "presentation": "https://..."
  },
  "tags": ["hai", "social", "nlp"],
  "acceptance_rate": { "AR": 17.6 },
  "oral_acceptance_rate": { "AR": 4.4 },
  "award": {}
}
```

지원 태그는 아래 값만 사용합니다.

`hai`, `vr`, `dm`, `fashion`, `social`, `health`, `cv`, `nlp`, `safety`

관리자 화면이 지원하는 논문 링크 키는 다음과 같습니다.

`paper`, `ACM`, `DOI`, `ACL`, `IEEE`, `ECVA`, `presentation`, `slide`, `poster`, `demo`, `media`

수상 종류는 관리자 화면에서 선택하며, 내부 키는 다음 중 하나입니다.

`best_paper`, `grand_paper`, `outstanding_paper`, `honorable_mention`, `best_presentation`, `new_challenge`

중요한 빈 값 규칙:

- 값이 없으면 `acceptance_rate`, `oral_acceptance_rate`, `additional`, `award`는 `{}`로 둡니다.
- `{ "AR": "" }`처럼 빈 문자열을 넣지 않습니다.
- 링크가 없으면 해당 키를 빼거나 빈 `link` 객체를 사용합니다.
- “컴퓨터공학분야 우수국제학술대회” 표시는 `kImpact` 배열에서 관리합니다.
- Acceptance Rate와 Oral Acceptance Rate는 서로 다른 값입니다.

### 3.3 멤버와 Alumni

`members.json`은 하나의 객체 안에 재직 멤버와 Alumni를 함께 보관합니다.

```json
{
  "people": [
    {
      "index": 1,
      "group": "M.S. Students",
      "name": "English Name",
      "nameKo": "한글 이름",
      "image": "https://...",
      "email": "name@example.com",
      "link": "https://...",
      "note": "선택 표시 문구"
    }
  ],
  "alumni": [
    {
      "index": 1,
      "name": "Alumni Name",
      "description": "Current affiliation",
      "link": "https://..."
    }
  ]
}
```

멤버의 `group`은 관리자 페이지의 선택 항목을 사용합니다.

- `Professor`
- `Ph.D. Candidates`
- `Ph.D. Students`
- `Research Associates`
- `M.S. Students`
- `Undergraduate Students`
- `Administrative Staff`

멤버의 `link`는 CV 또는 개인 홈페이지 중 하나입니다. CV PDF를 업로드하면 기존 `link`가 새 CV 주소로 바뀌므로, 개인 홈페이지를 유지해야 한다면 링크 칸을 직접 확인합니다.

### 3.4 갤러리

```json
{
  "index": 42,
  "image": "https://...",
  "caption": "[2026.08] Event name"
}
```

날짜 표기는 기존 관례인 `[YYYY.MM] 설명` 형식을 권장합니다.

## 4. 파일 업로드 규칙

| 관리자 항목 | S3 버킷과 폴더 | 허용 파일 |
| --- | --- | --- |
| 멤버 사진 | `hyhccl/image/members/` | JPG, JPEG, PNG, WEBP, GIF |
| 멤버 CV | `hyhccl/Lab-members-CV/` | PDF |
| 갤러리 사진 | `hcc.hanyang.ac.kr/image/gallery/` | JPG, JPEG, PNG, WEBP, GIF |
| Paper·Poster·Slides | `astlyi/<year>/` | PDF |

서버는 원래 파일명 앞에 충돌 방지용 17자리 UTC 타임스탬프를 붙입니다.

```text
20260815080820206-2026_UBICOMP.pdf
```

원래 파일명을 자동으로 논문 제목에 맞게 바꾸지는 않습니다. 업로드 전에 로컬 파일명을 아래처럼 사람이 읽을 수 있게 정리하는 것을 권장합니다.

```text
2026_UBICOMP_SHORTTITLE.pdf
2026_UBICOMP_SHORTTITLE_Poster.pdf
2026_UBICOMP_SHORTTITLE_Slides.pdf
```

공백과 한글도 URL 인코딩되어 동작할 수 있지만, 영문·숫자·밑줄 중심의 파일명이 관리하기 쉽습니다. S3에서 업로드한 객체를 삭제하면 기존 JSON 링크는 더 이상 열리지 않으며 보통 `403 AccessDenied`로 보입니다. 이 경우 CORS나 `%20` 문제가 아니라 객체가 사라진 것일 수 있으므로, 다시 업로드하고 관리자 페이지의 링크를 새 주소로 바꾼 뒤 게시합니다.

## 5. 게시 후 확인

1. 게시 성공 메시지에서 GitHub 커밋 링크를 확인합니다.
2. GitHub → **Actions** → **Deploy HCC Lab Website** 실행 상태를 확인합니다.
3. 성공 후 공개 홈페이지를 새로고침합니다.
4. 이전 내용이 보이면 1~2분 기다린 뒤 강력 새로고침합니다.
5. 논문 링크·멤버 사진·갤러리 이미지 등 실제 자산 링크도 각각 엽니다.

관리자 화면의 “변경된 로컬 초안 · 아직 게시되지 않음”은 오류가 아니라 정상 상태입니다. 게시가 완료된 뒤 최신 저장소 데이터를 다시 불러오거나 초안을 초기화하기 전까지 표시될 수 있습니다.

## 6. 코드 수정과 배포 구분

### 공개 홈페이지 코드 또는 스타일 수정

1. `frontend/`를 수정합니다.
2. `npm --prefix frontend run build`로 확인합니다.
3. Git에 커밋·푸시합니다.
4. GitHub Actions → **Deploy HCC Lab Website** → `dry-run` 확인 → `deploy` 실행합니다.

일반 코드 push만으로 공개 사이트가 자동 배포되지는 않습니다. 단, 관리자 페이지의 **지금 게시**는 게시 서버가 이 워크플로를 `deploy` 모드로 자동 실행합니다.

### 관리자 화면 수정

1. `admin/`을 수정합니다.
2. `npm --prefix admin run build`로 확인합니다.
3. Git에 커밋·푸시합니다.
4. GitHub Actions → **Deploy HCC Lab Admin Preview** → `deploy`를 실행합니다.

이 워크플로는 `admin/dist`만 `s3://hcc.hanyang.ac.kr/admin`에 올리고 `/admin/*` 캐시만 무효화합니다.

### 게시·업로드 서버 수정

`publisher/` 코드나 `publisher/template.yaml`을 바꾼 경우 AWS SAM 재배포가 필요합니다.

```bash
cd ~/Hanyang-HCC-Lab
git pull --ff-only
cd publisher
sam build
sam deploy
```

처음 배포하거나 `samconfig.toml`이 없는 환경에서는 `sam deploy --guided`를 사용합니다. 배포 완료 기준은 빌드 성공이 아니라 `Successfully created/updated stack` 출력입니다.

## 7. 최초 설정 또는 인프라 재생성

평상시에는 반복할 필요가 없습니다. AWS 계정이나 GitHub App을 재생성할 때만 수행합니다.

1. GitHub 조직 소유의 GitHub App을 만들고 대상 저장소에만 설치합니다.
   - Contents: Read and write
   - Actions: Read and write
   - Metadata: Read-only
   - Webhook은 사용하지 않음
2. GitHub App private key PEM 전체를 AWS Secrets Manager에 보관합니다.
   - PEM, Cognito 비밀번호, AWS 키를 Git이나 문서에 기록하지 않습니다.
3. `publisher/`에서 `sam build`, `sam deploy --guided`를 실행합니다.
4. CloudFormation 출력 3개를 GitHub 저장소의 **Settings → Secrets and variables → Actions → Variables**에 등록합니다.
   - `HCC_PUBLISH_API_URL`
   - `HCC_COGNITO_USER_POOL_ID`
   - `HCC_COGNITO_CLIENT_ID`
5. Cognito `hcc-lab-admin` 사용자 풀에 허용 이메일과 정확히 같은 이메일로 관리자 사용자를 만들고 영구 비밀번호를 설정합니다.
6. `main` 규칙에서 **HCC Lab Content Publisher GitHub App만** PR 요구 사항을 우회할 수 있게 설정합니다.
7. 세 S3 버킷의 기존 CORS를 확인한 뒤 [`publisher/s3-cors-rule.json`](../publisher/s3-cors-rule.json)의 규칙을 기존 배열에 병합합니다.
8. **Deploy HCC Lab Admin Preview**를 `deploy` 모드로 실행합니다.

GitHub Actions 변수는 공개 리소스 식별자이며 비밀키가 아닙니다. 반대로 PEM, Secret 내용, 비밀번호는 GitHub 변수나 Vite 환경변수에 넣으면 안 됩니다.

## 8. 자주 발생하는 문제

| 증상 | 확인 및 해결 |
| --- | --- |
| `Failed to fetch` | 게시 API가 아직 배포되지 않았거나 API URL·CORS가 맞지 않을 수 있습니다. CloudFormation 스택 상태, GitHub 변수 3개, 브라우저 개발자 도구 Network 응답을 확인하고 관리자 앱을 다시 배포합니다. |
| `USER_SRP_AUTH is not enabled for the client` | 오래된 Cognito 앱 클라이언트일 수 있습니다. 최신 `publisher/template.yaml`로 SAM 스택을 재배포하고, 최신 Client ID를 GitHub 변수에 반영한 뒤 관리자 앱을 다시 배포합니다. |
| 임시 비밀번호 안내가 반복됨 | Cognito 사용자를 `CONFIRMED` 상태로 바꾸고 영구 비밀번호를 설정합니다. 임시 비밀번호와 다른 값이어야 하며 현재 정책은 14자 이상, 대·소문자·숫자·기호를 요구합니다. |
| 관리자 페이지는 열리지만 게시할 수 없음 | 화면 공개는 정상입니다. 배포 탭에서 Cognito 로그인하고, 로그인 이메일이 SAM의 허용 이메일과 정확히 같은지 확인합니다. |
| S3 파일 업로드 실패 | 먼저 로그인 상태를 확인합니다. Publisher가 최신 배포인지, 세 버킷 CORS에 `https://hcc.hanyang.ac.kr`의 `PUT` 규칙이 기존 설정과 함께 존재하는지 확인합니다. |
| 업로드 링크가 403 | 먼저 S3 객체가 실제로 존재하는지 확인합니다. 삭제한 객체는 같은 URL로 복구되지 않으므로 다시 업로드하고 JSON 링크를 갱신합니다. |
| 빈 수상·수락률 문구가 보임 | 값이 없을 때 `{ "AR": "" }`를 쓰지 말고 `{}`를 사용합니다. 관리자에서 빈 숫자 필드를 그대로 두고 검사합니다. |
| Actions는 성공했는데 예전 화면 | CloudFront 무효화 완료까지 잠시 기다리고 강력 새로고침합니다. Actions 로그에서 실제 `deploy` 모드였는지도 확인합니다. |
| GitHub App 게시가 branch rule에 막힘 | `main` 규칙의 bypass actor에 해당 GitHub App만 등록되어 있는지 확인합니다. 사람 전체에 우회를 열지 않습니다. |

## 9. 보안 원칙

- GitHub App PEM, Cognito 비밀번호, AWS access key, 개인 액세스 토큰(PAT)을 저장소·브라우저 코드·문서에 넣지 않습니다.
- 브라우저는 Cognito 토큰만 사용하고, GitHub App private key는 Lambda가 Secrets Manager에서만 읽습니다.
- 허용 관리자 이메일을 변경하면 SAM 스택과 Cognito 사용자를 함께 확인합니다.
- S3 CORS는 접근 권한 자체가 아닙니다. 기존 CORS를 지우지 말고 필요한 `PUT` 규칙만 병합합니다.
- 버킷 정책, CloudFront, IAM 역할을 넓게 수정하기 전에 현재 설정을 백업하고 영향 범위를 확인합니다.
- 자산을 바로 삭제하지 않습니다. 새 파일 업로드와 공개 페이지 확인이 끝난 뒤 정리합니다.

## 10. 다음 담당자 인수인계 체크리스트

- [ ] GitHub 조직과 저장소에 필요한 관리 권한이 있다.
- [ ] AWS 계정에서 CloudFormation, Cognito, Lambda, API Gateway, S3, Secrets Manager, CloudFront를 확인할 수 있다.
- [ ] GitHub App의 App manager 또는 조직 관리자가 정해져 있다.
- [ ] Cognito 관리자 계정으로 로그인할 수 있다. 비밀번호를 전달하지 말고 담당자 변경 시 재설정한다.
- [ ] GitHub Actions 변수 3개와 두 배포 워크플로가 존재한다.
- [ ] `hcc-lab-content-publisher` 스택이 정상 상태다.
- [ ] 세 S3 버킷 CORS와 업로드 대상 폴더를 확인했다.
- [ ] 테스트 뉴스 또는 안전한 링크 수정으로 검사 → 게시 → Actions → 공개 화면까지 한 번 검증했다.
- [ ] 이 문서와 [`publisher/README.md`](../publisher/README.md)를 함께 읽었다.

## 11. 자동화 에이전트 작업 규칙

다른 에이전트가 이 저장소를 수정할 때는 아래 순서를 지킵니다.

1. 이 문서와 수정 대상 폴더의 README를 먼저 읽습니다.
2. `git status`로 사용자 변경 사항을 확인하고, 관련 없는 파일을 stage·revert하지 않습니다.
3. 홈페이지 데이터의 기준은 위 5개 JSON 파일입니다. Vue에 같은 데이터를 다시 하드코딩하지 않습니다.
4. 수정 범위에 맞게 아래를 실행합니다.

   ```bash
   npm --prefix frontend run build
   npm --prefix admin run build
   npm --prefix publisher test
   git diff --check
   ```

5. 빌드 성공을 배포 성공으로 표현하지 않습니다. GitHub Actions 실행, CloudFormation 완료, 실제 공개 URL을 각각 확인합니다.
6. 비밀값을 출력·커밋하지 않습니다. 문서에는 값 대신 AWS/GitHub에서 값을 찾는 위치만 적습니다.

## 12. 되돌리기

- 잘못된 콘텐츠 게시: GitHub에서 해당 `content: publish website updates from admin` 커밋을 되돌린 뒤 **Deploy HCC Lab Website**를 `deploy`로 실행하거나, 관리자 페이지에서 올바른 값으로 다시 게시합니다.
- 관리자 UI 문제: 직전 정상 커밋으로 관리자 관련 변경을 되돌리고 **Deploy HCC Lab Admin Preview**를 다시 실행합니다.
- Publisher 문제: CloudFormation 이벤트와 Lambda 로그를 먼저 확인한 뒤 직전 정상 코드로 SAM 재배포합니다.
- 삭제한 S3 객체: 버전 관리나 별도 백업이 없으면 코드 되돌리기로 복구되지 않습니다. 원본 파일을 다시 업로드하고 JSON 링크를 수정해야 합니다.
