/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let DragSort;
const $ = require('jquery');
const Browser = require('@trello/browser');
const { Controller } = require('app/scripts/controller');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const PostRender = require('app/scripts/views/lib/post-render');
const { SidebarState } = require('app/scripts/view-models/sidebar-state');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const pointHorizontallyInRect = ({ x }, { left, right }) =>
  left <= x && x < right;

const inset = ({ top, left, bottom, right }, horizontal, vertical) => ({
  top: top + vertical,
  bottom: bottom - vertical,
  left: left + horizontal,
  right: right - horizontal,
});
const getMousePosition = (e) => ({
  x: e.pageX,
  y: e.pageY,
});
// TODO: good candidate for effing.js
const concat = (...fns) =>
  function () {
    for (const fn of Array.from(fns)) {
      if (fn != null) {
        fn.apply(this, arguments);
      }
    }
  };
const prefix = (fn, prefix) => concat(prefix, fn);

class DragInfo {
  static initClass() {
    this.prototype.hasMousedLeft = false;
    this.prototype.hasMousedRight = false;
    this.prototype.stopped = false;
    this.prototype.aborted = false;
  }
  constructor({
    scrollBoard,
    scrollLists,
    scrollCard,
    commitEvent,
    cancelMethod,
  }) {
    this.scrollBoard = scrollBoard;
    this.scrollLists = scrollLists;
    this.scrollCard = scrollCard;
    this.commitEvent = commitEvent;
    this.cancelMethod = cancelMethod;
    this._queue = [];
  }

  start(e, ui) {
    this.$helper = ui.helper;
    this.$target = $(e.target);
    this.initialMousePosition = getMousePosition(e);

    this.lockModelCache();
    SidebarState.hideSidebar();
    this.startTrackingMouse();
    this.hidePopoversForSomeReason();

    this.boardElement = $('#board')[0];
    this.boardCanvasElement = $('.board-canvas')[0];
    this.windowOverlayElement = $('.window-overlay')[0];

    this.cachedHoveredList = this.getHoveredListForPoint(
      this.initialMousePosition,
    );
    if (this.scrollLists || this.scrollBoard || this.scrollCard) {
      this.startAutoscrolling();
    }

    DragSort.sorting = true;
    this.onStop(() =>
      // This fixes a timing issue where cards sometimes open after dragging.
      // If sorting is cleared too early, the card click will go through.
      // Observed in Firefox.
      // Obviously there are better ways to fix this.
      _.defer(() => (DragSort.sorting = false)),
    );
  }

  lockModelCache() {
    const modelCache = Controller.getCurrentModelCache();
    if (modelCache == null) {
      throw new Error('Attempt to use DragInfo on a page with no modelCache!');
    }
    const _lockIndex = modelCache.lock('DragSort.startSort');
    return this.onStop(() => modelCache.unlock(_lockIndex));
  }

  hidePopoversForSomeReason() {
    // If you're dragging a member from the "N observers" section,
    // we don't want to hide this.
    if (this.$target.closest('.pop-over').length === 0) {
      PopOver.hide();
    }
  }

  startAutoscrolling() {
    const autoScrollRate = Math.floor(1000 / 60);
    const scrollInterval = setInterval(
      this.autoscroll.bind(this),
      autoScrollRate,
    );
    return this.onStop(() => clearInterval(scrollInterval));
  }

  getHoveredListForPoint(point) {
    for (const el of Array.from($('.js-list'))) {
      if (pointHorizontallyInRect(point, el.getBoundingClientRect())) {
        return $(el).find('.list-cards')[0];
      }
    }
    return null;
  }

  startTrackingMouse() {
    const updateHoveredList = _.throttle((point) => {
      // Because this is throttled, it's possible that it'll fire
      // after the drag has stopped. That would be madness.
      if (this.stopped) {
        return;
      }
      return (this.cachedHoveredList = this.getHoveredListForPoint(point));
    }, 100);

    const tolerance = 20;
    $(document).on('mousemove.dragsort', (e) => {
      const mousePosition = getMousePosition(e);
      if (mousePosition.x < this.initialMousePosition.x - tolerance) {
        this.hasMousedLeft = true;
      }
      if (mousePosition.x > this.initialMousePosition.x + tolerance) {
        this.hasMousedRight = true;
      }
      updateHoveredList(mousePosition);
    });

    return this.onStop(() => $(document).off('mousemove.dragsort'));
  }

  onStop(fn) {
    return this._queue.push(fn);
  }

  stop(e, ui) {
    this.stopped = true;

    for (const fn of Array.from(this._queue)) {
      fn.call(this);
    }
    delete this._queue;

    if (!this.aborted) {
      this.$target.trigger(this.commitEvent, ui);
    }
  }

  scrollDeltaForOverhang(overhang) {
    return overhang * 0.1;
  }

  autoscrollBoard() {
    const { left, right } = this.$helper[0].getBoundingClientRect();
    const scrollFrame = inset(
      this.boardCanvasElement.getBoundingClientRect(),
      100,
      0,
    );

    const leftOverhang = scrollFrame.left - left;
    if (leftOverhang > 0 && this.hasMousedLeft) {
      this.boardElement.scrollLeft -= this.scrollDeltaForOverhang(leftOverhang);
    }

    const rightOverhang = right - scrollFrame.right;
    if (rightOverhang > 0 && this.hasMousedRight) {
      this.boardElement.scrollLeft += this.scrollDeltaForOverhang(
        rightOverhang,
      );
    }
  }

  autoscrollLists() {
    const { top, bottom } = this.$helper[0].getBoundingClientRect();
    const scrollFrame = inset(
      this.cachedHoveredList.getBoundingClientRect(),
      0,
      50,
    );

    const topOverhang = scrollFrame.top - top;
    if (topOverhang > 0) {
      this.cachedHoveredList.scrollTop -= this.scrollDeltaForOverhang(
        topOverhang,
      );
    }

    const bottomOverhang = bottom - scrollFrame.bottom;
    if (bottomOverhang > 0) {
      this.cachedHoveredList.scrollTop += this.scrollDeltaForOverhang(
        bottomOverhang,
      );
    }
  }

  autoscrollCard() {
    let { bottom } = this.$helper[0].getBoundingClientRect();
    const { top } = this.$helper[0].getBoundingClientRect();

    // Some draggables, like checklists, have the potential to be really tall
    // and would be more likely to start out overhanging the bottom
    const MAX_HELPER_HEIGHT = 64;
    if (bottom - top > MAX_HELPER_HEIGHT) {
      bottom = top + MAX_HELPER_HEIGHT;
    }

    const scrollFrame = inset(
      this.windowOverlayElement.getBoundingClientRect(),
      0,
      100,
    );

    const topOverhang = scrollFrame.top - top;
    if (topOverhang > 0) {
      this.windowOverlayElement.scrollTop -= this.scrollDeltaForOverhang(
        topOverhang,
      );
    }

    const bottomOverhang = bottom - scrollFrame.bottom;
    if (bottomOverhang > 0) {
      this.windowOverlayElement.scrollTop += this.scrollDeltaForOverhang(
        bottomOverhang,
      );
    }
  }

  autoscroll() {
    if (this.scrollBoard) {
      this.autoscrollBoard();
    }
    if (this.scrollLists && this.cachedHoveredList != null) {
      this.autoscrollLists();
    }
    if (this.scrollCard) {
      this.autoscrollCard();
    }
  }

  abort() {
    let manager;
    this.aborted = true;
    // Work around a bug in jQueryUI Sortable
    // If the drag manager thinks that the element has switched sortable
    // containers, it will fire a receive event on the new container, even
    // though the drag has been cancelled
    if ((manager = $.ui.ddmanager.current) != null) {
      manager.currentContainer = manager;
    }

    return this.$target[this.cancelMethod]('cancel');
  }
}
DragInfo.initClass();

let currentDragInfo = null;

const normalizeOpts = function (customOpts, opts) {
  opts = _.defaults({}, opts, {
    distance: 7,
    scroll: false,
  });

  // This allows you to drag cards over the "Add a card..." button at the
  // bottom of lists (even though that isn't inside their destination).
  if (customOpts.scrollLists) {
    opts.custom = {
      refreshContainers() {
        this.containers = (() => {
          const result = [];
          for (const container of Array.from(this.containers)) {
            if ($.contains(document, container.element[0])) {
              const el = container.element.closest('.js-list')[0];
              const frame = el.getBoundingClientRect();
              for (const field of ['left', 'top', 'width', 'height']) {
                container.containerCache[field] = frame[field];
              }
              result.push(container);
            }
          }
          return result;
        })();
      },
    };
  }

  opts.start = prefix(opts.start, function (e, ui) {
    if (currentDragInfo != null) {
      throw new Error(
        'Attempt to start a drag event while another is in progress!',
      );
    }
    currentDragInfo = new DragInfo(customOpts);
    currentDragInfo.start(e, ui);
  });

  opts.stop = prefix(opts.stop, function (e, ui) {
    Util.stopPropagation(e);
    currentDragInfo.stop(e, ui);
    currentDragInfo = null;
  });

  return opts;
};

const afterDragCompletes = (fn) => {
  if (currentDragInfo) {
    currentDragInfo.onStop(fn);
  } else {
    fn();
  }
};

const defaultCalcSize = ($item) => ({
  width: $item.outerWidth(),
  height: $item.outerHeight(),
});

const hookSortable = function (selector, customOpts, opts) {
  if (Browser.isTouch()) {
    return;
  }
  let $elements = null;

  const shouldNormalizeAppendTo =
    !('helper' in opts) || opts.helper === 'original';
  opts.start = prefix(opts.start, function (e, ui) {
    if (shouldNormalizeAppendTo && 'appendTo' in opts) {
      ui.helper.appendTo(opts.appendTo);
      $elements.sortable('refreshPositions', true);
    }
    const { width, height } = (customOpts.calcSize != null
      ? customOpts.calcSize
      : defaultCalcSize)(ui.item);
    ui.placeholder.width(width);
    ui.placeholder.height(height);
  });

  customOpts = _.extend(
    {
      commitEvent: 'sortcommit',
      cancelMethod: 'sortable',
    },
    customOpts,
  );
  opts = normalizeOpts(customOpts, opts);

  PostRender.enqueue(() =>
    // Don't re-initialize a sortable while a drag is in progress;
    // the sortable replaces the initial placeholder with an object
    // at the start of a drag, and calling .sortable will set the
    // placeholder back to a string, causing unexpected behavior for
    // the drag in progress
    afterDragCompletes(() => {
      $elements = $(selector);
      $elements.sortable(opts);
    }),
  );
};

const hookDraggable = function (selector, customOpts, opts) {
  if (Browser.isTouch()) {
    return;
  }
  customOpts = _.extend(
    {
      commitEvent: 'dragcommit',
      cancelMethod: 'draggable',
    },
    customOpts,
  );
  opts = normalizeOpts(customOpts, opts);
  PostRender.enqueue(() => $(selector).draggable(opts));
};

module.exports = DragSort = {
  refreshListSortable() {
    return hookSortable(
      '.js-list-sortable',
      {
        scrollBoard: true,
        scrollLists: false,
        calcSize($listWrapper) {
          const $el = $listWrapper.children('.list');
          return {
            width: $el.outerWidth(),
            height: $el.outerHeight(),
          };
        },
      },
      {
        handle: '.list-header',
        tolerance: 'pointer',
        placeholder: 'list-wrapper placeholder',
        items: '.js-list',
        appendTo: '#trello-root',
      },
    );
  },

  refreshCalendarCardSortable() {
    return hookSortable(
      '.js-calendar-sortable',
      {
        scrollBoard: false,
        scrollLists: false,
      },
      {
        connectWith: '.js-calendar-sortable',
        placeholder: 'list-card placeholder-none',
        items:
          '.list-card:not(.placeholder-none, .hide, .js-composer), .js-draggable-calendar-check-item',
        helper: 'clone',
        appendTo: '#trello-root',

        over(e, ui) {
          return $(e.target).closest('.calendar-day').addClass('drop');
        },
        out(e, ui) {
          return $(e.target).closest('.calendar-day').removeClass('drop');
        },
      },
    );
  },

  refreshListCardSortable() {
    return hookSortable(
      '.js-sortable',
      {
        scrollBoard: true,
        scrollLists: true,
      },
      {
        connectWith: '.js-sortable:not(.card-limits-full)',
        placeholder: 'list-card placeholder',
        items: '.list-card:not(.placeholder, .hide, .js-composer)',
        appendTo: '#trello-root',
      },
    );
  },

  refreshDraggableSidebarMembers() {
    return hookDraggable(
      `.js-list-draggable-board-members \
.member:not(.js-member-deactivated)`,
      {
        scrollBoard: true,
        scrollLists: true,
      },
      {
        revert: 'invalid',
        revertDuration: 150,
        appendTo: '#trello-root',
        zIndex: 100,
        helper: 'clone',
        start(e, ui) {
          Analytics.sendUIEvent({
            action: 'dragged',
            actionSubject: 'member',
            source: 'boardScreen',
            containers: {
              board: {
                id: Controller.getCurrentBoardView().model.id,
              },
            },
          });

          // droppable.hoverClass in card.js is going to add an active class
          // so we don't want it to look like there are two active cards
          $('.list-card.active-card').removeClass('active-card');
        },
      },
    );
  },

  refreshDraggableStickers() {
    return hookDraggable(
      '.js-draggable-sticker:not(.disabled)',
      {
        scrollBoard: true,
        scrollLists: true,
      },
      {
        revert: 'invalid',
        revertDuration: 150,
        appendTo: '#trello-root',
        zIndex: 100,
        helper: 'clone',
        start(e, ui) {
          Analytics.sendUIEvent({
            action: 'dragged',
            actionSubject: 'sticker',
            source: 'boardScreen',
            containers: {
              board: {
                id: Controller.getCurrentBoardView().model.id,
              },
            },
          });
          const randomRotation = Math.random() * 20 - 10;
          ui.helper.find('.sticker-select-fixed').css({
            transform: `rotate(${randomRotation}deg)`,
            '-webkit-transform': `rotate(${randomRotation}deg)`,
          });
        },
      },
    );
  },

  refreshCardSortable($el, opts) {
    return hookSortable($el, { scrollCard: true }, opts);
  },

  abort() {
    if (currentDragInfo == null) {
      throw new Error('Abort called while not dragging!');
    }
    return currentDragInfo.abort();
  },

  refreshIfInitialized($el) {
    // The first drag after a card add fails in jQuery 2.0.0
    // see http://bugs.jquery.com/ticket/13907 and https://trello.com/c/Gul0vmVu
    // The presence of the ui-sortable class is our only real proxy for init'd
    if ($el != null ? $el.hasClass('ui-sortable') : undefined) {
      return $el.sortable('refresh');
    }
  },
};
