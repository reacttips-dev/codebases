export const removeQueryParameters = (...params: string[]) => {
  const currentParams = new URLSearchParams(window.location.search);

  params.forEach((param) => {
    currentParams.delete(param);
  });

  const newParams = currentParams.toString();
  const newParamString = newParams ? `?${newParams}` : '';
  const newUrl = `${window.location.origin}${window.location.pathname}${newParamString}`;

  window.history.replaceState({}, document.title, newUrl);
};
