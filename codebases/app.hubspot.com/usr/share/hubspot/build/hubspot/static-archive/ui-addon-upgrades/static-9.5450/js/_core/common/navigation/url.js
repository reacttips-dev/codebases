'use es6';

export var navigateTo = function navigateTo(url) {
  if (window.hubspot.wordpress) {
    window.open(url, '_top');
  } else {
    window.location.href = url;
  }
};
export var openNewTab = function openNewTab(url) {
  window.open(url, '_blank');
};