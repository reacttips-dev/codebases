export const getQueryParameter = (param: string) => {
  const currentParams = new URLSearchParams(window.location.search);
  return currentParams.get(param);
};
