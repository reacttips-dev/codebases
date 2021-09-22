import SSView from 'core/src/views/base/ss-view';
import PopoverTemplate from 'text!core/src/templates/popovers/popover-content.mustache';
import Utils from 'core/src/base/utils';
import Common from 'core/src/common';

const PopoverView = SSView.extend({

  className: 'popover',
  placement: 'bottom',
  // We use a visible el as a way to actually show the popover
  // This will become a clone of our popover content after render and when opened.
  // We want our el at the level of the body so that we have absolute
  // positioning power without reliance on parent or other relative elements on the page
  visibleEl: null,
  // We can ovverride this option if ever need to manually pixel push. E.g. the header
  autoPosition: true,
  // Popovers are triggered on click by default, but override this to do so on hover instead
  showOnHover: false,
  // Whether the endpoint data is currently being retrieved
  populating: false,
  // The color of the popover. By default the popover is light, other options include dark
  color: null,
  // The size of the popover, options include small
  size: null,
  // Whether or not this popover has been destroyed
  destroyed: false,
  // Constants
  HOVER_OPEN_DELAY: 100,
  HOVER_CLOSE_DELAY: 100,

  /*
     * Override constructor so we can concatenate classNames that are passed through options
     */
  constructor: function(options) {
    if (options.className) {
      options.className += ' ' + this.className;
    }
    SSView.prototype.constructor.apply(this, arguments);
  },

  // anchor: the button that will be clicked to open the popover, required
  // container: where the popover will be appended
  // placement: on which side the popover will be positioned (bottom, top, left or right)
  // arrowPlacement: the position of the arrow on the side of the popover (bottom, top, left or right)
  initialize: function(options = {}) {
    _.bindAll(
      this, 'onAnchorClick', 'onBodyClick', 'onEnterAnchor', 'onLeaveAnchor',
      'onEnterPopover', 'onLeavePopover', 'open', 'onClickClose', 'setShowOnHover'
    );

    // Populate this with options
    _.extend(this, _.pick(options, ['anchor', 'target', 'size', 'placement', 'arrowPlacement',
      'autoPosition', 'addShadow', 'showOnHover', 'endpoint', 'endpointData',
      'HOVER_OPEN_DELAY', 'HOVER_CLOSE_DELAY',
    ]));

    // Bind relevant event to show/hide the popover
    if (!this.showOnHover) {
      // On click
      // Bind the anchor button to open and close the popover on click
      this.anchor.on('click', this.onAnchorClick);
    } else {
      // On enter/leave anchor
      this.anchor.on('mouseenter', this.onEnterAnchor);
      this.anchor.on('mouseleave', this.onLeaveAnchor);
    }

    // Add a class to the anchor to know that it has been initialized
    this.anchor.addClass('initialized');

    // Allow for us to specify the placement via markup
    const placement = this.anchor.data('placement');
    if (placement) {
      this.placement = placement;
    }

    const size = this.anchor.data('size');
    if (size) {
      this.size = size;
    }

    const color = this.anchor.data('color');
    if (color) {
      this.color = color;
    }

    // For popovers, autoRender must be set to true, and should not be overridden.
    this.autoRender = true;

    // This might call render if autoRender is set to true(default)
    SSView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    // If we're getting content from endpoint, make sure the template is set before we call super
    // Super takes care of actually rendering the template
    if (this.endpoint) {
      this.template = PopoverTemplate;
    }

    if (!this.destroyed) {
      SSView.prototype.render.apply(this, arguments);

      if (this.addShadow) {
        this.$el.addClass('shadow');
      }

      this.contentEl = this.$('.content');
      this.arrowEl = this.$('.arrow');

      // Setup popover positioning
      this.$el.addClass(this.placement);
      this.$el.addClass(this.size);
      this.$el.addClass(this.color);
      this.arrowEl.addClass(this.arrowPlacement);
    }
  },

  open: function() {
    // See if we need to populate from the content of the popover from endpoint (passed in)
    if (this.endpoint) {
      this.populateFromEndpoint();
    }
    // Always make the popover visible straight away, regardless of the content within
    this.makeVisible();
  },

  makeVisible: function() {
    if (this.autoPosition) {
      // By default, popovers sit absolute on the page (autoPosition)
      // This being the case, we need to create a (cloned) visible version of the popover.
      // We also only want to create one if one doesn't currently exist
      // This check has to occur here because we do allow creation as part of an immediate update call
      if (!this.isOpen()) {
        this.createVisiblePopover();
      }
    } else {
      // In the case we want to manually position the el, we just want to show the el inline
      this.$el.show();
      this.visibleEl = this.$el;
    }
    // Once the element is visible on the page, whether auto positioned or not, bind general events to the popover
    this.onPopoverCreated();
    // Attach classes to the anchor element, just in case we want to treat it differently
    this.anchor.addClass('open');
    // This is never removed, and can be used to know if the
    // popover has been opened for the lifespan of the page session
    // E.g. to remove the notification count in the header dropdown
    this.anchor.addClass('was-shown');
    // Trigger open event
    this.trigger('popover:open', { popoverEl: this.visibleEl });
    // When any area of the site is selected then the popover should close
    // TODO: The off and on are required because we do not want this event to be bound multiple times.
    // We should move this out of makeVisible so that it is only called once.
    $('body').off('click', this.onBodyClick)
      .on('click', this.onBodyClick);
  },

  // Grab the content for the popover. This should be refactored
  // to receive JSON data and render mustache templates
  // rather than receiving an HTML dump.
  populateFromEndpoint: function() {
    if (!this.populating) {
      const _this = this;
      this.populating = true;
      // Also remove all content from the non-visible popover first
      this.contentEl.empty();

      this.$el.find('.inner-popover').addClass('icon-loading');

      Utils.ajaxRequest(this.endpoint, {
        type: 'GET',
        dataType: 'json',
        data: this.endpointData,
        success: function(data) {
          if (!data.success) {
            return;
          }
          _this.contentEl.html(data.content);
          _this.$el.find('.inner-popover').removeClass('icon-loading');
          _this.populating = false;
          // Store the bootstrap data we receive from the endpoint
          // This can be picked up later, or by sublcass if needed
          _this.templateData = data.templateData;
          // Trigger update to make sure if we're using a visible el, it's updated
          _this.updateVisiblePopover();
        },
      });
    }
  },

  close: function() {
    if (this.autoPosition) {
      this.removeVisiblePopover();
    } else {
      this.$el.hide();
    }

    this.visibleEl = null;
    this.anchor.removeClass('open');
    this.trigger('popover:close');
  },

  createVisiblePopover: function() {
    // Creating a visible el can only be achieved if we want to position absolute on top of the page
    if (this.autoPosition) {
      this.visibleEl = this.$el.clone();
      this.visibleEl.appendTo('body');
      this.visibleEl.show();
      this.reposition();
    }
  },

  onPopoverCreated: function() {
    if (this.showOnHover) {
      // On enter/leave popover
      this.visibleEl.off('mouseenter').on('mouseenter', this.onEnterPopover);
      this.visibleEl.off('mouseleave').on('mouseleave', this.onLeavePopover);
    }
    // Run any additional post rendering on the content
    Common.initNewTooltips();
  },

  reposition: function() {
    if (this.visibleEl) {
      this.visibleEl.offset(this.calculatePosition());
    }
  },

  /*
     * We can use this function at any time to update the visible el shown to the user with
     * updated content from the original DOM el.
     * Only do this if the current popover is visible, otherwise we might be in a position
     * where the user doesn't care any more and has moused out
     * E.g. when we're finished fetching data from endpoint
     */
  updateVisiblePopover: function() {
    if (this.autoPosition && this.isOpen() && this.visibleEl) {
      // First remove current visible el if it exists
      this.removeVisiblePopover();
      // Immediately re-create
      this.createVisiblePopover();
      // Since the popover has been re-created, re-bind all of the popover events
      this.onPopoverCreated();
    }
  },

  removeVisiblePopover: function() {
    if (this.autoPosition && this.visibleEl) {
      this.visibleEl.remove();
    }
  },

  calculatePosition: function() {
    // We're going to position relative to the anchor that
    // launched the popover or the target element if set
    const anchor = this.target || this.anchor;
    const offset = anchor.offset();
    let position = {};
    let top;
    let left;
    // Determine the position based on the placement of our el to the anchor el
    switch (this.placement) {
      case 'bottom':
        top = offset.top + (anchor.outerHeight());
        left = offset.left + -(this.visibleEl.find('.arrow').position().left - (anchor.outerWidth() / 2)) - 10;
        position = { top: top, left: left };

        break;
      case 'top':
        top = (offset.top - 20) + -this.visibleEl.outerHeight();
        left = offset.left + -(this.visibleEl.find('.arrow').position().left - (anchor.outerWidth() / 2));
        position = { top: top, left: left };
        // tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
        break;
      case 'left':
        // tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
        break;
      case 'right':
        // tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
        break;
      case 'absolute':
        top = offset.top + (anchor.outerHeight() + 20);
        left = offset.left - (anchor.outerWidth() / 2);
        position = { top: top, left: left };
        break;
      default:
        top = offset.top + (anchor.outerHeight() + 20);
        left = offset.left + -(this.visibleEl.find('.arrow').position().left - (anchor.outerWidth() / 2));
        position = { top: top, left: left };
        break;
    }
    return position;
  },

  // Check if the popover is already opened
  isOpen: function() {
    // We know if a popover is open if we have a visible el
    if (!_.isNull(this.visibleEl)) {
      return true;
    }
    return false;
  },

  onEnterAnchor: function() {
    if(this.isMuted()) {
      return;
    }
    // Open after a delay
    this.openPopoverTimer = window.setTimeout(this.open, this.HOVER_OPEN_DELAY);
    this.isInteracting = true;
  },

  onLeaveAnchor: function(event, noDelay) {
    if(this.isMuted()) {
      return;
    }
    // Prevent the popover from opening if a user doesn't care anymore
    clearTimeout(this.openPopoverTimer);
    this.isInteracting = false;
    if (this.isOpen()) {
      if (!_.isUndefined(noDelay)) {
        this.close();
      } else {
        this.delayClose();
      }
    }
  },

  onAnchorClick: function(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (this.populating || this.isMuted()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  },

  onEnterPopover: function() {
    this.isInteracting = true;
  },

  onLeavePopover: function() {
    this.isInteracting = false;
    this.delayClose();
  },

  delayClose: function() {
    // Delay the close to allow the user time to re-enter
    const _this = this;
    clearTimeout(this.closeTimer);
    this.closeTimer = window.setTimeout(function() {
      if (!_this.isInteracting) {
        _this.close();
      }
    }, this.HOVER_CLOSE_DELAY);
  },

  // When the user clicks on any other area of the page, close the popover
  onBodyClick: function(ev) {
    // Make sure we're not clicking the anchor which allows the user to
    // open the popover though
    if (this.anchor.get(0) === ev.target) {
      return;
    }

    // Check if we're clicking any of the anchors descendants too
    if (this.anchor.has(ev.target).length > 0) {
      return;
    }

    // Handles the case where we may have an element inside of the popover that gets
    // removed when it is clicked (a cancel button in an edit form).
    // In this case, the visibleEl will no longer have it and there's a chance
    // that the check below will fail. This way, we can guarantee when clicking that
    // element that the popover will not close due to a body click.
    if ($(ev.target).hasClass('prevent-popover-close')) {
      return;
    }

    // See if we're clicking any descendants of the popover
    if (!_.isNull(this.visibleEl) && this.visibleEl.has(ev.target).length > 0) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    }
  },

  isMuted: function() {
    return $(this.anchor).hasClass('mute-popover');
  },

  dispose: function() {
    this.destroyed = true;
    this.anchor.off('click', this.onAnchorClick);
    $('body').off('click', this.onBodyClick);
    SSView.prototype.dispose.apply(this, arguments);
  },

  onClickClose: function(e) {
    e.preventDefault();
    this.close();
  },

  setShowOnHover: function(showOnHover) {
    this.showOnHover = showOnHover;
    if (!this.showOnHover) {
      this.anchor.on('click', this.onAnchorClick);
    } else {
      this.anchor.on('mouseenter', this.onEnterAnchor);
      this.anchor.on('mouseleave', this.onLeaveAnchor);

      if (this.visibleEl) {
        this.visibleEl.off('mouseenter').on('mouseenter', this.onEnterPopover);
        this.visibleEl.off('mouseleave').on('mouseleave', this.onLeavePopover);
      }
    }
  },

});

export default PopoverView;

