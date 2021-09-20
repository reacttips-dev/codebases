/* eslint-disable
    eqeqeq,
    no-redeclare,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Browser = require('@trello/browser');
const f = require('effing');
const Layout = require('app/scripts/views/lib/layout');
const PopOverReact = require('app/scripts/views/lib/pop-over-react');
const View = require('app/scripts/views/internal/view');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} = require('@trello/keybindings');
const { shouldHandleWindowsFrame } = require('@trello/desktop');
const { WindowSize } = require('app/scripts/lib/window-size');
const { ReactWrapper } = require('app/scripts/lib/react/backbone-view-wrapper');
const xtend = require('xtend');
const _ = require('underscore');
const {
  registerClickOutsideHandler,
  unregisterClickOutsideHandler,
  ELEVATION_ATTR,
  getElevation,
  getHighestVisibleElevation,
} = require('@trello/layer-manager');
const { featureFlagClient } = require('@trello/feature-flag-client');

const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

let HEADER_HEIGHT = 44;
const DESKTOP_OFFSET = 32;

if (shouldHandleWindowsFrame()) {
  HEADER_HEIGHT = HEADER_HEIGHT + DESKTOP_OFFSET;
}

module.exports.PopOver = new ((function () {
  let $body = undefined;
  let $po = undefined;
  let fnOnHide = undefined;
  const Cls = class {
    static initClass() {
      $body = null;
      $po = null;
      fnOnHide = null;
    }

    onShortcut(event) {
      this.popView();
      // we assume popovers are always the topmost item, so if we close them on Esc
      // it is safe to stop the event from bubbling, this was added specifically to
      // handle the case where a Power-Up has a modal up, and a popover is opened above it
      event.stopImmediatePropagation();
    }

    constructor() {
      this.onShortcut = this.onShortcut.bind(this);
      this.argsStack = [];
      this.position = {};
      this.isVisible = false;
      this.hardToClose = false;
      this.displayType = '';
    }

    init() {
      $body = $('body');
      $po = $('.pop-over');

      // Popover Events
      return (this.handleClickOutside = this.handleClickOutside.bind(this));
    }

    handleClickOutside(e) {
      // We aren't interested in this event if the popover is not visible
      if (!this.isVisible) {
        return;
      }

      // Determine whether the click outside was actually on one of the popover triggers,
      // in which case we should ignore it and let the trigger handle toggling
      const wasTriggerClick = this.argsStack.some(function (args) {
        // -- Specifically for filtering header experiment, to be removed at the end of the experiment --
        // Stopping propagation of outside click that lands on filter trigger button. When the filter view is
        // re-rendered by clicking on a button within the popover, the trigger button is no longer registered
        // in the above wasTriggerClick function.
        if (isInFilteringExperiment) {
          const filterButton = $('.js-header-filter-btn')[0];
          if (filterButton?.contains(e.target) && args.isFilterPopover) {
            return true;
          }
        }

        if (!args.elem) {
          return false;
        }
        const element = $(args.elem)[0];

        return element != null ? element.contains(e.target) : undefined;
      });

      if (wasTriggerClick) {
        return;
      }

      return this.hide();
    }

    contains(el) {
      return $.contains($po[0], el);
    }

    toggledBy(el) {
      return _.any(this.argsStack, (arg) => arg.elem === el);
    }

    // Make sure the popover is still visible when the window is resized
    onWindowResize() {
      if (!this.isVisible) {
        return;
      }

      return this.load(this.argsStack.pop());
    }

    getWindowHeight() {
      let windowHeight = $(window).height();
      if (shouldHandleWindowsFrame()) {
        windowHeight = windowHeight - 32;
      }
      return windowHeight;
    }

    resetTopWhenBeyondBottom(po_top, po_bottom, po_height) {
      let _po_top = po_top;
      const windowHeight = this.getWindowHeight();
      if (WindowSize.fLarge || WindowSize.fExtraLarge) {
        const s_height = windowHeight + $(window).scrollTop();
        if (po_bottom > s_height) {
          _po_top = s_height - po_height - 8;
        }
        if (po_height > s_height - HEADER_HEIGHT) {
          _po_top = HEADER_HEIGHT;
        }
      }

      return _po_top;
    }

    // Return the new position of the popover
    calcPos(args) {
      let el_left, el_top, top;
      const windowWidth = $(window).width();
      const windowHeight = this.getWindowHeight();

      if (args.maxWidth != null) {
        if (args.maxWidth > windowWidth) {
          $po.width(windowWidth - 16);
        } else {
          $po.width(args.maxWidth);
        }
      } else {
        $po.width('');
      }

      const max_right = windowWidth;
      const w_height = windowHeight;
      const po_width = $po.outerWidth();

      const elementIsVisible = args.elem != null && $(args.elem).is(':visible');

      if (elementIsVisible) {
        if (args.top != null) {
          ({ top } = args);
        } else if (args.elem != null) {
          // would be in a pretty bad state if this were false…
          top = $(args.elem).outerHeight() + 6;
        } else {
          top = 35; // an arbitrary default… could break w/o it.
        }

        if (args.alignRight) {
          el_left =
            $(args.elem).offset().left + $(args.elem).outerWidth() - po_width;
        } else {
          el_left = $(args.elem).offset().left;
        }
        el_top = $(args.elem).offset().top + top;

        // if desktop and windows account for the frame height
        if (shouldHandleWindowsFrame()) {
          el_top = el_top - 32;
        }
      } else if (args.clientx != null && args.clienty != null) {
        el_left = args.clientx;
        el_top = args.clienty;
      }

      // magic number alert! 68 is the height of the global header and a little
      // extra padding for the bottom. we don't want to pop over to overflow past
      // the bottom of the screen.
      let poMaxHeight = w_height - 68;
      if (!args.hideHeader) {
        poMaxHeight -= $po.find('.js-pop-over-header').outerHeight();
      }

      // if there is no hook element or it's hidden, don't bother try to position anything
      // prevents wacky jump when trying to change label names and some otherview pops.
      // if we are clicking the board to add a list (clientx, clienty), DO show the board
      if (
        !(args.clientx != null && args.clienty != null) &&
        (!elementIsVisible ||
          !_.include(
            [
              'block',
              'inline-block',
              'inline',
              'table-cell',
              'flex',
              'inline-flex',
            ],
            $(args != null ? args.elem : undefined).css('display'),
          ))
      ) {
        return;
      }

      // TOP

      // ensure that the top of the element is visible
      let po_top = el_top > 0 ? el_top : 5;

      // -- Specifically for filtering header experiment, to be removed at the end of the experiment--
      // Adjust height given that filter-view takes up entire screen height.
      const po_height =
        args.isFilterPopover && $po.outerHeight() > poMaxHeight
          ? $po.outerHeight() / 2.2
          : $po.outerHeight();

      let po_bottom = po_top + po_height;
      po_top = this.resetTopWhenBeyondBottom(po_top, po_bottom, po_height);

      // LEFT

      let po_left = el_left > 0 ? el_left : 5;
      const el_right = po_left + po_width + 16;

      // we want to ensure the right corner is on the screen
      if (el_right > max_right) {
        // move the element back onto the screen
        po_left = max_right - (po_width + 5);
      }

      // make sure the original args.elem is not overlaid
      if (args.elem) {
        let elemTop = $(args.elem).offset().top;
        if (shouldHandleWindowsFrame()) {
          elemTop = elemTop - DESKTOP_OFFSET;
        }

        if (
          po_top <= elemTop + $(args.elem).outerHeight() &&
          po_bottom >= elemTop
        ) {
          // reposition the popup above the target element
          po_top = elemTop - po_height - 6; // 6 is the same padding used above
          // ensure that the top of the popup is top above the screen
          if (po_top < HEADER_HEIGHT) {
            po_top = HEADER_HEIGHT;
            po_bottom = po_top + po_height;
          } else {
            po_bottom = po_top + po_height;
            po_top = this.resetTopWhenBeyondBottom(
              po_top,
              po_bottom,
              po_height,
            );
          }
        }
      }

      // -- Specifically for filtering header experiment, to be removed at the end of the experiment--
      // Continuation of specific height adjustments for filter
      return {
        left: po_left,
        top: po_top,
        contentHeight: args.isFilterPopover ? po_height : poMaxHeight,
      };
    }

    // Loads the supplied view into $po and sets all the applicable class fields
    load(args) {
      // We have to set PopOver.view. Hopefully some day we won't have to do this,
      // but for now the rest of the app assumes we're wont to do it.
      this.view = args.view;
      this.hardToClose = args.hardToClose;
      // Add special CSS classes for special types of popovers
      this.displayType = args.displayType;
      $po.addClass(this.displayType);

      //
      // React!
      //

      if (!React.isValidElement(args.reactElement)) {
        throw new Error('PopOver args.reactElement has to be a react element');
      }

      const children = (() => {
        if (__guard__(_.last(this.argsStack), (x) => x.keepInDOM)) {
          const oldChildren = _.chain(this.argsStack)
            .filter((args) => args.keepInDOM)
            .pluck('reactElement')
            .value();
          return oldChildren.concat(args.reactElement);
        } else {
          return [args.reactElement];
        }
      })();

      const { isFilterPopover, clearFilter } = args;

      const props = {
        key: 'PopOver',
        onBack: this.argsStack.length > 0 ? () => this.popView() : null,
        onClose: f(this, 'hide'),
        getViewTitle: args.getViewTitle,
        hasSafeViewTitle: args.hasSafeViewTitle,
        hideHeader: args.hideHeader,
        isFilterPopover,
        clearFilter,
      };

      this.por = ReactDOM.render(
        <PopOverReact {...props}>{children}</PopOverReact>,
        $po[0],
      );

      const show = () => {
        // Position the popover. We do this here because we need to render it first to calculate its position.
        let left;

        this.position =
          (left = this.calcPos(args)) != null ? left : this.position;

        $po.css({
          left: this.position.left,
          top: this.position.top,
        });

        $po.find('.js-pop-over-content').css({
          maxHeight: this.position.contentHeight,
        });

        $po.addClass('is-shown');
        return $po.trigger('is-shown');
      };

      if (args.showImmediately) {
        show();
      } else {
        _.defer(show);
      }

      return this.argsStack.push(args);
    }

    // We have legacy code that puts some properties on the view, but now we expect these properties on args.
    // If there are conflicts, args takes precedence.
    extractViewArgs(args) {
      // If there's a react element already, then it's using the new style
      if (args.reactElement != null) {
        return args;
      }

      // Sometimes we just get a view
      if (args.view == null) {
        args = { view: args };
      }

      // If you pass a view class, instantiate it here
      if (_.isFunction(args.view)) {
        args.view = new args.view(args.options != null ? args.options : {});
      }

      // Now we have the view, check that it's a backbone view
      if (!(args.view instanceof View)) {
        throw new Error('PopOver args.view has to be a backbone instance');
      }

      const extractViewFunction = function (view, name) {
        if (_.isFunction(view[name])) {
          return f(view, name);
        }
      };

      args.reactElement = <ReactWrapper key={args.view.cid} view={args.view} />;

      return xtend(
        {
          maxWidth: args.view.maxWidth,
          displayType: args.view.displayType,
          keepInDOM: args.view.keepInDOM,
          hideHeader: args.view.hideHeader,
          getViewTitle: extractViewFunction(args.view, 'getViewTitle'),
          hasSafeViewTitle: args.view.hasSafeViewTitle,
          willBePushedDown: extractViewFunction(args.view, 'willBePushedDown'),
          willBePopped: extractViewFunction(args.view, 'willBePopped'),
        },
        args,
      );
    }

    show(args) {
      // reset
      if (!args.keepEdits) {
        Layout.cancelEdits(args.elActive);
      }

      // Calculate the data-elevation attribute on the popover for interop with @trello/layer-manager
      // If we aren't positioning our popover relative to some element, just increment the highest
      // visible elevation. If we _are_ positioning relative to some element, increment its elevation
      // instead.
      // We want to calculate this _before_ reseting the popover to ensure that 'nested' Popovers that are shown
      // via a Popover.toggle() (NOT a pushView) continue to incement their elevation based on their anchoring
      // element (which may itself be inside a Popover)
      const targetDomNode = args.elem && $(args.elem)[0];
      const elevation = targetDomNode
        ? getElevation(targetDomNode) + 1
        : getHighestVisibleElevation() + 1;

      this.reset();

      // Add the elevation attribute as data-elevation
      $po.attr(ELEVATION_ATTR, elevation);

      this.load(this.extractViewArgs(args));

      _.defer(() => {
        if ($po.find('.js-autofocus').length > 0) {
          if (
            Browser.isTouch() &&
            $po.find('.js-autofocus:first').hasClass('js-no-touch-autofocus')
          ) {
            return;
          }
          return $po.find('.js-autofocus:first').focus().select();
        }
      });

      this.isVisible = true;
      if (typeof args.shown === 'function') {
        args.shown($po);
      }
      fnOnHide = args.hidden;

      this.positionInterval = setInterval(this.checkPosition.bind(this), 150);

      registerShortcut(this.onShortcut, {
        scope: Scope.Popover,
        key: Key.Escape,
      });

      // Register an 'outside click' handler that takes elevations into account
      registerClickOutsideHandler($po[0], this.handleClickOutside);

      // Adds an overlay on top of Power-Up iframes so that click events are captured
      // to ensure that Popovers are closed when clicking outside of the popover.
      $('.js-plugin-iframe-container').addClass(
        'plugin-iframe-container-pop-over-shown',
      );
    }

    // We don't really know what's going on in the popover; it might re-render and
    // get bigger than it is right now.  The simplest thing we can do is
    // periodically check and see if we've expanded beyond the bottom of the screen
    // and if so, move the popover up until everything is visible again
    // Also, they might have scrolled and made the popover go of the screen
    checkPosition() {
      if (!this.isVisible) {
        clearInterval(this.positionInterval);
        return;
      }

      const popoverTop = $po.offset().top;
      const windowScrollTop = $(window).scrollTop();
      if (popoverTop === windowScrollTop) {
        // We can't move the dialog up anymore; don't even bother
        return;
      }

      const windowHeight = this.getWindowHeight();
      const popoverHeight = $po.outerHeight();

      if (popoverTop < windowScrollTop && popoverHeight <= windowHeight) {
        // They've scrolled down, keep the popover in view
        $po.css({ top: windowScrollTop });
        return;
      }

      if (popoverTop + popoverHeight > windowScrollTop + windowHeight) {
        // The popover is extending beyond the bottom of the screen
        const newTop =
          windowScrollTop + Math.max(0, windowHeight - popoverHeight);
        if (newTop !== popoverTop) {
          return $po.css({
            top: newTop,
          });
        }
      }
    }

    pushView(args) {
      this.clearDisplayTypes();

      const oldArgs = _.last(this.argsStack);
      __guardMethod__(oldArgs, 'willBePushedDown', (o) => o.willBePushedDown());

      this.load(this.extractViewArgs(args));

      if ($po.find('.js-autofocus').length > 0) {
        if (
          Browser.isTouch() &&
          $po.find('.js-autofocus:first').hasClass('js-no-touch-autofocus')
        ) {
          return;
        }
        return setTimeout(() => {
          return $po.find('.js-autofocus:first').focus().select();
        }, 10);
      }
    }

    popView(depth = 1) {
      this.clearDisplayTypes();

      for (
        let i = 0, end = depth, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        const oldArgs = _.last(this.argsStack);
        __guardMethod__(oldArgs, 'willBePopped', (o) => o.willBePopped());
        __guard__(
          __guard__(
            oldArgs != null ? oldArgs.reactElement.props : undefined,
            (x1) => x1.view,
          ),
          (x) => x.remove(),
        );

        this.argsStack.pop();

        if (_.last(this.argsStack) == null) {
          this.hide();
          return;
        }
      }

      // reload view without rerendering so we don't lose any in-progress input
      const args = this.argsStack.pop();
      __guardMethod__(args, 'willBePushedUp', (o1) => o1.willBePushedUp());
      this.load(args);

      // wait to focus input because it stops the animation if we
      // focus while animating
      if ($po.find('.js-autofocus').length > 0) {
        if (
          Browser.isTouch() &&
          $po.find('.js-autofocus:first').hasClass('js-no-touch-autofocus')
        ) {
          return;
        }
        return setTimeout(() => {
          return $po.find('.js-autofocus:first').focus().select();
        }, 10);
      }
    }

    toggle(args) {
      // We want to hide when we're triggered on the same element. However,
      // the elem argument can either be a jQuery selection or a normal DOM
      // element, so we normalize here.
      const isSameElement = (e1, e2) => e1 && e2 && $(e1)[0] === $(e2)[0];

      if (
        _.last(this.argsStack) &&
        isSameElement(_.last(this.argsStack).elem, args.elem)
      ) {
        return this.hide();
      } else {
        return this.show(args);
      }
    }

    hide() {
      clearInterval(this.positionInterval);

      $po.removeClass('is-shown');

      const lastArgStack = _.last(this.argsStack);

      $body.trigger('popover-hide', {
        elem: lastArgStack != null ? lastArgStack.elem : undefined,
      });

      this.reset();

      if ($po != null ? $po[0] : undefined) {
        ReactDOM.unmountComponentAtNode($po[0]);
      }

      if ((lastArgStack != null ? lastArgStack.onClose : undefined) != null) {
        lastArgStack.onClose();
      }

      // Removes the overlay on top of Power-Up iframes so that they are clickable again.
      return $('.js-plugin-iframe-container').removeClass(
        'plugin-iframe-container-pop-over-shown',
      );
    }

    reset() {
      this.clearDisplayTypes();

      for (let i = this.argsStack.length - 1; i >= 0; i--) {
        const args = this.argsStack[i];
        if (typeof args.willBePopped === 'function') {
          args.willBePopped();
        }
        __guard__(
          args.reactElement.props != null
            ? args.reactElement.props.view
            : undefined,
          (x) => x.remove(),
        );
      }

      unregisterShortcut(this.onShortcut);
      $po.removeAttr(ELEVATION_ATTR);
      unregisterClickOutsideHandler($po[0], this.handleClickOutside);

      // Other views reference PopOver.view.
      this.view = null;

      this.argsStack = [];
      this.isVisible = false;
      this.hardToClose = false;
      this.por = null;
      if (typeof fnOnHide === 'function') {
        fnOnHide($po);
      }

      return (fnOnHide = null);
    }

    clearDisplayTypes() {
      const classes = [
        'mod-mini-profile',
        'mod-avdetail',
        'mod-search-over',
        'mod-no-header',
        'mod-reaction-selector',
        this.displayType,
      ];
      return $po.removeClass(classes.join(' '));
    }

    clearStack() {
      return (this.argsStack = []);
    }
  };
  Cls.initClass();
  return Cls;
})())();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
