import scriptjs from 'scriptjs';

const facebookUrl = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8';
const googleUrl = '//apis.google.com/js/client.js?onload=onGoogleLoad';
const googleSignInApiUrl = '//apis.google.com/js/platform.js?onload=onGoogleSignInLoad';
const verbitWidgetUrl = '//api.verbit.co/assets/widget.js';

// Expose the script loader as a property of an exported object
// so that it may be mocked in the unit test suite. Hacky,
// but will be eventually addressed by refactoring.
// TODO: https://skillsharenyc.atlassian.net/browse/SK-18279
const loader = {
  scriptjs,
};

const Adapter = {
  loaders:[],
  makeNewLoader: function(url, cb, errCb) {
    this.loaders[url] = loader.scriptjs(url, cb, errCb);
    return this.loaders[url];
  },

  loadScript: function(url, cb, errCb) {
    return this.loaders[url] || this.makeNewLoader(url, cb, errCb);
  },
};

const facebook = (cb, errCb) => Adapter.loadScript(facebookUrl, cb, errCb);
const google = (cb, errCb) => Adapter.loadScript(googleUrl, cb, errCb);
const googleSignIn = (cb, errCb) => Adapter.loadScript(googleSignInApiUrl, cb, errCb);
const verbitWidget = (cb, errCb) => Adapter.loadScript(verbitWidgetUrl, cb, errCb);

export default {
  facebook,
  google,
  googleSignIn,
  verbitWidget,
  loader,
};
