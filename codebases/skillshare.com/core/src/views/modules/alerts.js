import SSView from 'core/src/views/base/ss-view';
import Alert from 'core/src/views/modules/alert';
import StickyScrollView from 'core/src/views/modules/sticky-scroll';

const Alerts = SSView.extend({

  syncToStickyHeader: true,
  alerts: {},

  initialize: function() {
    SSView.prototype.initialize.apply(this, arguments);
    this.on('create', this.onCreateAlert);
    // Scroll event to alter the position of the alerts if we need to
    this.stickyScroll = new StickyScrollView({
      el: $('#alerts-holder'),
      offsetTop: 20 + $('.site-header').outerHeight(),
    });

    this.listenTo(this.stickyScroll, 'updateStickyState', this.onStickyUpdate);
  },

  onStickyUpdate: function() {
    if($('#alerts-holder').hasClass('sticky') && !$('.site-header').hasClass('sticky')){
      this.syncToStickyHeader = false;
      this.resetAlerts();
    } else {
      this.syncToStickyHeader = true;
    }
  },

  resetAlerts: function() {
    if (_.size(this.alerts) > 0) {
      this.alerts[_.keys(this.alerts)[0]].trigger('hide');
    }
  },

  onCreateAlert: function(data) {
    const _this = this;
    _this.resetAlerts();

    // Create the alert, passing data as options
    const alert = new Alert(data, _this.syncToStickyHeader);
    alert.on('didRender', function() {
      // Attach to DOM
      $('#alerts-holder').append(alert.$el);
      // Trigger show
      alert.trigger('show');
    });

    alert.on('destroy', function() {
      delete _this.alerts[alert.cid];
    });

    this.alerts[alert.cid] = alert;
  },

});

export default Alerts;

