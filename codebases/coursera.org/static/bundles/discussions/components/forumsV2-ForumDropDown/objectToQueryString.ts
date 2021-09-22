import qs from 'query-string';

// wrapper function to decouple query string library from the implementation details;
export function objectToQueryString(params) {
  return qs.stringify(params);
}
