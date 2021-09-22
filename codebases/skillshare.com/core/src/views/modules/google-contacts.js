import SSView from 'core/src/views/base/ss-view';
import Google from 'core/src/base/google';
import ReferralContactsCollection from 'core/src/collections/referral-contacts';
import ReferralContactsCollectionView from 'core/src/views/collection-views/referral-contacts-collection-view';
import ContactsTemplate from 'text!core/src/templates/contacts/_container.mustache';

const GoogleContactsView = SSView.extend({

  events: {
    'click .retry-btn': 'onRetry',
  },

  autoRender: false,

  template: ContactsTemplate,

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, ['trackingParams', 'referralData']));
    SSView.prototype.initialize.apply(this, arguments);
  },

  // Authorize the user to use google contacts.
  // We don't want this view to render unless they've given us permission
  // to access their contacts, so wait to render once authorization is complete
  // and successful.
  authorize: function() {
    const _this = this;

    Google.loaded.done(function() {
      Google.authorize().done(function() {
        _this.trigger('user:authorized');
        _this.render();
      });
    });
  },

  afterRender: function() {
    const _this = this;
    this.$contactsList = this.$('.contacts-list');
    this.$errorMessage = this.$('.error-message');

    const deferred = Google.loadContacts();

    deferred.done(function(response) {
      _this.trigger('contacts:loaded');
      _this.$contactsList.removeClass('loading-overlay');

      const contacts = new ReferralContactsCollection(response, { referralData: _this.referralData });
      if (contacts.length <= 0) {
        _this.showError('You have no contacts.');
      } else {
        new ReferralContactsCollectionView({
          collection: contacts,
          el: _this.$contactsList,
        });
      }
    });

    deferred.fail(function() {
      _this.showError('There was an error fetching your contacts.', true);
    });

    SSView.prototype.afterRender.apply(this, arguments);
  },

  onRetry: function() {
    this.$el.removeClass('error retry');
    this.authorize();
  },

  showError: function(message, showRetry) {
    this.$contactsList.empty();
    this.$errorMessage.html(message);
    this.$el.addClass('error');

    if (showRetry) {
      this.$el.addClass('retry');
    }
  },

});

export default GoogleContactsView;

