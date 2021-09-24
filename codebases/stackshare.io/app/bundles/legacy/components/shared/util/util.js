import parseGithub from 'parse-github-url';

for (let el of document.querySelectorAll('[data-click-toggle-class]'))
  el.addEventListener('click', clickToggleClass);

function clickToggleClass(e) {
  let klass = e.target.getAttribute('data-click-toggle-class');
  if (klass) e.target.classList.toggle(klass);
  else clickToggleClass({target: e.target.parentElement});
}

window.stopEvent = function(e) {
  try {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
  } catch (err) {
    //bury
  }
};

window.simpleDomainFromUrl = function(url) {
  if (url === undefined || url === '') {
    return '';
  }
  let github = parseGithub(url);
  if (url.includes('github.com') && !url.includes('github.com/blog') && github && github.repo) {
    return `https://github.com/${github.repo}`;
  }
  let dom = '',
    v,
    step = 0;
  for (let i = 0, l = url.length; i < l; i++) {
    v = url[i];
    if (step === 0) {
      //First, skip 0 to 5 characters ending in ':' (ex: 'https://')
      if (i > 5) {
        i = -1;
        step = 1;
      } else if (v === ':') {
        i += 2;
        step = 1;
      }
    } else if (step === 1) {
      //Skip 0 or 4 characters 'www.'
      //(Note: Doesn't work with www.com, but that domain isn't claimed anyway.)
      if (v === 'w' && url[i + 1] === 'w' && url[i + 2] === 'w' && url[i + 3] === '.') i += 4;
      dom += url[i];
      step = 2;
    } else if (step === 2) {
      //Stop at subpages, queries, and hashes.
      if (v === '/' || v === '?' || v === '#') break;
      dom += v;
    }
  }
  return dom;
};
