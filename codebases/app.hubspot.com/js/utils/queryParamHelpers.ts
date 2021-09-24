export function getQueryParam(key) {
  var valueRegex = new RegExp(key + "=([^&;]+)[&;]?"); // Match value for key

  var matches = valueRegex.exec(window.location.search);

  if (matches) {
    return decodeURIComponent(matches[1]);
  }

  return null;
}
export function updateQueryParam(key, value) {
  if (value) {
    value = encodeURIComponent(value.slice(0, 4000)); // Limit query param values to 4000 characters unencoded
  }

  if (getQueryParam(key) === value) {
    return;
  }

  var _window$location = window.location,
      protocol = _window$location.protocol,
      host = _window$location.host,
      pathname = _window$location.pathname,
      search = _window$location.search,
      hash = _window$location.hash;
  var baseUrl = protocol + "//" + host + pathname;
  var newParam = !value || value === '' ? '' : key + "=" + value;
  var params = "?" + newParam;

  if (search) {
    var updateRegex = new RegExp("([?&])" + key + "[^&]*");
    var removeRegex = new RegExp("([?&])" + key + "=[^&;]+[&;]?");

    if (!value || value === '') {
      params = search.replace(removeRegex, '$1'); // Remove param

      params = params.replace(/[&;]$/, '');
    } else if (search.match(updateRegex) !== null) {
      params = search.replace(updateRegex, "$1" + newParam); // Update existing param
    } else {
      params = search + "&" + newParam; // Append param to existing params
    }
  }

  params = params === '?' ? '' : params;
  window.history.replaceState({}, '', "" + baseUrl + params + hash);
}