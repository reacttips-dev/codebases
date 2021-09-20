/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Browser = require('@trello/browser');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { stickerSize } = require('app/scripts/data/sticker-size');
const { stickerClip } = require('app/scripts/lib/util/sticker-clip');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'sticker_on_card',
);
const Promise = require('bluebird');
const { track } = require('@trello/analytics');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const HOVER_WAIT_MS = 350;
const REMOVE_WAIT_MS = 200;
const OVERLAP_PX = 8;

const USE_FANCY_PEEL = Browser.supportsFancyPeel();

const template = t.renderable(function ({
  url,
  rotate,
  image,
  showEditControls,
  showRemoveUI,
  isGiphySticker,
}) {
  if (showRemoveUI) {
    t.div(
      {
        class: t.classify({
          'sticker-removing': true,
          'giphy-sticker': isGiphySticker,
        }),
      },
      function () {
        t.div('.sticker-removing-highlight', {
          style: `transform: rotate(${rotate}deg)`,
        });
        if (USE_FANCY_PEEL) {
          t.img('.sticker-remove-image.sticker-removing-residue', {
            src: require('resources/images/stickers/residue.png'),
            style: `--sticker-rotation: ${rotate}deg; mask-image: ${t.urlify(
              url,
            )}; -webkit-mask-image: ${t.urlify(url)};`,
          });
          t.img('.sticker-remove-image.sticker-removing-shadow', {
            src: url,
            style: `--sticker-rotation: ${rotate}deg`,
          });
          t.img('.sticker-remove-image.sticker-removing-fixed', {
            src: url,
            style: `--sticker-rotation: ${rotate}deg;`,
          });
          return t.img('.sticker-remove-image.sticker-removing-peel', {
            src: url,
            style: `--sticker-rotation: ${rotate}deg`,
          });
        } else {
          return t.img('.sticker-remove-image.sticker-removing-fixed', {
            src: url,
            style: `transform: rotate(${rotate}deg)`,
          });
        }
      },
    );

    return t.span(
      '.sticker-control-btn.remove-btn.js-remove-sticker',
      { style: 'display: none' },
      () => t.format('remove'),
    );
  } else {
    t.img({
      class: t.classify({
        'sticker-image': true,
        'giphy-sticker': isGiphySticker,
      }),
      src: url,
      style: `-webkit-transform: rotate(${rotate}deg);transform: rotate(${rotate}deg);`,
      alt: image,
    });
    if (showEditControls) {
      return t.div('.sticker-controls', function () {
        t.span('.sticker-control-btn.rotate-btn.js-rotate-sticker', () =>
          t.format('rotate'),
        );
        t.span('.sticker-control-btn.move-btn.js-move-sticker', () =>
          t.format('move'),
        );
        return t.span('.sticker-control-btn.remove-btn.js-remove-sticker', () =>
          t.format('remove'),
        );
      });
    }
  }
});

const measure = function (el, options) {
  if (options == null) {
    options = {};
  }
  const rect = el.getBoundingClientRect();

  const { left } = rect;
  const { top } = rect;
  const right = options.fixedWidth ? left + options.fixedWidth() : rect.right;
  const bottom = options.fixedHeight
    ? top + options.fixedHeight()
    : rect.bottom;

  return {
    left,
    top,
    bottom,
    right,
    width: right - left,
    height: bottom - top,
    x: left + (right - left) / 2,
    y: top + (bottom - top) / 2,
  };
};

// Find the best position for a control so that it
// - Is near the item being operated on (rect)
// - Is fully contained in a container (containerRect)
// - Is far from where the cursor is currently headed
const getOptimalRemovePosition = function ({
  rect,
  containerRect,
  controlRect,
  currentX,
  currentY,
  deltaX,
  deltaY,
  interval,
}) {
  const angle = Util.getPositiveDegrees(-deltaY, deltaX);

  // We want to avoid some placements if they look like they're in the direction
  // the mouse is headed
  const near = (avoidAngle) =>
    avoidAngle - 45 < angle && angle < avoidAngle + 45;

  const yTop = -controlRect.height + OVERLAP_PX;
  const yMiddle = (rect.height - controlRect.height) / 2;
  const yBottom = rect.height - OVERLAP_PX;

  const xLeft = -controlRect.width + OVERLAP_PX;
  const xMiddle = (rect.width - controlRect.width) / 2;
  const xRight = rect.width - OVERLAP_PX;

  const potentialPositions = [
    // South
    {
      left: xMiddle,
      top: yBottom,
      avoid: near(270),
    },
    // North
    {
      left: xMiddle,
      top: yTop,
      avoid: near(90),
    },
    // East
    {
      left: xRight,
      top: yMiddle,
      avoid: near(0) || near(360),
    },
    // West
    {
      left: xLeft,
      top: yMiddle,
      avoid: near(180),
    },
    // Southwest
    {
      left: xLeft,
      top: yBottom,
      avoid: near(225),
    },
    // Southeast
    {
      left: xRight,
      top: yBottom,
      avoid: near(315),
    },
    // Northwest
    {
      left: xLeft,
      top: yTop,
      avoid: near(135),
    },
    // Northeast
    {
      left: xRight,
      top: yTop,
      avoid: near(45),
    },
  ];

  const positionsWithVisibleArea = potentialPositions
    .map((pos) => {
      const left = pos.left + (rect.left - containerRect.left);
      const top = pos.top + (rect.top - containerRect.top);
      const right = left + controlRect.width;
      const bottom = top + controlRect.height;

      const area =
        (Math.min(right, containerRect.width) - Math.max(0, left)) *
        (Math.min(bottom, containerRect.height) - Math.max(0, top));

      return { ...pos, visibleArea: area };
    })
    .sort((a, b) => b.visibleArea - a.visibleArea);

  return (
    positionsWithVisibleArea.filter((pos) => !pos.avoid)[0] ||
    positionsWithVisibleArea.filter((pos) => pos.avoid)[0] ||
    positionsWithVisibleArea[0]
  );
};

let removeRect = null;

class StickerView extends View {
  static initClass() {
    this.prototype.className = 'sticker';
  }

  initialize() {
    super.initialize(...arguments);

    return this.listenTo(this.model, 'change', this.render);
  }

  showEditControls() {
    return false;
  }

  events() {
    if (!this.options.canRemove) {
      return {};
    }

    return {
      mouseenter(e) {
        if (!this.showRemoveUI) {
          this.showRemoveUI = true;
          return this.render();
        }
      },

      mouseleave: 'mouseLeave',
      mousemove: 'mouseMove',
      mousedown(e) {
        if (!this.$(e.target).closest('.js-remove-sticker').length) {
          return this.removeRemove();
        }
      },
      'left-sticker': 'removeRemove',
      'mousemove .js-remove-sticker'(e) {
        // Don't let the outer mouseMove handler get this; it'll
        // cancel a click on the remove button if the cursor moves
        // a little while the mouse is down
        return Util.stop(e);
      },

      'mouseenter .js-remove-sticker'(e) {
        return this.$el.addClass('peeling');
      },

      'mouseleave .js-remove-sticker'(e) {
        return this.$el.removeClass('peeling');
      },

      'click .js-remove-sticker'(e) {
        Util.stop(e);
        return this.removeSticker();
      },
    };
  }

  render() {
    const data = this.model.toJSON();
    data.url =
      Util.smallestPreviewBiggerThan(data.imageScaled, stickerSize)?.url ??
      data.imageUrl;
    data.showEditControls = this.showEditControls();
    data.showRemoveUI = this.showRemoveUI;

    this.$el.html(template(data)).css({
      left: `${stickerClip(data.left)}%`,
      top: `${stickerClip(data.top)}%`,
    });

    return this;
  }

  mouseMove(e) {
    if (e.buttons) {
      return this.removeRemove();
    } else if (this.showingRemove) {
      return this.clearTimeouts();
    } else if (this.hoverTimeout) {
      this.currentX = e.offsetX;
      return (this.currentY = e.offsetY);
    } else {
      this.$el.siblings().trigger('left-sticker');

      this.currentX = this.startX = e.offsetX;
      this.currentY = this.startY = e.offsetY;

      return (this.hoverTimeout = this.setTimeout(() => {
        return this.showRemove();
      }, HOVER_WAIT_MS));
    }
  }

  showRemove() {
    if (this.showingRemove) {
      return;
    }
    this.showingRemove = true;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    this.$el.addClass('hover');

    const $removeSticker = this.$('.js-remove-sticker');

    return Promise.try(() => {
      // HACK: Get the dimensions of the "remove sticker" button
      if (removeRect) {
        return removeRect;
      }

      $removeSticker.css({ display: 'inline-block' });
      return new Promise((resolve) => {
        return this.requestAnimationFrame(() => {
          removeRect = measure($removeSticker.get(0));
          $removeSticker.css({ display: 'none' });
          return resolve(removeRect);
        });
      });
    })
      .then((controlRect) => {
        const { left, top } = getOptimalRemovePosition({
          rect: measure(this.el),
          containerRect: measure(this.$el.closest('.js-stickers-area').get(0), {
            fixedWidth: this.options.fixedWidth,
            fixedHeight: this.options.fixedHeight,
          }),

          controlRect,
          currentX: this.currentX,
          currentY: this.currentY,
          deltaX,
          deltaY,
          interval: HOVER_WAIT_MS,
        });

        return $removeSticker.css({
          display: 'inline-block',
          top,
          left,
        });
      })
      .done();
  }

  removeRemove(e) {
    if (!this.showingRemove) {
      return;
    }
    this.showingRemove = false;

    this.clearTimeouts();

    this.$('.js-remove-sticker').css({ display: 'none' });
    return this.$el.removeClass('hover peeling');
  }

  mouseLeave(e) {
    this.clearTimeouts();

    return (this.removeTimeout = this.setTimeout(() => {
      return this.removeRemove();
    }, REMOVE_WAIT_MS));
  }

  clearTimeouts() {
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = null;
    clearTimeout(this.removeTimeout);
    return (this.removeTimeout = null);
  }

  removeSticker() {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/stickers',
      source: 'stickerHoverView',
      attributes: {
        action: 'removed',
      },
    });
    track('Card', 'Sticker', 'Remove via Hover');

    this.clearTimeouts();
    this.$el.remove();
    return this.model.destroyWithTracing(
      {
        traceId,
      },
      tracingCallback(
        {
          taskName: 'edit-card/stickers',
          traceId,
          source: 'stickerHoverView',
          attributes: {
            action: 'removed',
          },
        },
        (_err, sticker) => {
          if (sticker) {
            const card = this.options?.card;
            Analytics.sendUpdatedCardFieldEvent({
              field: 'stickers',
              source: 'stickerHoverView',
              attributes: {
                taskId: traceId,
                action: 'removed',
              },
              containers: {
                card: {
                  id: card?.id,
                },
                list: {
                  id: card?.get('idList'),
                },
                board: {
                  id: card?.get('idBoard'),
                },
              },
            });
          }
        },
      ),
    );
  }
}

StickerView.initClass();
module.exports = StickerView;
