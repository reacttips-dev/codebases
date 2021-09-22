// set google api button language
if (typeof window !== 'undefined') {
  // We use an async import because this is a client-side-only import.
  import('js/lib/language').then((language) => {
    window.___gcfg = {
      lang: language.getIetfLanguageTag(),
      parsetags: 'explicit',
    };
  });
}

var thirdparty = {
  loadScript(url, success, body, error) {
    const newScript = document.createElement('script');
    const scripts = document.getElementsByTagName('script');

    newScript.type = 'text/javascript';
    newScript.async = true;
    newScript.src = url;

    if (body) {
      newScript.innerHTML = body;
    }

    if (success) {
      newScript.onload = function () {
        newScript.onreadystatechange = null;
        newScript.onload = null;
        success();
      };

      newScript.onreadystatechange = newScript.onload;
    }

    newScript.onerror = error;

    if (scripts && scripts.length) scripts[0].parentNode.insertBefore(newScript, scripts[0]);
    else if (window.document && window.document.body) window.document.body.appendChild(newScript);
  },

  isDefined(parent, name) {
    const parts = name.split('.');
    let part = parts.shift();
    let cur = parent;

    while (part) {
      if (cur[part]) {
        cur = cur[part];
        part = parts.shift();
      } else {
        cur = null;
        part = null;
      }
    }
    return cur !== null;
  },

  ready(global, callback) {
    if (thirdparty.isDefined(window, global)) {
      callback.call();
    } else {
      const base = global.split('.')[0];
      // if pool is an array, then we have another function waiting on a script load
      if (Array.isArray(pool[global])) {
        pool[global].push(callback);
      } else {
        // save callback for when scriptloader is done
        pool[global] = [callback];

        // load third party script
        thirdPartyGlobals[base].call(null, global);
      }
    }
  },
};

var pool = {};

var poll = function (global) {
  if (thirdparty.isDefined(window, global)) {
    while (pool[global] && pool[global].length) {
      pool[global].pop().call();
    }
  } else {
    // SOME (not all) third party scripts load up other scripts which load up other scripts
    // only then is the full object path ready to be used
    // keep polling, to wait.
    // this is a generic solution, if the script provides a callback
    // make use of it inside the script loading function. see google maps api above
    // for an example of this much cleaner method
    window.setTimeout(function () {
      poll(global);
    }, 100);
  }
};

var thirdPartyGlobals = {
  IN(x) {
    const funcName = 'itsThirdPartyTime' + new Date().getTime();
    window[funcName] = function () {
      delete window[funcName]; // cleaning up the global garbage
      poll(x);
    };
    thirdparty.loadScript(
      'https://platform.linkedin.com/in.js',
      function () {},
      'onLoad:' + funcName + '\napi_key: ' + 'v7ah6tdxsqt6'
    );
  },

  google(x) {
    // if we are looking for google maps api
    let funcName;
    if (/^google\.maps.places/.test(x)) {
      funcName = 'itsThirdPartyTime' + new Date().getTime();
      window[funcName] = function () {
        delete window[funcName]; // cleaning up the global garbage
        poll(x);
      };
      thirdparty.loadScript(
        'https://maps.googleapis.com/maps/api/js' +
          '?sensor=false&key=AIzaSyCclnr7mU5-0-2FMrUsvwqkCzB0M2dp0SA&libraries=places&callback=' +
          funcName
      );
    }
    if (/^google\.maps\.Map/.test(x)) {
      funcName = 'itsThirdPartyTime' + new Date().getTime();
      window[funcName] = function () {
        delete window[funcName]; // cleaning up the global garbage
        poll(x);
      };
      thirdparty.loadScript(
        'https://maps.googleapis.com/maps/api/js' +
          '?sensor=false&key=AIzaSyCzodUI0p0hH-8n6tZ45vMNlaNfKEpuEMU&callback=' +
          funcName
      );
    }
    /* extending example */
    // else if (/^google\.serviceX/.test(x)) {
    //   var funcName = 'itsThirdPartyTimeAgain' + new Date().getTime();
    //   window[funcName] = function() {
    //     delete window[funcName]; // cleaning up the global garbage
    //     poll(x);
    //   };
    //   thirdparty.loadScript('https://serviceX.googleapis.com/?callback=' + funcName);
    // }
  },

  FB(x) {
    import('js/lib/language').then((language) => {
      thirdparty.loadScript(
        'https://connect.facebook.net/' + language.getFacebookLocaleString() + '/all.js#xfbml=1&appId=823425307723964',
        function () {
          poll(x);
        }
      );
    });
  },

  gapi(x) {
    // load google plus apis
    thirdparty.loadScript('https://apis.google.com/js/plusone.js', function () {
      poll(x);
    });
  },

  twttr(x) {
    // load twitter apis
    thirdparty.loadScript('https://platform.twitter.com/widgets.js', function () {
      poll(x);
    });
  },
  MathJax(x) {
    // http://docs.mathjax.org/en/latest/configuration.html
    const url = 'https://d2265nx4vomwra.cloudfront.net/2.1/MathJax.js?delayStartupUntil=configured';

    thirdparty.loadScript(url, function () {
      poll(x);
    });
  },
};

export default thirdparty;
