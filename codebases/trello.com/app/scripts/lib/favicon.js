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
const $ = require('jquery');
const Browser = require('@trello/browser');
const _ = require('underscore');
const md5 = require('blueimp-md5');
const Promise = require('bluebird');
const { drawFavicon } = require('app/scripts/lib/draw-favicon');

module.exports.FavIcon = new (class {
  constructor() {
    this.settings = {};
    this._update = _.debounce(this._update, 100).bind(this);
    this._hasher = _.memoize(md5);
  }

  _update() {
    if (!Browser.supportsDynamicFavicon()) {
      return;
    }

    return Promise.try(() => {
      if (this.settings.url != null) {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.setAttribute('crossorigin', 'anonymous');
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
          return (img.src = `${this.settings.url}?favicon`);
        });
      }
    })
      .then((img) => {
        const href = drawFavicon(img, this.settings);
        $('#favicon').remove();
        return $('<link>')
          .attr({
            id: 'favicon',
            rel: 'icon',
            type: 'image/png',
            sizes: '64x64',
            href,
          })
          .appendTo('head');
      })
      .catch(function () {})
      .done();
  }

  setNotifications(hasNotifications) {
    this.settings.hasNotifications = hasNotifications;

    return this._update();
  }

  setBackground({ url, tiled, color, useDefault }) {
    this.settings.url = url;
    this.settings.tiled = tiled;
    this.settings.color = color;
    this.settings.useDefault = useDefault;

    return this._update();
  }
})();
