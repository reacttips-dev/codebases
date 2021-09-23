'use es6';

export function openPopup(url) {
  var width = 650;
  var height = 600;
  var left = screen.width / 2 - width / 2;
  var top = 100;
  var options = "width=" + width + ",height=" + height + ",menubar=0,top=" + top + ",top=" + left + ",scrollbars=1,resizable=1";
  var popup = window.open(url, 'oauth-window', options);

  if (!popup) {
    throw new Error('Oauth popup window blocked');
  }

  popup.focus();
  return popup;
}