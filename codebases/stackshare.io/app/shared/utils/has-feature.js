export const hasFeature = (company, slug) => {
  if (company && company.features instanceof Array) {
    return Boolean(company.features.find(f => f.slug === slug));
  }
  return false;
};
