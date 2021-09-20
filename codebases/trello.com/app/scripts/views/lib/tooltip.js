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
let Tooltip;
const $ = require('jquery');
const templates = require('app/scripts/views/internal/templates');

module.exports = Tooltip = new ((function () {
  const Cls = class {
    static initClass() {
      this.prototype.STYLE = {
        DEFAULT: 'default',
        MENU: 'menu',
        BILLING: 'billing',
      };

      this.prototype.TOOLTIP_CONTAINER = 'tooltip-container';

      this.prototype.DEFAULT_OPTIONS = {
        addVerticalOffset: 0,
      };
    }
    constructor() {
      this.tooltip = null;
    }

    show(tooltipHtml, $anchor, closeable, style, options) {
      if (closeable == null) {
        closeable = true;
      }
      if (style == null) {
        style = this.STYLE.DEFAULT;
      }
      if (options == null) {
        options = this.DEFAULT_OPTIONS;
      }
      $(window).on('click', $anchor[0], this.windowClick);

      clearTimeout(this.emptyTimer);

      if (typeof tooltipHtml.renderOnce === 'function') {
        tooltipHtml = tooltipHtml.renderOnce().$el.html();
      }

      if (
        (this.tooltip != null ? this.tooltip.tooltipHtml : undefined) ===
          tooltipHtml &&
        (this.tooltip != null ? this.tooltip.$anchor[0] : undefined) ===
          $anchor[0]
      ) {
        return;
      }

      const $elem = $(
        templates.fill(require('app/scripts/views/templates/tooltip_content'), {
          tooltipHtml,
          closeable,
          style,
        }),
      );

      // remove all classes except @TOOLTIP_CONTAINER
      const $tooltip = $(`.${this.TOOLTIP_CONTAINER}`).attr(
        'class',
        this.TOOLTIP_CONTAINER,
      );

      if (style !== this.STYLE.DEFAULT) {
        $tooltip.addClass(`tooltip-${style}`);
      }

      $tooltip.html($elem);
      this.tooltip = {
        tooltipHtml,
        $anchor,
        $elem,
      };

      const { left: anchorLeft, top: anchorTop } = $anchor.offset();
      const anchorHeight = $anchor.outerHeight();
      const minRightOffset = window.innerWidth - $tooltip.outerWidth();

      $tooltip.css({
        left: Math.min(Math.max(anchorLeft - 5, 5), minRightOffset),
        top: Math.max(anchorTop + anchorHeight + options.addVerticalOffset, 5),
      });

      return $elem.addClass('active');
    }

    windowClick(e) {
      const $target = $(e.target);
      if (
        (e.target !== e.data &&
          $target.closest('.js-tooltip-content').length === 0) ||
        $target.closest('.js-tooltip-close-button').length !== 0
      ) {
        return Tooltip.hide();
      }
    }

    hide() {
      this.tooltip = null;
      const $tooltip = $(`.${this.TOOLTIP_CONTAINER}`);
      $tooltip.find('.tooltip-content').removeClass('active');
      this.emptyTimer = setTimeout(() => {
        return $tooltip.empty();
      }, 300);

      return $(window).off('click', this.windowClick);
    }
  };
  Cls.initClass();
  return Cls;
})())();
