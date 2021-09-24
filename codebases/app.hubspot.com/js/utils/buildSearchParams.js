'use es6';

function buildSearchParams() {
  var searchParams = {};
  var search = window.location.search;

  if (search) {
    if (search.charAt(0) === '?') {
      search = search.slice(1);
    }

    var searchPairs = search.split('&');

    for (var index = 0; index < searchPairs.length; index++) {
      var parts = searchPairs[index].split('=');
      searchParams[parts[0]] = parts[1];
    }
  }

  return searchParams;
}

export default buildSearchParams;