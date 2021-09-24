export const featurePermissionCheck = (privateMode, feature) => {
  const getFeature =
    privateMode &&
    privateMode.features &&
    privateMode.features.findIndex(item => item.slug === feature);
  return getFeature && getFeature !== -1;
};
