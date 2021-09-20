export const aaMigrationRedirect = () => {
  const pathname = 'atlassian-account/redirect';
  const returnUrl = encodeURIComponent(
    `${window.location.pathname}?onboarding=success`,
  );
  window.location.replace(
    `${window.location.origin}/${pathname}?returnUrl=${returnUrl}`,
  );
};
