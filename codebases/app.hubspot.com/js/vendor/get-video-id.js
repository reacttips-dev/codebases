'use es6';

export default function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('get-video-id expects a string');
  } // remove surrounding whitespaces or linefeeds


  str = str.trim(); // remove the '-nocookie' flag from youtube urls

  str = str.replace('-nocookie', ''); // remove any leading `www.`

  str = str.replace('/www.', '/');
  var metadata; // Try to handle google redirection uri

  if (/\/\/google/.test(str)) {
    // Find the redirection uri
    var matches = str.match(/url=([^&]+)&/); // Decode the found uri and replace current url string - continue with final link

    if (matches) {
      // Javascript can get encoded URI
      str = decodeURIComponent(matches[1]);
    }
  }

  if (/youtube|youtu\.be|i.ytimg\./.test(str)) {
    metadata = {
      id: youtube(str),
      service: 'youtube'
    };
  } else if (/vimeo/.test(str)) {
    metadata = {
      id: vimeo(str),
      service: 'vimeo'
    };
  } else if (/vine/.test(str)) {
    metadata = {
      id: vine(str),
      service: 'vine'
    };
  } else if (/videopress/.test(str)) {
    metadata = {
      id: videopress(str),
      service: 'videopress'
    };
  }

  return metadata;
}
;
/**
 * Get the vimeo id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */

function vimeo(str) {
  if (str.indexOf('#') > -1) {
    str = str.split('#')[0];
  }

  if (str.indexOf('?') > -1) {
    str = str.split('?')[0];
  }

  var id;

  if (/https?:\/\/vimeo\.com\/[0-9]+$|https?:\/\/player\.vimeo\.com\/video\/[0-9]+$|https?:\/\/vimeo\.com\/channels|groups|album/igm.test(str)) {
    var arr = str.split('/');

    if (arr && arr.length) {
      id = arr.pop();
    }
  }

  return id;
}
/**
 * Get the vine id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */


function vine(str) {
  var regex = /https:\/\/vine\.co\/v\/([a-zA-Z0-9]*)\/?/;
  var matches = regex.exec(str);
  return matches && matches[1];
}
/**
 * Get the Youtube Video id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */


function youtube(str) {
  // shortcode
  var shortcode = /youtube:\/\/|https?:\/\/youtu\.be\//g;

  if (shortcode.test(str)) {
    var shortcodeid = str.split(shortcode)[1];
    return stripParameters(shortcodeid);
  } // /v/ or /vi/


  var inlinev = /\/v\/|\/vi\//g;

  if (inlinev.test(str)) {
    var inlineid = str.split(inlinev)[1];
    return stripParameters(inlineid);
  } // v= or vi=


  var parameterv = /v=|vi=/g;

  if (parameterv.test(str)) {
    var arr = str.split(parameterv);
    return arr[1].split('&')[0];
  } // v= or vi=


  var parameterwebp = /\/an_webp\//g;

  if (parameterwebp.test(str)) {
    var webp = str.split(parameterwebp)[1];
    return stripParameters(webp);
  } // embed


  var embedreg = /\/embed\//g;

  if (embedreg.test(str)) {
    var embedid = str.split(embedreg)[1];
    return stripParameters(embedid);
  } // user


  var userreg = /\/user\//g;

  if (userreg.test(str)) {
    var elements = str.split('/');
    return stripParameters(elements.pop());
  } // attribution_link


  var attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/;

  if (attrreg.test(str)) {
    return str.match(attrreg)[1];
  }
}
/**
 * Get the VideoPress id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */


function videopress(str) {
  var idRegex;

  if (str.indexOf('embed') > -1) {
    idRegex = /embed\/(\w{8})/;
    return str.match(idRegex)[1];
  }

  idRegex = /\/v\/(\w{8})/;
  return str.match(idRegex)[1];
}
/**
 * Strip away any parameters following `?` or `/`
 * @param str
 * @returns {*}
 */


function stripParameters(str) {
  // Split parameters or split folder separator
  if (str.indexOf('?') > -1) {
    return str.split('?')[0];
  } else if (str.indexOf('/') > -1) {
    return str.split('/')[0];
  }

  return str;
}