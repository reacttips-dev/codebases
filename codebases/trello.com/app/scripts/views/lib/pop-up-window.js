/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = class PopUpWindow {
  constructor(url, windowName, width, height) {
    if (windowName == null) {
      windowName = 'Trello';
    }
    if (width == null) {
      width = 450;
    }
    if (height == null) {
      height = 700;
    }
    this.url = url;
    this.windowName = windowName;
    this.width = width;
    this.height = height;
  }

  open() {
    const left = window.screenX + (window.innerWidth - this.width) / 2;
    const top = window.screenY + (window.innerHeight - this.height) / 2;

    return (this.popup = window.open(
      this.url,
      this.windowName,
      `width=${this.width},height=${this.height},top=${top},left=${left}`,
    ));
  }
};
