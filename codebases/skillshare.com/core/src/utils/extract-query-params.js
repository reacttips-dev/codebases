
export default function extractQueryParams(httpSearch) {
  const search = httpSearch ? httpSearch.replace(/^[^?]*/, '') : document.location.search;
  const params = {};

  search.replace(
    /([^?=&]+)(?:=([^&]*))?/g,
    function(_match, key, value) {
      params[key] = value;
    }
  );
  return params;
}

