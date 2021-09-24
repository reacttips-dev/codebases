let timeout;

export const debounce = (func, wait) => {
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
