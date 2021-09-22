

const URLHelpers = {

  // @params: {} E.g. { 'via': 'page' }
  addParams: function(url, params) {
    const p = $.param(params);
    return (url.indexOf('?') !== -1) ? url + '&' + p : url + '?' + p;
  },

  // Return whether the url contains a certain param
  hasParam: function(key) {
    const params = URLHelpers.getParams();
    return _.has(params, key);
  },

  // Return a value for a given String param
  getParam: function(key) {
    const params = URLHelpers.getParams();
    return params[key];
  },

  getParams: function () {
    return URLHelpers.getParamsFromString(window.location.search);
  },

  // Returns an object representation of any params in the current url
  getParamsFromString: function(queryString = '') {
    if (!queryString) {
      return {};
    }

    // Remove the '?' at the start of the string and split out each assignment
    return _.chain(queryString.replace('?', '').split('&'))
    // Split each array item into [key, value]
    // ignore empty string if search is empty
      .map(function(item) {
        if (item) {return item.split('=');}
      })
    // Remove undefined in the case the search is empty
      .compact()
    // Turn [key, value] arrays into object parameters
      .object()
    // Return the value of the chain operation
      .value();

  },

};

export default URLHelpers;
