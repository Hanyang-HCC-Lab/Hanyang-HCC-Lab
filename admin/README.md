# HCC Lab Content Admin (local prototype)

This is a separate Vue/Vite application for managing lab website content. It is intentionally isolated from the public `frontend/` application.

## Run locally

```sh
npm install
npm run dev
```

The local prototype imports the existing News and Publications JSON files and stores edits in the browser's local storage. It **does not** change source JSON files, upload to S3, invalidate CloudFront, create a GitHub commit, or publish the public site.

## Preview deployment

The `Deploy HCC Lab Admin Preview` GitHub Actions workflow is manual-only.
It uploads this separate app to the `admin/` prefix in the existing website
bucket and invalidates only `/admin/*`. It never uploads `frontend/dist`.

Run `dry-run` first. A real `deploy` creates a public preview at
`https://hcc.hanyang.ac.kr/admin/index.html`. It is not an authenticated
administrator service: changes are stored only in each visitor's browser and
do not publish content.

## Current scope

- Edit, add, and delete News entries in a local draft
- Edit, add, and delete international/domestic publication entries in a local draft
- Edit publication paper, official, presentation, slide, poster, award, and acceptance-rate links
- Choose only the publication tags supported by the public site
- Validate required fields, tags, years, and URLs before export
- Download one selected JSON collection or one combined review draft
- Link safely to the manual GitHub Actions deployment screen
- Show the Member and Gallery migration state, which remain hardcoded in the public Vue files for now

## Planned production connection

1. Move Member and Gallery entries into validated JSON schemas.
2. Use an authenticated server-side API to validate a draft and commit the changed JSON to GitHub.
3. Trigger a GitHub Actions workflow that builds `frontend/`, uploads `frontend/dist/` to the website bucket, and invalidates the CloudFront distribution.
4. Issue presigned S3 upload URLs from the same API for photographs, CVs, PDFs, slides, and posters.

Do not put AWS credentials or a GitHub personal access token in this Vite application.
