export const planPermissionCheck = (privateMode, plan) => {
  const getPlan =
    privateMode && privateMode.plans && Boolean(privateMode.plans.some(item => item.slug === plan));
  return getPlan;
};
