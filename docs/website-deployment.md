# Website deployment

The public HCC Lab website is built from `frontend/` and uploaded to the
`hcc.hanyang.ac.kr` S3 bucket. CloudFront distribution `E1T8AEW131QA8T` is
invalidated after a real deployment.

## Safe initial configuration

The GitHub Actions workflow is manual-only. A normal GitHub push does **not**
deploy the website. The authenticated administrator page is the exception: a
successful content publish dispatches this same workflow automatically with
`mode: deploy` after committing the five JSON data files.

1. Commit and push the workflow file once. This makes it appear in GitHub
   Actions, but does not deploy anything.
2. In GitHub, open **Actions** → **Deploy HCC Lab Website** → **Run workflow**.
3. Select `dry-run` and run it first. It builds the site, verifies the AWS role,
   and lists the prospective S3 changes without changing S3 or CloudFront.
4. Inspect the successful log. Only then select `deploy` for a real release.

## What a real deployment does

1. Runs `npm ci` and `npm run build` inside `frontend/`.
2. Uploads changed build files to `s3://hcc.hanyang.ac.kr`.
3. Creates a CloudFront invalidation for `/*`.

The workflow intentionally does not delete S3 objects. This avoids accidental
removal of website files during the initial rollout. Old hashed build assets
may remain in the bucket but are harmless; cleanup can be added separately
after the workflow has been used safely.

## Later: enable automatic deployment

After manual deployment has been verified, add the following alongside
`workflow_dispatch` in `.github/workflows/deploy-website.yml` if deployment on
every push to `main` is desired:

```yaml
  push:
    branches:
      - main
```

Do not add this until the lab is comfortable with the manual workflow.

For the complete content-management, asset-upload, AWS, and handoff procedure,
see [Website administrator operations and handoff](website-admin-handoff.md).
