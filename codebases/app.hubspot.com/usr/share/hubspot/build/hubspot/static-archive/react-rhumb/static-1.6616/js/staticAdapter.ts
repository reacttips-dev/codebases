var staticAdapter = function staticAdapter(pathname) {
  return {
    pathname: pathname,
    listen: function listen() {
      return function () {};
    }
  };
};

export default staticAdapter;