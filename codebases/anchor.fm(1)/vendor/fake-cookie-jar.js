function FakeCookieJar(cookies) {
  const parsed = {};
  Object.keys(cookies).forEach(key => {
    parsed[unescape(key)] = cookies[key];
  });
  this.cookies = parsed;
}

FakeCookieJar.prototype.get = function(key) {
  return this.cookies[key];
};

FakeCookieJar.prototype.set = function(key, value) {
  this.cookies[key] = value;
};

FakeCookieJar.prototype.expire = function(key) {
  delete this.cookies[key];
};

module.exports = FakeCookieJar;
