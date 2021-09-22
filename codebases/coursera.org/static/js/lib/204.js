// inclusion example
//
// var tracker = [];
// tracker.push({'user': 20});
// tracker.push({'client': 'admin'});
// tracker.push({'version': 100});
//
// requirejs.config({
//   context: '204js',
//   paths: {'_204': 'https://www.coursera.org/eventing/204.min'}
// })(['_204'], function(_204) {
//   tracker = _204.batch(tracker);
// });

import TwoOhFour from 'bundles/page/lib/TwoOhFour';

import { ping } from 'js/lib/eventingRequests';

const identity = (x) => x;

let _204;
if (typeof window === 'undefined') {
  // no client event logging in server context
  const stub = {};
  Object.keys(TwoOhFour.prototype).forEach((name) => (stub[name] = identity));
  _204 = stub;
} else {
  _204 = new TwoOhFour(ping, window.document, window.location, window.screen);
}

export default _204;
