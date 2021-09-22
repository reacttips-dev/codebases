import SSView from 'core/src/views/base/ss-view';
import UserDialogViewModel from 'core/src/models/user-dialog-view';
import DialogManager from 'core/src/utils/dialog-manager';

const WelcomeBannerView = SSView.extend({

  dialogId: null,
  parentClassId: null,

  events: {
    'click .close-button': 'onClose',
    'click .dismiss-banner': 'onClose',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['dialogId', 'cookieName', 'parentClassId']));

    if (!this.dialogId) {
      throw new Error('A dialogId is required.');
    }

    SSView.prototype.initialize.apply(this, arguments);
  },

  close: function() {
    const _this = this;

    this.$el.slideUp(500, function() {
      _this.$el.remove();
    });
  },

  onClose: function() {
    if (!SS.currentUser.isGuest()) {
      const userDialogViewModel = new UserDialogViewModel({
        dialog_id: this.dialogId,
        user_uid: SS.currentUser.id,
        parent_class_id: this.parentClassId,
      });
      userDialogViewModel.save();

      DialogManager.addViewedDialogId(this.dialogId);
    }

    const { parentClassId, cookieName } = this;
    let cookieData = 1;

    if (parentClassId) {
      cookieData = $.cookie(cookieName);
      cookieData = cookieData ? cookieData.split('-') : [];
      cookieData.push(parentClassId);
      cookieData = cookieData.join('-');
    }

    if (cookieName) {
      $.cookie(cookieName, cookieData, {
        path: '/',
        expires: 365,
      });
    }

    this.close();
  },
});

export default WelcomeBannerView;

