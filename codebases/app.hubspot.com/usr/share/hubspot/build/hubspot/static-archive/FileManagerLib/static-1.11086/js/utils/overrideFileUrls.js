'use es6';

var overrideFileUrls = function overrideFileUrls(file, url) {
  return file.merge({
    url: url,
    friendly_url: url,
    alt_url: url,
    default_hosting_url: url
  });
};

export default overrideFileUrls;