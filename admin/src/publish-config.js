// These values identify public AWS resources only. They are injected by the
// admin-preview workflow from GitHub Actions variables; no token or secret is
// ever included in the browser build.
export const publishingConfig = {
  apiUrl: import.meta.env.VITE_HCC_PUBLISH_API_URL || "",
  userPoolId: import.meta.env.VITE_HCC_COGNITO_USER_POOL_ID || "",
  clientId: import.meta.env.VITE_HCC_COGNITO_CLIENT_ID || "",
};

export const publishingConfigured = Boolean(
  publishingConfig.apiUrl && publishingConfig.userPoolId && publishingConfig.clientId,
);
