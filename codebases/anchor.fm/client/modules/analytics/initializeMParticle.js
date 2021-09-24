const Promise = require('bluebird');

export default function initializeMParticle(apiKey) {
  if (!apiKey || typeof mParticle === 'undefined') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    window.mParticle.ready(resolve);
    if (!window.mParticle) {
      loadMParticleScript(apiKey);
    } else {
      resolve();
    }
  });
}

/**
 * Expects mParticle snippet to be half run in the page HTML
 * (reactClient.ejs)
 * https://docs.mparticle.com/developers/sdk/javascript/getting-started/#2-include-the-snippet-in-your-project
 */
function loadMParticleScript(apiKey) {
  const mp = document.createElement('script');
  mp.type = 'text/javascript';
  mp.async = true;
  mp.src = `${
    document.location.protocol === 'https:'
      ? 'https://jssdkcdns'
      : 'http://jssdkcdn'
  }.mparticle.com/js/v2/${apiKey}/mparticle.js`;
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(mp, s);
}
