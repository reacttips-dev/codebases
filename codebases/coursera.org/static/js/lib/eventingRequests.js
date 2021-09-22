const MAX_GET_SIZE = 4000;

function serializeVal(val) {
  return typeof val !== 'string' && window.JSON ? window.JSON.stringify(val) : val.toString();
}

// Serializes a JSON object to a query parameter string
function serialize(data) {
  const params = [];
  for (const key in data) {
    if (data[key] !== undefined) {
      params.push(key + '=' + encodeURIComponent(serializeVal(data[key])));
    }
  }

  if (!window.JSON) params.push('_noJSON_=true');
  return params.join('&');
}

function post(beacon, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', beacon, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  if (callback && typeof callback === 'function') {
    xhr.onload = function () {
      callback(xhr);
    };
    xhr.ontimeout = function () {
      callback(xhr);
    };
  }

  xhr.timeout = 5000;
  xhr.send(JSON.stringify(data));
  return xhr;
}

function postIframe(beacon, data, callback) {
  const iframe = document.createElement('iframe');
  const frameId = data.guid;
  document.body.appendChild(iframe);
  iframe.style.display = 'none';
  iframe.name = frameId;
  iframe.contentWindow.name = frameId;

  const div = document.createElement('div');
  div.style.display = 'none;';
  document.body.appendChild(div);

  const form = document.createElement('form');
  form.target = frameId;
  form.action = beacon;
  form.method = 'POST';
  div.appendChild(form);

  let input;
  for (const key in data) {
    if (data[key] !== undefined) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = serializeVal(data[key]);
      form.appendChild(input);
    }
  }

  iframe.onload = iframe.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'complete') {
      iframe.onreadystatechange = iframe.onload = null;
      iframe.parentNode.removeChild(iframe);
      form.parentNode.removeChild(form);
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  form.submit();
}

function getScript(beacon, data, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = beacon + '?' + serialize(data);

  script.onload = script.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'complete') {
      script.onreadystatechange = script.onload = null;
      script.parentNode.removeChild(script);
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  document.head.appendChild(script);
}

/**
 * Send event to server. (legacy)
 *
 * Use GET by default, or POST if the data is too large
 */
function ping(beacon, data, callback) {
  //  then use the external versions of sending events
  if (serialize(data).length < MAX_GET_SIZE) {
    // If possible, use `beacon` API which has the benefit of sending in the background, including
    // cases where the original document is closed.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#Description for more details
    // Need to create to `Blob` to specify the `Content-Type` header.
    // See https://w3c.github.io/beacon/#sec-processing-model for more details.
    if (navigator && navigator.sendBeacon && Blob) {
      const dataToSend = new Blob([serialize(data)], { type: 'application/x-www-form-urlencoded' });
      navigator.sendBeacon(beacon, dataToSend);
    } else {
      getScript(beacon, data, callback);
    }
  } else {
    postIframe(beacon, data, callback);
  }
}

export default {
  ping,
  post,
  postIframe,
  getScript,
};

export { ping, post, postIframe, getScript };
