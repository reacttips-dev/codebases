/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const $ = require('jquery');
const PluginBoardBarView = require('app/scripts/views/plugin/plugin-board-bar-view');

const DEFAULT_HEIGHT = 200;
// what percentage of board view (vertically) a board bar may consume
const MAX_PERCENTAGE = 0.6;
// space dedicated to Trello Chrome around the iframe
const CHROME_SPACE = 44;
// how much vertical space to reserve for board header and a glimpse of your lists
const MINIMUM_REMAINDER_HEIGHT = 180;

module.exports = new ((function () {
  const Cls = class {
    static initClass() {
      this.boardBarView = null;
      this.desiredHeight = DEFAULT_HEIGHT;
    }

    _computeMaxHeight() {
      const boardHeight = $('.board-main-content').height();
      let maxHeight = MAX_PERCENTAGE * boardHeight - CHROME_SPACE;

      if ((1 - MAX_PERCENTAGE) * boardHeight < MINIMUM_REMAINDER_HEIGHT) {
        maxHeight = boardHeight - CHROME_SPACE - MINIMUM_REMAINDER_HEIGHT;
        if (maxHeight < 0) {
          maxHeight = 0;
        }
      }

      return maxHeight;
    }

    isOpen() {
      return this.boardBarView != null;
    }

    restrictHeight(userOverride) {
      const $boardBarIframe = $('.plugin-board-bar iframe');
      if (!$boardBarIframe.length) {
        return;
      }

      if (this.desiredHeight < 0) {
        this.desiredHeight = 0;
      }

      const maxHeight = this._computeMaxHeight();
      const actualHeight = Math.min(this.desiredHeight, maxHeight);

      // when restricting height as a result of a user resize we treat desired
      // height as the actual height to prevent oversetting the field making it
      // hard / awkward to shrink
      if (userOverride) {
        this.desiredHeight = actualHeight;
      }

      return $boardBarIframe.height(`${actualHeight}px`);
    }

    open(args) {
      const { model, content } = args;

      this.close();

      this.boardBarView = new PluginBoardBarView({
        model,
        content,
        fxClose: this.close.bind(this),
        fxResize: this.incrementDesiredHeight.bind(this),
      });
      this.desiredHeight = content.height || DEFAULT_HEIGHT;
      $('.board-main-content').append(this.boardBarView.render().el);

      this.restrictHeight();
      $(window).on(
        'resize.plugin-board-bar',
        _.throttle(() => this.restrictHeight(), 50),
      );
    }

    close() {
      if (this.isOpen()) {
        $(window).off('resize.plugin-board-bar');
        this.boardBarView.close();
        this.boardBarView = null;
        this.desiredHeight = DEFAULT_HEIGHT;
      }
    }

    setDesiredHeight(height) {
      this.desiredHeight = height;
      return this.restrictHeight();
    }

    incrementDesiredHeight(delta) {
      this.desiredHeight += delta;
      return this.restrictHeight(true);
    }
  };
  Cls.initClass();
  return Cls;
})())();
