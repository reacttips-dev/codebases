import $ from 'jquery';
import LucidJS from 'js/vendor/lucid.v2-7-0';
import _ from 'lodash';
import DataAttributes from 'js/lib/data.attributes';

/** Modals

We use modals wherever we want a lightbox of content to appear above everything else on the page.
Our modals library is flexible in that it doesn't provide any particular header or close button by
default, and leaves it up to the developer to define. It does make it easy to specify which parts
of a modal closes it, however.

Let's look at example of a modal from the course dashboard.
Here's how it's declared in the template (courseList.js.jade):
  div.modal.coursera-profile-modal-unenroll-survey.hide(data-modal-overlay-class='coursera-overlay-dark')
     div.modal-body
        p
          | We'd love to learn more about your
          | decision to un-enroll to help us improve our offering in the future.
          | Would you mind answering a few quick questions?
      div.modal-footer
        a.btn.btn-success(href='') Sure!
        span.btn(data-modal-close) No, thanks

Here's how we open it from the view:
Modal(this.$('.coursera-profile-modal-unenroll-survey')).open();

There are a few things to note:
- It specifies the Bootstrap provided 'hide' class to make sure the modal starts off hidden.
- It uses the Bootstrap provided modal classes to inherit that styling - modal, modal-body, modal-footer
- It uses the data-modal-overlay-class to specify a CSS class for a dark background
- It specifies data-modal-close on the 'No' button, to make the modal close upon clicking that

It's also possible to trigger the opening of a modal purely in HTML. For example, this link from the
course session listing triggers the opening of a modal with the class name 'coursera-course-selfstudy-modal':
  a(data-modal='.coursera-course-selfstudy-modal', role='button', title='What is self study?') ?

It's not actually necessary to use the Bootstrap modal classes, if you want a more minimal lightbox
or custom styling, which is the approach we take for the lecture viewing modal.
*/
var CLOSED = 0;
var OPEN = 1;

var _private = {
  defaults: {
    autofocus: true,
    'bind.open': 'click',
    'bind.close': 'click',
    'bind.action': 'click',
    'attribute.open': 'data-modal',
    'attribute.close': 'data-modal-close',
    'attribute.iframe': 'data-modal-iframe',
    'attribute.action': 'data-modal-action',
    'attribute.focus': 'data-modal-focus',
    'attribute.focus.index': 10000,
    'animate.modal.open': null,
    'animate.modal.close': null,
    'animate.modal.duration': 250,
    'animate.overlay.open': null,
    'animate.overlay.close': null,
    'animate.overlay.duration': 250,
    'overlay.show': true,
    'overlay.class': 'overlay',
    'overlay.close': true,
    'z.index': 9999,
    'position.top': '50%',
    'position.left': '50%',
    position: 'fixed',
    'iframe.autoclose': true,
  },

  $overlay: null,
  count: 0,
  prevScroll: null,
  prevModal: null,

  getModal: function (el, options) {
    var modal = $(el).data('modal.me');

    if (modal && modal.constructor == Modal.prototype.constructor) {
      if (options) return modal.customize(options);
      else return modal;
    } else {
      return null;
    }
  },

  makeModal: function (el, options) {
    var $el = $(el);
    var modal = _private.getModal($el);

    // if popup hasn't been created, make one!
    if (!modal) {
      modal = new Modal($el, options);
      $el.data('modal.me', modal);
    }

    return modal;
  },

  setOverlayHeight: function () {
    if ($(window).height() < $(document).height())
      _private.$overlay.css({
        height: $(document).height() + 'px',
      });
    else
      _private.$overlay.css({
        height: '100%',
      });
  },

  observeKeyPress: function (e) {
    if (this.options['overlay.close']) {
      if (e.keyCode == 27 || (e.DOM_VK_ESCAPE == 27 && e.which === 0)) {
        this.emitter.trigger('action', false, this);
        this.close();
      }
    }

    this.emitter.trigger('key', e);
  },

  // Watch for 'Tab' keydown events.
  // If they attempt to tab off the modal, teleport tab to top element of modal
  cycleTabs: function (e) {
    var $tabbable = this.$el.find('a,input,select,textarea,button').filter(':visible');
    if (e.keyCode == 9 && $(e.target).is($tabbable.last())) {
      window.setTimeout(function () {
        $tabbable.first().focus();
      }, 0);
    }
  },

  actionTrigger: function (e) {
    var $el = $(e.currentTarget);
    var action = $el.attr(this.options['attribute.action']);

    this.emitter.trigger('action', action, this);
  },

  open: function () {
    if (this.options['position'] != 'fixed') {
      _private.prevScroll = {
        top: $(document).scrollTop(),
        left: $(document).scrollLeft(),
      };
      window.scrollTo(0, 0);
    }

    // if we added or initialized an iframe, let's give focus to it
    if (this.$iframe) {
      var iframeUrl = this.options['iframe.url'] || $(this.anchor).attr(this.options['attribute.iframe']);
      this.$iframe.attr('src', iframeUrl);
      this.$iframe.focus();
    } else {
      // Not all focusable elements are visible at this time but we still want to set tabindex
      // to all of them. This is fine since hidden items won't be 'tabable'
      var $focus = this.$el.find('[' + this.options['attribute.focus'] + ']');
      var $focusable_elements = this.$el.find('a,input,select,textarea,button');
      for (var i = 0; i < $focusable_elements.length; i++) {
        $focusable_elements.eq(i).attr('tabindex', this.options['attribute.focus.index'] + 1 + i);
      }
      // But we only want to set focus to those elements that are visible
      if (this.options['autofocus']) {
        if ($focus.size() > 0) {
          $focus.filter(':visible').eq(0).attr('tabindex', this.options['attribute.focus.index']);
          $focus.filter(':visible').eq(0).focus();
        } else if ($focusable_elements.size() > 0) {
          $focusable_elements.filter(':visible').eq(0).attr('tabindex', this.options['attribute.focus.index']);
          $focusable_elements.filter(':visible').eq(0).focus();
        }
      }
    }

    this.state = OPEN;

    // allow user to specify simple actions within modal
    this.$el.on(
      this.options['bind.action'],
      '[' + this.options['attribute.action'] + ']',
      _.bind(_private.actionTrigger, this)
    );
    this.emitter.trigger('open');
  },

  close: function () {
    var $iframe = this.$el.find('iframe');

    this.$el.off('.modal').hide();

    if (this.options['iframe.autoclose'] && $iframe.size()) {
      $iframe.attr({
        src: 'about:blank',
      });
    }

    if (_private.prevScroll) {
      window.scrollTo(_private.prevScroll.left, _private.prevScroll.top);
      _private.prevScroll = null;
    }

    this.anchor = null;
    this.$parent.append(this.$el);
    this.state = CLOSED;
    this.emitter.trigger('close');
  },
};

var Modal = function (el, settings) {
  var that = this;

  // close out any previous modal created on this object
  this.$el = $(el);
  this.state = CLOSED;
  this.$parent = this.$el.parent();
  this.customize(settings);
  this.emitter = LucidJS.emitter(this);
};

Modal.prototype.customize = function (settings) {
  this.options = _.extend({}, DataAttributes.parse(this.$el, _private.defaults, 'data-modal-'), settings);
  return this;
};

Modal.prototype.open = function () {
  var that = this;

  var iframeUrl;

  if (this.anchor) {
    iframeUrl = $(this.anchor).attr(this.options['attribute.iframe']);
  }

  if (this.options['iframe.url']) iframeUrl = this.options['iframe.url'];

  // if anchor is coming from a link and there is an iframe
  // that is the signal to load up the link in the iframed modal
  if (iframeUrl) {
    this.$iframe = this.$el.find('iframe');
    if (/^https?:\/\/|^\/|^\.\.\//.test(iframeUrl)) {
      if (!this.$iframe.size() || this.$iframe.attr('src') != iframeUrl) {
        // if there is no iframe in the modal
        // but there is an iframe attribute
        // then lets just make one!
        this.$iframe.attr('src', 'about:blank').remove();
        this.$iframe = $('<iframe>')
          .css({
            height: '100%',
            width: '100%',
          })
          .attr({
            scrolling: 'no',
            frameborder: 0,
          });
        this.$el.append(this.$iframe);
        if (this.state != CLOSED) {
          this.$iframe.attr('src', iframeUrl);
        }
      }
    }
  }

  // do we even need to open?
  if (this.state != CLOSED) {
    return;
  }

  if (this.options['overlay.show']) {
    if (
      _private.$overlay &&
      _private.$overlay.css('display') != 'none' &&
      _private.$overlay.hasClass(this.options['overlay.class'])
    ) {
      this.$overlay = _private.$overlay;
    } else {
      if (_private.$overlay) _private.$overlay.off('.modal').hide().remove();

      this.$overlay = _private.$overlay = $('<div>').addClass(this.options['overlay.class']).hide();
      this.$overlay.css({
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: this.options['z.index']++,
      });
      $('body').append(this.$overlay);
    }

    _private.setOverlayHeight();
    this.reposition();

    if (this.options['animate.overlay.open']) {
      this.$overlay.animate(this.options['animate.overlay.open'], {
        duration: this.options['animate.overlay.duration'],
      });
    } else {
      this.$overlay.show();
    }

    _private.count++;
    this.$overlay.data('modal', this);
  }

  this.emitter.trigger('opening');

  // if $el is not in the page or it is absolute then we want it to append it to the body
  // this allows us to delegate events in views where modals exists (if we stick with doing fixed positioning modals)
  if (this.options['position'] != 'fixed' || this.$el.closest('html').length === 0) this.$el.appendTo('body');

  this.reposition();
  this.$el.show();

  if (this.options['animate.modal.open']) {
    this.$el.animate(this.options['animate.modal.open'], {
      duration: this.options['animate.modal.duration'],
      complete: function () {
        _private.open.call(that);
      },
    });
  } else {
    _private.open.call(this);
  }

  $(window)
    .on('resize.modal', _.bind(_private.setOverlayHeight, that))
    .on('resize.modal', _.bind(that.reposition, that))
    .on('scroll.modal', _.bind(that.reposition, that));

  // Listen to all key actions on the Modal. Specifically, tabs.
  this.$el.on('keydown.modal', _.bind(_private.cycleTabs, that));

  $(window).on('keyup.modal', _.bind(_private.observeKeyPress, that));

  if (this.options['overlay.close']) {
    this.$overlay.on(this.options['bind.close'] + '.modal', function (e) {
      that.emitter.trigger('action', false, that);
      that.close();
    });
  }

  if (this.options['attribute.close']) {
    this.$el.on(this.options['bind.close'] + '.modal', '[' + this.options['attribute.close'] + ']', function (e) {
      var $target = $(e.currentTarget);

      if ($target.attr('disabled') != 'disabled') {
        if ($target.attr(that.options['attribute.action']) === undefined) that.emitter.trigger('action', false, that);

        that.close();
      }
    });
  }
  return this;
};

Modal.prototype.reposition = function () {
  var left = this.options['position.left'];
  var top = this.options['position.top'];

  if (left) {
    // reset CSS so width is re-calculated for margin-left CSS
    this.$el.css({
      position: this.options['position'],
      left: left,
      marginLeft: /%/.test(left) ? (this.$el.outerWidth() / 2) * -1 : 0,
      zIndex: this.options['z.index']++,
    });
  }

  if (top) {
    this.$el.css({
      position: this.options['position'],
      top: top,
      marginTop: /%/.test(top) ? (this.$el.outerHeight() / 2) * -1 : 0,
      zIndex: this.options['z.index']++,
    });
  }

  return this;
};

Modal.prototype.close = function () {
  var that = this;

  // do we even need to close?
  if (this.state != OPEN) return;
  if (this.trigger('closeRequest') === false) return;

  this.$el.off('.modal');
  $(window).off('.modal');

  this.emitter.trigger('closing');

  if (this.options['animate.modal.close']) {
    this.$el.animate(this.options['animate.modal.close'], {
      duration: this.options['animate.modal.duration'],
      complete: function () {
        _private.close.call(that);
      },
    });
  } else {
    _private.close.call(this);
  }

  if (--_private.count === 0) {
    if (this.options['overlay.show'] && this.$overlay) {
      this.$overlay.off('.modal');
      if (this.options['animate.overlay.close']) {
        this.$overlay.animate(this.options['animate.overlay.close'], {
          duration: this.options['animate.overlay.duration'],
          complete: function () {
            this.$overlay.hide().remove();
          },
        });
      } else {
        this.$overlay.hide().remove();
      }
    }
  }

  return this;
};

var external = function () {
  return _private.getModal.apply(null, arguments) || _private.makeModal.apply(this, arguments);
};

external.start = function (view, _options) {
  var $view = $(view);
  var options = _.extend({}, _private.defaults, _options);

  // Avoid adding multiple listeners on the same view.
  if ($view.data('modals-initialized')) {
    return;
  } else {
    $view.data('modals-initialized', 1);
  }

  $view.on(options['bind.open'] + '.modal', '[' + options['attribute.open'] + ']', function (e) {
    var $anchor = $(this);
    var selector = $anchor.attr(options['attribute.open']);
    var $modal = $view.find(selector);

    options = _.extend({}, options, DataAttributes.parse($modal, _private.defaults, 'data-modal-'));
    var modal = _private.getModal($modal, options) || _private.makeModal($modal, options);

    // if there is an href, we should allow users to open the link in a new tab...
    if (/^https?:\/\/|^\/|^\.\.\//.test($anchor.attr('href')) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }

    modal.anchor = this; // save reference to anchor that triggered the modal
    _private.prevModal = $modal[0];
    modal.open();
  });
};

external.stop = function (view) {
  var $view = $(view);

  $view.unbind('.modal');
  $view.data('modals-initialized', 0);

  if (_private.prevModal) Modal(_private.prevModal).close();
};

// kick it off!
external.start('body');

export default external;
