'use es6';

export default (function (domain) {
  if (domain.indexOf('http') === -1) {
    domain = "http://" + domain;
  }

  var a = document.createElement('a');
  a.href = domain;
  return a.hostname;
});