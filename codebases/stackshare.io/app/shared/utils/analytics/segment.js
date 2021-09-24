const initSegment = writeKey =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line
    // prettier-ignore
    const analytics = window.analytics = window.analytics || [];
    if (!analytics.initialize) {
      if (analytics.invoked) {
        reject('Segment snippet included twice.');
      } else {
        analytics.invoked = true;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on'
        ];
        analytics.factory = function(method) {
          return function() {
            let e = Array.prototype.slice.call(arguments);
            e.unshift(method);
            analytics.push(e);
            return analytics;
          };
        };
        for (let i = 0; i < analytics.methods.length; i++) {
          const key = analytics.methods[i];
          analytics[key] = analytics.factory(key);
        }
        analytics.load = function(key, options) {
          let n = document.createElement('script');
          n.type = 'text/javascript';
          n.async = true;
          n.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';
          const a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(n, a);
          analytics._loadOptions = options;
        };
        analytics.SNIPPET_VERSION = '4.1.0';
        analytics.load(writeKey);
        resolve(analytics);
      }
    } else {
      reject('Segment already initialized.');
    }
  });

export default initSegment;
