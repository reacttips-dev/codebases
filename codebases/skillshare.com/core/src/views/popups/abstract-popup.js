import BaseView from 'core/src/views/base/base-view';
import PopupStack from 'core/src/utils/popup-stack';
import PageOverlay from 'core/src/views/modules/page-overlay';
import Mustache from 'mustache';

const AbstractPopupView = BaseView.extend({

  id: 'abstract-popup-view',

  // flag to auto-render after initialize. see base/view.js
  autoRender: true,

  // container element. see base/view.js
  container: '#click-off-overlay', //'#popup-container',

  //  Default to true to show loader during fetch of content from endpoint
  shouldShowLoaderIcon: true,

  centerVertically: true,

  // Used if we ever want a basic popup without creating a new file.
  // We can set these properties to auto-render based on passed in options
  template: null,
  templateData: {},
  templatePartials: {},

  // Used to auto-style a basic popup
  basicPopup: false,

  // Whether to remove the element from the DOM when the PageOverlay is closed
  disposeOnClose: true,

  events: function() {
    return _.extend(BaseView.prototype.events.call(this), {
      'click .btn-close': 'onClickClose',
      'click .btn-action-cancel': 'onClickClose',
    });
  },

  // empty options per default, to be combined with inheriting classes
  options: function() {
    return {};
  },

  // @param: options
  //   preventClose: if true, wont allow the popup to close in closePopup()
  //   endpoint:     if set, will pull content from that endpoint and render in the subview
  initialize: function(options = {}) {
    _.bindAll(this, 'openPopup', 'closePopup', 'createWithView');
    BaseView.prototype.initialize.apply(this, arguments);

    const _this = this;

    // copy some options to instance properties
    _.extend(this, _.pick(options, [
      'preventClose',
      'template',
      'templateData',
      'templatePartials',
      'basicPopup',
      'centerVertically',
      'disposeOnClose',
    ]));

    // we know that the popup is closed when the overlay has been closed
    if (this.disposeOnClose) {
      this.listenTo(PageOverlay, 'overlayDidCloseEVENT', function() {
        this.trigger('onPopupDidCloseEvent');
      }, this);
    }

    // PageOverlay's contract is to expose the click event. popup is responsible for
    // closing the PageOverlay, and listening to the events it emits
    this.listenTo(PageOverlay, 'overlayWasClickedEVENT', this.closePopup);

    // pressing escape key closes the popup
    $(document).one('keyup.esckey', function(e) {
      if (e.which === 27) {
        _this.trigger('onPopupDidCancelEvent');
      }
    });

    this.on('onPopupDidCancelEvent', this.onPopupCancel);
    this.on('onPopupDidCloseEvent', this.dispose);

    // By passing an endpoint to options, we're saying we need to go get the popup's content from the BE
    const endpoint = options.endpoint || this.endpoint;
    if (endpoint) {
      // autoRender relies on the fact that we have all of our content
      // ready to be added to the DOM. since this isn't the case, we
      // have to disable the autoRender flag
      this.autoRender = false;
      const endpointData = options.endpointData || this.endpointData || {};
      //  endpointData is optional, sent along with endpoint as querystring
      this.createWithContentFromEndpoint(endpoint, endpointData);
    }
  },

  render: function() {
    BaseView.prototype.render.apply(this, arguments);
    if (this.centerVertically) {this.$el.addClass('center-vertically');}

    if (this.basicPopup === true) {
      this.$el.addClass('basic-popup');
    }

    if (!_.isNull(this.template)) {
      const data = _.result(this, 'templateData');
      const html = Mustache.render(this.template, data, this.templatePartials);
      this.$el.append(html);
      this.openPopup();
    }

    this.renderSubviews();

    this.trigger('didRender');
    return this;
  },

  afterRender: function() {
    BaseView.prototype.afterRender.apply(this, arguments);
    this.centerPopup();
  },

  renderSubviews: function() {
    const contentContainer = this.$('.popup-content').length !== 0
      ? this.$('.popup-content')
      : this.$el;
    contentContainer.append(_.map(this.subviews, function(subview) {
      return subview.el;
    }));

    _.each(this.subviews, function(subview) {
      return subview.render();
    });
  },

  createWithContentFromEndpoint: function(endpoint, endpointData) {
    const _this = this;

    // show the loading indicator if requested
    if (this.shouldShowLoaderIcon !== false) {this.addLoaderIcon();}

    // crate an empty dummy model. we will use this to sync
    const contentModel = new Backbone.Model();

    // set its url to our endpoint
    contentModel.url = endpoint;

    // create a dummy view to hold our model data
    const contentView = new BaseView({
      model: contentModel,
      // appending is handled  `renderSubviews` above
    });

    // overwrite the view's default render to use the returned HTML content
    // the content attribute must be a JSON property set by the server
    contentView.render = function() {
      // `this` refers to contentView
      this.$el.empty().html(this.model.get('content'));
    };

    // add the contentView as a subview of our current popup so we can
    // access it through the `subviews` array
    this.subview('content', contentView);

    // finally, fetch the data from the server
    contentModel.fetch({
      data: endpointData,
    }).done(function() {
      // remove the centering class we applied during `addLoaderIcon`
      _this.$el.removeClass('loader center-vertically');
      _this.$el.empty();
      _this.$el.css('margin-top', '80px');
      // Add original classes back in
      _this.$el.addClass(_this.popupClasses);
      _this.render(); // will also render subviews (e.g. the 'content' subview we just added)
      _this.trigger('subview:loaded');
      // redelegate events.
      _this.delegateEvents();
    });
  },

  createWithView: function(view) {
    this.subview('content', view);
    const _this = this;
    this.subview('content').on('onContentReady', function() {
      _this.render();
      _this.openPopup();
    });
  },

  onClickClose: function(e) {
    e.preventDefault();
    this.trigger('onClickCloseEvent');
    this.trigger('onPopupDidCancelEvent');
  },

  onPopupCancel: function() {
    // Force the popup to close. There should never be a case when cancel / x btn
    // fails to close the modal
    this.closePopup(true);
  },

  centerPopup: function() {
    //  Always reset height
    //  For some reason we call this method a lot
    //  And in doing so we can inherit a bad 'fixed state' margin-top
    //  See teacher popup to ask question popup
    // this.$el.css('margin-top', 0);
    //  Always center horizontally
    this.$el.css('margin-left', (-1 * this.$el.outerWidth()) / 2);
    //  Only center vertically if the popup is fixed in window
    if (this.$el.hasClass('center-vertically')) {
      this.$el.css('margin-top', (-1 * this.$el.outerHeight()) / 2);
    }
  },

  openPopup: function() {
    PageOverlay.open({
      preventClose: this.preventClose,
    });
    this.$el.show();
    this.centerPopup();
    PopupStack.push(this.$el, { emptyOnPop: this.disposeOnClose });
  },

  // close the overlay and completely dispose the popup view
  // (including remove from DOM and unbind event listeners)
  //
  // preventClose is currently used to prevent the overlay
  // from closing the popup but in the case that the user clicks
  // on the x button, we always want the popup to be closed.
  // In order to handle this case while not changing the function
  // as it has several touchpoints, the forceClose parameter has been added.
  // Ideally, closePopup would always close the popup unless
  // a boolean was passed to prevent it from closing instead of
  // relying on preventClose.
  //
  // set the instance variable `preventClose` to override
  closePopup: function(forceClose) {
    if (forceClose === true || this.preventClose !== true) {
      // closing the overlay sets off a chain of events which
      // ultimately disposes the popup instance and its $el
      if (PopupStack.getStack().length > 1) {
        PopupStack.pop();
      } else {
        PageOverlay.close();
      }
    }
  },

  addLoaderIcon: function() {
    // Remove all other classes for this popup
    // First remember them
    this.popupClasses = this.$el.attr('class');
    // Remove
    this.$el.removeClass();
    // Center loader
    this.$el.addClass('loader center-vertically');
    // Add loader
    this.$el.empty().html('<div class="icon-loading"></div>');
    // append to the DOM so we're visible
    $(this.container)[this.containerMethod](this.$el);
    this.openPopup();
  },
});
export default AbstractPopupView;

