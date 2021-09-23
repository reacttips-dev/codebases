import { populateTourWithCopy } from './tourCopy';
import isTourValid from './isTourValid';
import SentryManager from '../manager/SentryManager';

// Generates a lazy-loadable chunk for each tour config file
// @ts-expect-error dependency missing types
var TOUR_CONFIGS = require.context('../tours', true, /^.*.ts$/, 'lazy');

export default function getTour(tourId) {
  return new Promise(function (resolve, reject) {
    if (!isTourValid(tourId)) {
      reject(new Error("tourId not valid: " + tourId));
      return;
    } // Lazy load tour config file chunk


    resolve(TOUR_CONFIGS("./" + tourId + ".ts"));
  }).then(function (maybeGetTourConfig) {
    var getTourConfig = maybeGetTourConfig.default || maybeGetTourConfig; // Call default export of tour config file, function can be async

    return getTourConfig();
  }).then(function (maybeTour) {
    var tourConfig = maybeTour.default || maybeTour;
    var tourWithCopy = populateTourWithCopy(tourConfig);
    return tourWithCopy;
  }).catch(function (error) {
    SentryManager.reportLoadTourError(error, tourId);
    throw new Error("Error loading tour: " + tourId);
  });
}