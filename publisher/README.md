# HCC Lab secure publisher

The administrator page sends a verified draft to this API only after a Cognito login. The Lambda function creates one GitHub commit for the five JSON data files and starts the existing public-website deployment workflow. GitHub and AWS secrets never enter the browser build.

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

## Runtime behavior

- The API accepts all five data sections as one payload.
- It writes one atomic Git commit on `main`.
- It calls the existing `deploy-website.yml` workflow with `mode: deploy`.
- A failed GitHub commit or workflow dispatch returns an error; the browser draft remains untouched.
