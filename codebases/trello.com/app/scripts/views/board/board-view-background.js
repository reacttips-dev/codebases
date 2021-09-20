/* eslint-disable
    default-case,
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { UnsplashTracker } = require('@trello/unsplash');
const { FavIcon } = require('app/scripts/lib/favicon');
const { Backgrounds } = require('app/scripts/data/backgrounds');
const { Util } = require('app/scripts/lib/util');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.getAllBackgroundClasses = () =>
  [
    'body-custom-board-background',
    'body-custom-board-background-tiled',
    'body-light-board-background',
    'body-dark-board-background',
    'body-ambiguous-board-background',
    'body-default-header',
  ].join(' ');

module.exports.defaultBoardBackground = function () {
  this.clearBoardBackground();
  $('#trello-root').addClass('body-default-header');
};

module.exports.clearBoardBackground = function () {
  const allBackgroundClasses = this.getAllBackgroundClasses();

  $('#trello-root').removeClass(allBackgroundClasses).css({
    'background-image': '',
    'background-color': '',
  });
};

module.exports.renderBoardBackground = function (waitForImage) {
  if (waitForImage == null) {
    waitForImage = false;
  }
  this.clearBoardBackground();

  const prefs = this.model.get('prefs');
  const $body = $('#trello-root');

  if (prefs.background.startsWith('gradient-')) {
    const gradientUrl = prefs.backgroundImage;

    const changeBackgroundImage = () => {
      $body.addClass('body-gradient-board-background');

      $body.css({
        'background-color': prefs.backgroundColor,
        'background-image': `url("${gradientUrl}")`,
      });

      return FavIcon.setBackground({
        url: gradientUrl,
        tiled: prefs.backgroundTile,
      });
    };
    return changeBackgroundImage();
  }

  if (prefs.backgroundColor != null) {
    const hexcolor = this.model.getClientBackgroundColor(prefs.background);

    $body.css({
      'background-color': hexcolor,
    });

    return FavIcon.setBackground({ color: hexcolor });
  } else {
    let smallUrl, url;
    if (Backgrounds.hasOwnProperty(prefs.background)) {
      // Special handling for our default backgrounds, to avoid using the
      // really huge versions
      let left;
      url =
        (left = __guard__(
          Util.smallestPreviewBiggerThan(prefs.backgroundImageScaled, 640, 480),
          (x) => x.url,
        )) != null
          ? left
          : prefs.backgroundImage;
    } else {
      let left1;
      url =
        (left1 = __guard__(
          Util.biggestPreview(
            prefs.backgroundImageScaled,
            prefs.backgroundImage,
          ),
          (x1) => x1.url,
        )) != null
          ? left1
          : prefs.backgroundImage;
    }

    if (prefs.backgroundTile) {
      smallUrl = url;
    } else {
      let left2;
      smallUrl =
        (left2 = __guard__(
          Util.smallestPreviewBiggerThan(prefs.backgroundImageScaled, 64, 64),
          (x2) => x2.url,
        )) != null
          ? left2
          : prefs.backgroundImage;
    }

    const changeBackgroundImage = () => {
      $body.addClass('body-custom-board-background');

      if (prefs.backgroundTile) {
        $body.addClass('body-custom-board-background-tiled');
      }

      const brightness = prefs.backgroundBrightness;

      if (prefs.backgroundTopColor) {
        const topBrightness = Util.calculateBrightness(
          prefs.backgroundTopColor,
        );

        if (brightness !== topBrightness) {
          $body.addClass('body-ambiguous-board-background');
        }
      }

      switch (brightness) {
        case 'light':
          $body.addClass('body-light-board-background');
          break;
        case 'dark':
          $body.addClass('body-dark-board-background');
          break;
      }

      $body.css({
        'background-image': `url("${url}")`,
      });

      UnsplashTracker.trackOncePerInterval(url);

      return FavIcon.setBackground({
        url: smallUrl,
        tiled: prefs.backgroundTile,
      });
    };

    if (waitForImage) {
      return Util.waitForImageLoad(url).then(changeBackgroundImage);
    } else {
      return changeBackgroundImage();
    }
  }
};

module.exports.renderBoardHeaderSubscribed = function () {
  const isSubscribed = this.model.get('subscribed');
  this.$('.js-board-header-subscribed').toggleClass('hide', !isSubscribed);
  return this;
};
