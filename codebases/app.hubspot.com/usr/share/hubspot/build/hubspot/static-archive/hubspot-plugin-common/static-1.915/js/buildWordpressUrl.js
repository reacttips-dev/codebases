'use es6';

var search = window.location.search;
export default function (route) {
  return "" + route + search;
}