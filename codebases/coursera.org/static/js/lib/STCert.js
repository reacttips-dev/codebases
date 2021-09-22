/* eslint-disable new-cap */
import $ from 'jquery';

// We cache whether a school has an ST icon in S3 or not
// Assumption, if you have one cert icon, you have ALL cert icons
const ST_CERT_CACHE = {
  _generic: true,
};

function makeCheckCertFn(filename) {
  return function (universityShortName = '_generic') {
    const deferred = $.Deferred();

    if (universityShortName in ST_CERT_CACHE) {
      if (ST_CERT_CACHE[universityShortName]) {
        deferred.resolve('https://s3.amazonaws.com/coursera/universities/' + universityShortName + '/' + filename);
      } else {
        deferred.resolve('https://s3.amazonaws.com/coursera/universities/_generic/' + filename);
      }

      return deferred;
    }

    // Try loading the image to determine if it exists, then save into cache
    const img = new Image();
    img.onload = function () {
      ST_CERT_CACHE[universityShortName] = true;
      deferred.resolve('https://s3.amazonaws.com/coursera/universities/' + universityShortName + '/' + filename);
    };
    img.onerror = function () {
      ST_CERT_CACHE[universityShortName] = false;
      deferred.resolve('https://s3.amazonaws.com/coursera/universities/_generic/' + filename);
    };
    img.src = 'https://s3.amazonaws.com/coursera/universities/' + universityShortName + '/' + filename;

    return deferred;
  };
}

export default {
  getSTCertCorner: makeCheckCertFn('signature-cert-corner.png'),
  getSTCertIcon: makeCheckCertFn('signature-cert-icon.png'),
};
