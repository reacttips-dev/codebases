import Button from 'core/src/views/modules/button';
import Watchlist from 'core/src/models/watchlist';
import template from 'text!core/src/templates/modules/buttons/wishlist-button.mustache';
import SaveListPopover from 'core/src/views/popovers/save-list-popover';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import WishlistButtonHelper from 'core/src/helpers/wishlist-button-helper';

import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { CookieProvider } from '@skillshare/ui-components/components/providers';
import { SaveClassButton } from '@skillshare/ui-components/components/save-class/save-class-button';
import { Button as ReactButton, ButtonSize } from '@skillshare/ui-components/components/buttons/button';
import { SaveClassIcon } from '@skillshare/ui-components/components/icons/icon-save-class';
import { SavedClassIcon } from '@skillshare/ui-components/components/icons/icon-saved-class';

const WishlistButton = Button.extend({

  requiresLogin: true,

  showNotifications: true,

  showListPopover: true,

  template: template,

  initialize: function(options = {}) {
    _.bindAll(this, 'onStateChange', 'destroyPopover');
    _.extend(this, _.pick(options, [
      'activeClass',
      'inactiveClass',
      'markAsCheckedClass',
      'showNotifications',
      'showListPopover',
      'template',
    ]));

    if (options.isLabelButton) {
      if (options.labels) {
        this.labels = options.labels;
      } else {
        this.labels = [
          '<svg class="ss-svg-icon"><use xlink:href="#save" /></svg> Save',
          '<svg class="ss-svg-icon"><use xlink:href="#saved" /></svg> Saved',
        ];
      }
      this.templateData = { isLabelButton: true };
    } else if (options.hasPopovers) {
      this.popovers = [
        'Save for Later',
        'Unsave',
      ];
    } else {
      this.tooltips = [
        'Save for Later',
        'Unsave',
      ];
    }

    this.templateData.styles = options.styles;

    // We can either pass in data here and create the model on the fly
    // or we can pass in a wishlist model that's already been created
    // as this.model
    if (!this.model) {
      // Set up data for our Wishlist model
      const data = _.pick(options.modelData, 'parent_sku', 'parent_class_id', 'trackingParams');

      // By passing an id, we're saying the user has already activated the button state on load
      if (options.modelData.wishlistId !== false) {
        data.id = options.modelData.wishlistId;
      }
      this.model = new Watchlist(data);
    }

    // Set initial state
    this.initialState = this.model.get('id')
      ? Button.states.ACTIVE : Button.states.INACTIVE;

    if (this.activeClass) {
      this.templateData.activeClass = this.getInitalClass();
    }

    // Listen for successful save
    this.on('save', this.onSuccessfulSave);
    this.on('destroy', this.onSuccessfulDestroy);
    this.model.on('change:state', this.onStateChange);

    this.initializeReactSaveButton();
  },

  initializeReactSaveButton: function() {
    const container = this.options.container.get(0);

    if (!container) {
      return;
    }

    let saveIcon = null;
    let savedIcon = null;

    if (this.model.get('trackingParams')?.via === 'class-details-header') {
      saveIcon = <ReactButton className="alt-navy-ghost" size={ButtonSize.Small} icon={<SaveClassIcon width={16} />} text="Save" />;
      savedIcon = <ReactButton className="alt-navy-ghost" size={ButtonSize.Small} icon={<SavedClassIcon width={16} />} text="Saved" />;
    }

    const shouldRenderSignupView = this.requiresLogin && SS.currentUser.isGuest();
    const csrfToken = $.cookie('YII_CSRF_TOKEN');

    ReactDOM.render(
      <DefaultThemeProvider>
        <CookieProvider cookies={{ 'YII_CSRF_TOKEN': csrfToken }}>
        <SaveClassButton
          sku={this.model.get('parent_sku').toString()}
          classId={this.model.get('parent_class_id')}
          saved={!!this.model.get('id')}
          renderSignupView={shouldRenderSignupView ? this.renderSignupView.bind(this) : null}
          fetchListItems={WishlistButtonHelper.fetchListItems.bind(WishlistButtonHelper)}
          onClickListItem={WishlistButtonHelper.onClickListItem.bind(WishlistButtonHelper)}
          onCreateNewList={WishlistButtonHelper.onCreateNewList.bind(WishlistButtonHelper)}
          saveIcon={saveIcon}
          savedIcon={savedIcon}
          portalContainer={document.querySelector('body')}
        />
        </CookieProvider>
      </DefaultThemeProvider>,
      container
    );
  },

  renderSignupView: function() {
    new TwoPanelSignupView({
      state: 'signup',
      redirectTo: window.location.href,
    });
  },

  getInitalClass: function() {
    if (this.initialState === Button.states.ACTIVE) {
      return this.markAsCheckedClass ? this.markAsCheckedClass : this.activeClass;
    }
    return this.inactiveClass;
  },

  toggleListPopover: function(clickEvent) {
    if (this.showListPopover) {
      if (this.listPopover && this.listPopover.isOpen()) {
        this.listPopover.onAnchorClick(clickEvent);
      } else {
        // CL: onAnchorClick stops propagation of the event, and we want to make sure the event propagates all the way
        // down to the body so that any other open popovers will close on click. setTimeout(0) makes it run after the event
        // has successfully bubbled
        setTimeout(() => {
          this.setUpPopover();
          if (clickEvent) {
            this.listPopover.onAnchorClick(clickEvent);
          } else {
            this.listPopover.open();
          }
        }, 0);
      }
    }
  },

  onUndoSave: function() {
    const newState = Button.states.INACTIVE;
    this.setState(newState);
    this.sync();
    this.trigger('click', newState);
    this.$el.removeClass('click');
  },

  isMarkedAsChecked: function() {
    return this.markAsCheckedClass && this.$el.hasClass(this.markAsCheckedClass);
  },

  onStateChange: function(model) {
    if (!this.activeClass || !this.inactiveClass || this.isMarkedAsChecked()) {
      return;
    }

    if (model.get('state') === Button.states.ACTIVE) {
      this.$el.removeClass(this.inactiveClass);
      this.$el.addClass(this.activeClass);
    } else if (model.get('state') === Button.states.INACTIVE) {
      this.$el.addClass(this.inactiveClass);
      this.$el.removeClass(this.activeClass);
    }
  },

  onClick: function(e) {
    if (this.showListPopover) {
      this.toggleListPopover(e);
    }

    if (!this.model.get('id') || !this.showListPopover) {
      Button.prototype.onClick.apply(this, arguments);
    }
  },

  onSuccessfulSave: function() {
    if (this.showNotifications) {
      // We want to show the user a notification alert that this was successful
      SS.events.trigger('alerts:create', {
        title: 'Saved to',
        action: '/lists/saved-classes',
        actionString: 'All Saved Classes',
        type: 'success-sticky',
        buttonString: 'Undo',
        buttonCb: this.onUndoSave.bind(this),
      });
    }

    if(this.markAsCheckedClass) {
      this.$el.removeClass([this.activeClass, this.inactiveClass].join(' '));
      this.$el.addClass(this.markAsCheckedClass);
    }

    SS.events.trigger('wishlistAdded', this.model);

    if (this.listPopover) {
      this.listPopover.fetchLists();
    }
  },

  onSuccessfulDestroy: function() {
    if (this.showNotifications) {
      SS.events.trigger('alerts:create', {
        title: 'Class removed.',
        type: 'success-sticky',
      });
    }

    if(this.markAsCheckedClass) {
      this.$el.removeClass(this.markAsCheckedClass);
    }

    SS.events.trigger('wishlistRemoved', this.model);
  },

  setUpPopover: function() {
    if (!this.listPopover) {
      this.popoverContainer = document.createElement('div');
      this.popoverContainer.className = 'popover shadow bottom save-list-container js-popover-container';

      this.listPopover = new SaveListPopover({
        autoPosition: true,
        showOnHover: false,
        placement: 'bottom',
        arrowPlacement: 'top',
        anchor: this.options.container,
        el: this.popoverContainer,
        parentSku: this.model.get('parent_sku'),
      });

      this.listPopover.on('popover:close', this.destroyPopover);
      this.listPopover.fetchLists();
    }
  },

  destroyPopover: function() {
    this.listPopover.dispose();
    this.listPopover = null;
  },

});

export default WishlistButton;
