/**

Please follow the recommended usage for optimal accessibility.

An example anchor, with proper ARIA attributes and explanation:

<li class='course-topbar-nav-list-item'
    tabindex='0' role='button' aria-haspopup='true' aria-expanded='false' aria-owns='course-topbar-aboutus'
    data-popup='#course-topbar-aboutus' data-popup-bind-open='mouseenter' data-popup-direction='se' data-popup-close style='cursor:pointer;'>
    <a>About <i class='icon-caret-down'></i></a>
</li>

• The link will appear as a menu button to a screen reader due to the button role and
the aria-haspopup attribute, and the screen readers will announce that the menu can be
expanded by pressing the space bar.
• The expanded state of the dropdown is conveyed to the screen reader through
the aria-expanded attribute. The value of this attribute is dynamically set
to 'true' or 'false' depending on whether the dropdown is currently expanded or
collapsed. If you set it to false in the HTML to begin with, then it will start off as closed. If
you set it to true to begin with, it will start open and close after 3 seconds.
• The aria-owns attribute is used to create a relationship between the link and the
dropdown list. The value should be the ID attribute of the dropdown's popup.

Its associated popup: 
<div id='course-topbar-aboutus' class='course-topbar-sublist'>
    <a class='course-topbar-sublist-item' href='https://www.coursera.org/about/careers' target='_new'>Careers</a>
    <a class='course-topbar-sublist-item' href='https://www.coursera.org/about/contact' target='_new'>Contact Us</a>
    <a class='course-topbar-sublist-item' href='https://www.coursera.org/about/' target='_new'>About Us</a>
</div>
*/

import DataAttributes from 'js/lib/data.attributes';
import $ from 'jquery';
import LucidJS from 'js/vendor/lucid.v2-7-0';
import _ from 'lodash';

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const SPACE_BAR = 32;
const ESCAPE = 27;
const ENTER = 13;
const OPENED = 1;
const CLOSED = 0;

var _private = {
  defaults: {
    'bind.open': 'click',
    'bind.close': 'click',
    'bind.cancel.document': 'mousemove',
    'bind.cancel': 'mouseleave',
    'bind.uncancel': 'mouseenter',
    'bind.keydown': 'keydown',
    direction: 'sw',
    'offset.x': 0,
    'offset.y': 0,
    timeout: 450,
    'timeout.intent': 350,
    resize: false, // if true, matches popup to anchor width
    width: false, // if truthy, set the popup's css width to this
    'attribute.open': 'data-popup',
    'attribute.close': 'data-popup-close',
    'attribute.item': 'data-popup-item',
    position: 'absolute',
  },

  prevPopup: null,
  prevTimeout: null,
  timeout: null,
  timeoutClear: null,

  getPopup(el, options) {
    const pop = $(el).data('popup.me');

    if (pop && pop.constructor == Popup.prototype.constructor) {
      if (options) return pop.customize(options);
      else return pop;
    } else {
      return null;
    }
  },

  getPopupForAnchor($anchor, options) {
    const selector = $anchor.attr(_private.defaults['attribute.open']);
    const $pop = $(selector);
    const pop = _private.makePopup($pop, options);
    return pop;
  },

  closeOlderPopups() {
    if (_private.prevPopup) {
      _private.prevPopup.close();
      _private.prevPopup = null;
    }
  },

  isTouch: 'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch),

  makePopup(el, settings) {
    const $el = $(el);
    let pop;

    if ($el.attr('data-popup')) {
      pop = _private.getPopupForAnchor($el);
    } else {
      pop = _private.getPopup($el);
    }

    // $el should be the popup
    if (!pop) {
      pop = new Popup($el, settings);
      $el.data('popup.me', pop);
    }

    return pop;
  },

  monitorKeys(e) {
    if (_.includes([UP_ARROW, DOWN_ARROW], e.keyCode)) {
      e.preventDefault();
      e.stopPropagation();
      _private.changeFocus.call(this, e);
    } else if (e.keyCode == ESCAPE) {
      // Return focus to the original link, required for accessibility
      this.$anchor.focus();
      this.close();
    } else if (e.keyCode == ENTER) {
      this.emitter.trigger('enter', this);
    }
  },

  monitorActions(e) {
    const $target = $(e.target);
    const that = this;

    if (e.type != 'mouseleave') {
      if ($target.closest(this.$el).size() > 0 || $target.closest(this.$anchor).size() > 0) {
        window.clearTimeout(_private.timeout);
      }
    } else {
      _private.timeout = window.setTimeout(function () {
        if (that.state == OPENED) that.close();
      }, this.options.timeout);
    }
  },

  // when opening popups on hover, we want to ensure the
  // user has the intent to open the menu, rather than just mousing over to something else
  // we determine this if the user's mouse can still be found on the anchor at 'timeout.intent' milleseconds later
  intentOpen(e, popup, $anchor) {
    const anchor = $anchor[0];

    // if a previous intent was registered, cancel it, because a new intent is needed
    if (_private.prevTimeout) {
      $(document).off('.popup');
      window.clearTimeout(_private.prevTimeout);
    }

    // checkback in 'timeout.intent' milleseconds later. if this timeout hasn't been cancelled,
    // open the popup if it isn't already open
    _private.prevTimeout = window.setTimeout(function () {
      window.clearTimeout(_private.prevTimeout);
      $(document).off('.popup');

      if (!popup.isOpen()) {
        popup.open($anchor);
      }
    }, popup.options['timeout.intent']);

    // if mousemove or mouseleave is detected, check to see if we have left the $anchor
    $(document).on('mousemove.popup mouseleave.popup', function (e) {
      // if mouse leaves document or moves not on popup, intent is called off
      if (e.type == 'mouseleave' || (e.target != anchor && $(e.target).closest(anchor).size() === 0)) {
        // if we have left the $anchor, cancel the intent
        $(document).off('.popup');
        window.clearTimeout(_private.prevTimeout);
      }
    });
  },

  changeFocus(e) {
    if (!this.$anchor) return;
    const itemSelector = this.$anchor.attr(this.options['attribute.item']); // optional item filter
    let $items = this.$el.children(':visible'); // filter by visible items

    if (itemSelector) {
      // if filter provided, do it, else, visible children will do
      $items = $items.find(itemSelector);
    }

    if (!$items.length) return;

    let index = $items.index($items.filter(':focus'));

    if (e.keyCode == UP_ARROW) index--; // up

    if (e.keyCode == DOWN_ARROW) index++; // down

    if (index < 0 || index >= $items.length) this.$anchor.focus();
    else if (index < $items.length) $items.eq(index).focus();
  },
};

var Popup = function (el, settings) {
  this.$el = $(el);
  this.$parent = this.$el.parent();
  this.$anchor = null;
  this.emitter = LucidJS.emitter(this);
  this.customize(settings);
};

Popup.prototype.customize = function (settings) {
  this.options = _.extend({}, DataAttributes.parse(this.$el, _private.defaults, 'data-popup-'), settings);
  return this;
};

Popup.prototype.get = function () {
  return this.$el;
};

Popup.prototype.open = function (anchor) {
  // don't open if popup is already open!
  if (this.state == OPENED) return;

  const that = this;
  const $anchor = $(anchor);

  if (!this.$anchor || this.$anchor[0] != $anchor[0]) {
    const position = $anchor.position();

    // allow new anchor to override popup settings
    this.options = DataAttributes.parse($anchor, this.options, 'data-popup-');

    // append it to the parent of the anchor for proper positioning
    this.$anchor = $anchor;
    this.$anchor.parent().append(this.$el); // trying to preserve data
    this.$anchor.attr('aria-expanded', 'true');
    if (that.options.resize) this.$el.width(this.$anchor.outerWidth());
    if (that.options.width) this.$el.css('width', that.options.width);

    this.emitter.trigger('opening', this.$anchor);
    const offset = {
      x: parseInt(this.options['offset.x'], 10),
      y: parseInt(this.options['offset.y'], 10),
    };

    // run calculations after making sure this is absolute to prevent divs from taking full width
    this.$el.css({
      position: this.options.position,
    });

    if (!this.options.direction || this.options.direction == 'sw') {
      this.move(position.left + offset.x, position.top + $anchor.outerHeight() + offset.y);
    } else if (this.options.direction == 'nw') {
      this.move(position.left + offset.x, position.top - this.$el.outerHeight() + offset.y);
    } else if (this.options.direction == 'se') {
      this.move(
        position.left + $anchor.outerWidth() + offset.x - this.$el.outerWidth(),
        position.top + $anchor.outerHeight() + offset.y
      );
    } else if (this.options.direction == 'ne') {
      this.move(
        position.left + $anchor.outerWidth() + offset.x - this.$el.outerWidth(),
        position.top - this.$el.outerHeight() - offset.y
      );
    } else if (this.options.direction == 's') {
      this.move(
        position.left + $anchor.outerWidth() / 2 + offset.x - this.$el.outerWidth() / 2,
        position.top + $anchor.outerHeight() + offset.y
      );
    } else if (this.options.direction == 'n') {
      this.move(
        position.left + $anchor.outerWidth() / 2 + offset.x - this.$el.outerWidth() / 2,
        position.top - this.$el.outerHeight() + offset.y
      );
    } else if (this.options.direction == 'w') {
      this.move(position.left + offset.x - this.$el.outerWidth(), position.top + offset.y);
    } else if (this.options.direction == 'e') {
      const xOffset = position.left + $anchor.outerWidth() + offset.x;
      this.move(xOffset, position.top + offset.y);
      this.$el.css({
        marginRight: -1 * xOffset,
      });
    }

    that.$el.addClass('popup-open').show();

    window.setTimeout(function () {
      _private.closeOlderPopups();
      $anchor.addClass('popup-opened');

      // prevent from triggering anchor focus if it already has focus
      if (!$anchor.is(':focus')) $anchor.focus();

      that.emitter.trigger('opened', that.$anchor);
      that.state = OPENED;
      _private.prevPopup = that;

      // mouse could move off the document, so these events help catch those edge cases
      // such as when a popup is ontop of an iframe
      if (that.options['bind.cancel']) {
        that.$el.on(that.options['bind.cancel'] + '.popup', _.bind(_private.monitorActions, that));
        that.$anchor.on(that.options['bind.cancel'] + '.popup', _.bind(_private.monitorActions, that));
        that.$el.on(that.options['bind.uncancel'] + '.popup', _.bind(_private.monitorActions, that));
        that.$anchor.on(that.options['bind.uncancel'] + '.popup', _.bind(_private.monitorActions, that));
      }

      $(document)
        .on(that.options['bind.cancel.document'] + '.popup', _.bind(_private.monitorActions, that))
        .on(that.options['bind.keydown'] + '.popup', _.bind(_private.monitorKeys, that));

      if (that.options['attribute.close']) {
        const closePopup = function (e) {
          if (!$(e.currentTarget).is(':disabled')) {
            that.close();
          }
        };
        const closeSelector = '[' + that.options['attribute.close'] + ']';
        that.$el.on(that.options['bind.close'] + '.popup', closeSelector, closePopup);
        if (that.$anchor.is(closeSelector)) {
          that.$anchor.on(that.options['bind.close'] + '.popup', closePopup);
        } else {
          that.$anchor.on(that.options['bind.close'] + '.popup', closeSelector, closePopup);
        }
      }
    }, 0);
  }
  return this;
};

Popup.prototype.move = function (x, y, z) {
  this.$el.css({
    left: x,
    top: y,
    'z-index': z || 10000,
  });
  return this;
};

Popup.prototype.close = function () {
  $(document).off('.popup');

  this.$anchor.attr('aria-expanded', 'false');
  this.$anchor.removeClass('popup-opened');
  this.$el.removeClass('popup-open');
  this.emitter.trigger('closing', this.$anchor);
  this.$el.off('.popup').hide();
  this.$anchor.off('.popup');
  this.$parent.append(this.$el);
  this.emitter.trigger('closed', this.$anchor);
  this.$anchor = null;
  this.state = CLOSED;
  window.clearTimeout(this.timeout);
  _private.prevPopup = null;
  return this;
};

Popup.prototype.isOpen = function () {
  return this.$el.is(':visible');
};

const external = function () {
  return _private.getPopup.apply(null, arguments) || _private.makePopup.apply(this, arguments);
};

external.start = function (view, options) {
  const $view = $(view);

  // Avoid adding multiple listeners on the same view.
  if ($view.attr('data-popups-initialized')) {
    return;
  } else {
    $view.attr('data-popups-initialized', true);
  }

  function openPopup(pop, $anchor) {
    if (!pop.isOpen()) {
      pop.open($anchor);
    }
  }

  // TODO handle touch events since click has a 300ms delay
  const selector = '[' + _private.defaults['attribute.open'] + ']';
  $view.on('click.popup mouseenter.popup keydown.popup', selector, function (e) {
    const $anchor = $(this);
    const bind = $anchor.attr('data-popup-bind-open');

    if ($anchor.is(':disabled')) return;

    const pop = _private.getPopupForAnchor($anchor, options);

    // Screen readers expect for a menu to be openable via the space bar
    // Other users might expect to use the up/down arrows
    if (e.type == 'keydown' && _.includes([UP_ARROW, DOWN_ARROW, SPACE_BAR], e.keyCode)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.keyCode == DOWN_ARROW || e.keyCode == SPACE_BAR) {
        if (!pop.isOpen()) {
          openPopup(pop, $anchor);
        }
        _private.changeFocus.call(pop, e);
      } else if (e.keyCode == UP_ARROW && pop.isOpen()) {
        pop.close();
      }
    }

    // if e.type is not click but we are a touchDevice, just force it, since mouseover will never happen
    if (e.type == bind || (!bind && e.type == 'click') || (_private.isTouch && e.type == 'click')) {
      if (e.type == 'mouseover' || e.type == 'mouseenter') {
        _private.intentOpen(e, pop, $anchor);
      } else {
        openPopup(pop, $anchor);
      }
    }
  });

  // If the popup starts off as expanded, then we should open the popup
  $($view.find('[' + _private.defaults['attribute.open'] + ']')).each(function () {
    const $elem = $(this);
    if ($elem.attr('aria-expanded') == 'true') {
      const pop = _private.getPopupForAnchor($elem, options);
      openPopup(pop, $elem);
      window.setTimeout(function () {
        pop.close($elem);
      }, 3000);
    }
  });
};

external.cleanUp = function () {
  _private.closeOlderPopups();
};

external.stop = function (view) {
  const $view = $(view);
  $view.attr('data-popups-initialized', false);
  $view.off('.popup');
  external.cleanUp();
};

// kick it off!
external.start('body');
export default external;
