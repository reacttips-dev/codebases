import SSView from 'core/src/views/base/ss-view';
import Utils from 'core/src/base/utils';
import template from 'text!core/src/templates/modules/site-alert.mustache';

const Alert = SSView.extend({

  attachAlertToHeader: false,
  deferRender: true,
  className: 'site-alert round-all',
  template: template,
  defaultTemplateData: {
    title: 'Success',
    action: '',
    actionString: '',
    icon: '',
    buttonCb: null,
    buttonString: '',
    syncToStickyHeader: true,
    buttonClass: '',
    ssIcon: '',
  },
  defaultTime: 4000,
  // additionalAlertClasses is adding a class to be passed to alert component
  // to position alert below gamification banner if it is present
  additionalAlertClasses: null,

  events: {
    'click .btn-close': 'onClickClose',
    'click .btn-callback': 'onClickBtn',
  },

  initialize: function(options = {}, syncToStickyHeader = true) {
    const type = options.type || null;
    let icon = '';
  
    SSView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onHoverOver', 'onHoverOut');

    this.buttonCb = options.buttonCb || null;
    this.attachAlertToHeader = this.isAlertOnHeader(type);

    // Handle any passing arguments
    if (type) {
      if (type.includes('success')) {
        icon = 'ss-icon-check icon-green';
      } else if (type === 'warning') {
        icon = 'ss-icon-circle-exclamation icon-yellow';
      } else if (type === 'error') {
        icon = 'ss-icon-circle-exclamation icon-red';
      }
      options.icon = icon;
    }

    options.syncToStickyHeader = syncToStickyHeader;

    this.time = options.time || this.defaultTime;
    this.templateData = _.extend({}, this.defaultTemplateData, options);
    
    // additionalAlertClasses is adding a class to be passed to alert component
    // to position alert below gamification banner if it is present
    this.additionalAlertClasses = options.additionalAlertClasses;

    this.on('show', this.onShowAlert);
    this.on('hide', this.onHideAlert);

    this.listenTo(Backbone, 'header:cancelStickyState', this.onCancelStickyHeader);
    this.listenTo(Backbone, 'header:restartStickyState', this.onRestartStickyHeader);
  },

  render: function() {
    // Attach hover events
    this.$el.hover(this.onHoverOver, this.onHoverOut);
    SSView.prototype.render.apply(this, arguments);
  },

  onHoverOver: function() {
    window.clearTimeout(this.timer);
  },

  onHoverOut: function() {
    this.startTimer();
  },

  startTimer: function() {
    const _this = this;
    this.timer = window.setTimeout(function() {
      _this.trigger('hide');
    }, this.time);
  },

  onClickClose: function() {
    this.trigger('hide');
  },

  onClickBtn: function() {
    if (this.buttonCb) {
      this.buttonCb();
    }
  },

  isAlertOnHeader: function(type = ''){
    return _.isString(type) && type.includes('sticky') && !$('.site-header').hasClass('sticky-bottom');
  },

  onShowAlert: function() {
    const _this = this;
    // Don't know why we need to defer this
    // If we don't, we don't see the css3 animation. Webkit issue?
    _.defer(function() {
      // Adjust the alert's margin for proper centering
      const halfAlertWidth = _this.$el.outerWidth() / 2;
      _this.$el.css({
        'margin-left': -halfAlertWidth,
      });

      _this.$el.addClass('show');
      if (_this.templateData.type === 'error'){
        _this.$el.addClass('error');
      }
      if (_this.attachAlertToHeader && _this.templateData.syncToStickyHeader){
        _this.$el.addClass('on-header');
      }
      // add any additionalAlertClasses that are passed in alert options
      if (_this.additionalAlertClasses) {
        _this.$el.addClass(_this.additionalAlertClasses);
      }
      // Attach event that will ultimately hide the alert if the CTA is clicked
      _this.$('a').on('click', function() {
        _this.trigger('hide');
      });
    });
    // Start timer to hide
    this.startTimer();
  },

  onHideAlert: function() {
    // Listen for hide complete
    const _this = this;
    this.$el.on(Utils.getTransitionEndEvent(), function() {
      _this.$el.remove();
    });
    // Hide
    this.$el.removeClass('show');

    this.trigger('destroy');
  },

  onCancelStickyHeader: function() {
    if(this.attachAlertToHeader){
      this.$el.removeClass('on-header');
    }
  },

  onRestartStickyHeader: function() {
    if(this.attachAlertToHeader){
      this.$el.addClass('on-header');
    }
  },

});

export default Alert;

