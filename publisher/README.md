# HCC Lab secure publisher

The administrator page sends a verified draft to this API only after a Cognito login. The Lambda function creates one GitHub commit for the five JSON data files and starts the existing public-website deployment workflow. GitHub and AWS secrets never enter the browser build.

The same API can also issue a **two-minute, one-file-only S3 upload URL** to a logged-in administrator. The browser uses that temporary URL to upload an asset, then the administrator page fills the public link into the relevant JSON field. It cannot list, delete, or overwrite existing files.

## One-time setup

1. Create a GitHub App owned by `Hanyang-HCC-Lab` and install it on **only** `Hanyang-HCC-Lab`.
   - Repository permissions: **Contents: Read and write**, **Actions: Read and write**, **Metadata: Read-only**.
   - Do not subscribe to webhooks.
   - Generate a private key. Keep the downloaded `.pem` file private.
   - Record the App ID and the installation ID.
2. In AWS Secrets Manager (Seoul, `ap-northeast-2`), create a secret named `hcc-lab/github-app-private-key` as **Plaintext**. Paste the full PEM including its first and last lines.

3. Deploy this folder with AWS SAM. The deployer needs permission to create CloudFormation, API Gateway, Lambda, Cognito, IAM, and CloudWatch resources.

   ```bash
   cd publisher
   sam build
   sam deploy --guided
   ```

   Use `ap-northeast-2`, choose a stack name such as `hcc-lab-content-publisher`, and supply the email address that will be allowed to publish, the GitHub App ID, installation ID, and the secret ARN from step 2.
4. In Cognito → `hcc-lab-admin` → Users, create the one administrator account using the same email. Set a permanent password before first use.
5. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add these values from the SAM stack outputs:
   - `HCC_PUBLISH_API_URL`
   - `HCC_COGNITO_USER_POOL_ID`
   - `HCC_COGNITO_CLIENT_ID`
6. In the `main` branch rule, allow the GitHub App to bypass the pull-request requirement. This bypass applies only to the App and is needed because it creates the content commit directly on `main`.
7. Run **Deploy HCC Lab Admin Preview** once with `mode: deploy`. The administrator page will then show the login form and enable the **게시** button after a valid edit.
8. For direct file uploads, add the CORS rule in [`s3-cors-rule.json`](./s3-cors-rule.json) to each existing asset bucket: `hcc.hanyang.ac.kr`, `hyhccl`, and `astlyi`. This is a one-time S3 setting that allows only `https://hcc.hanyang.ac.kr` to send `PUT` upload requests.
   - Check each bucket's existing CORS rules first and **merge** this rule; do not replace an existing rule without reviewing it.
   - In the S3 console: Bucket → **Permissions** → **Cross-origin resource sharing (CORS)** → Edit → add the JSON object from the file inside the existing JSON list.

## Asset upload destinations

| Administrator field | Accepted file | S3 destination | JSON field filled automatically |
| --- | --- | --- | --- |
| Member photo | JPG, JPEG, PNG, WEBP, GIF | `hyhccl/image/members/` | `image` |
| Member CV | PDF | `hyhccl/Lab-members-CV/` | `link` |
| Gallery image | JPG, JPEG, PNG, WEBP, GIF | `hcc.hanyang.ac.kr/image/gallery/` | `image` |
| Paper, slide, poster | PDF | `astlyi/<year>/` | `link.paper`, `link.slide`, or `link.poster` |

The publisher prepends a timestamp to each uploaded filename. This prevents accidental replacement of an existing asset. Uploading a member CV intentionally replaces that member's single `link` field; use the normal text field instead when the link should remain a personal website.

## Runtime behavior

- The API accepts all five data sections as one payload.
- It writes one atomic Git commit on `main`.
- It calls the existing `deploy-website.yml` workflow with `mode: deploy`.
- A failed GitHub commit or workflow dispatch returns an error; the browser draft remains untouched.
- Upload URLs are available only to the allowed Cognito account and expire in two minutes.
- The Lambda role may upload only to the four prefixes listed in the table above. It has no S3 read, list, delete, or overwrite permission through the administrator interface.
