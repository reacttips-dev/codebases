const backendEnv = window.location.host === "pro.similarweb.com" ? "production" : "staging";

export default {
    backendEnv,
    gaAdminBackendUrl: `https://web-ga-admin-${backendEnv}.op-us-east-1.web-grid.int.similarweb.io`,
};
