module.exports = function parseUrl(url) {
  var scheme = /^\w+:\/\//.exec(url);
  var i = 0;

  if (scheme) {
    i = scheme[0].length + 1;
  }

  var slashIndex = url.indexOf('/', i);

  if (slashIndex === -1) {
    return {
      origin: url,
      pathname: '/'
    };
  }

  return {
    origin: url.slice(0, slashIndex),
    pathname: url.slice(slashIndex)
  };
};