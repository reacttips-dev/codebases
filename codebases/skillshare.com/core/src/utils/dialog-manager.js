import deepRetrieve from 'core/src/utils/deep-retrieve';

/**
   * The DialogManager manages the creation and removal of DialogViews
   * and has two main responsibilites:
   * 1) making sure that a user only sees the dialog once
   * 2) making sure that only one dialog can appear at a time
   */
const DialogManager = {

  // Legacy dialog IDs are referenced in ss_user_dialog_views but are no longer displayed on the site
  CLASS_DETAILS_PROJECT_DIALOG_ID: 1, // legacy
  CLASS_DETAILS_NOTES_DIALOG_ID: 2, // legacy
  HOME_WELCOME_BANNER_DIALOG_ID: 3, // legacy
  AMA_WELCOME_BANNER_DIALOG_ID: 4,
  HOME_PREMIUM_BANNER_DIALOG_ID: 5, // legacy
  CLASS_DETAILS_COMMUNITY_DIALOG_ID: 7, // legacy
  HOME_ENROLL_BANNER_DIALOG_ID: 8, // legacy
  CLASS_DETAILS_PREMIUM_BANNER_DIALOG_ID: 9, // legacy
  LISTS_WELCOME_BANNER_DIALOG_ID: 10,
  VIDEO_PLAYBACK_SPEED_DIALOG_ID: 11, //legacy
  PERSONALIZE_DIALOG_ID: 12,
  CLASS_DETAILS_DISCUSSIONS_WELCOME_BANNER_DIALOG_ID: 13,
  STUDENTS_GRAPH_DIALOG_ID: 14,
  CLASS_DETAILS_FOLLOW_DIALOG_ID: 15,
  CORE_BRAND_REFRESH_2020_POPUP_ID: 16,

  viewedDialogIds: [], // The list of dialog IDs that have already been viewed

  currentDialogView: null, // The dialog that is currently being displayed, only 1 dialog can appear at a time

  initialize: function() {
    this.viewedDialogIds = deepRetrieve(SS, 'serverBootstrap', 'userDialogViewData') || [];
    return this;
  },

  addViewedDialogId: function(dialogId) {
    this.viewedDialogIds.push(dialogId);
  },

  setCurrentDialogView: function(dialogView) {
    // If we are currently showing a dialog, remove it
    this.removeCurrentDialogView();

    // Set the current dialog to be the new dialog view
    this.currentDialogView = dialogView;
  },

  removeCurrentDialogView: function() {
    if (!this.currentDialogView) {
      return;
    }

    this.currentDialogView.remove();
    this.currentDialogView = null;
  },

  createDialog: function(dialogId, Dialog, options) {
    // Only show dialogs to logged in users
    if (SS.currentUser.isGuest()) {
      return;
    }

    // Only show the dialog if the user hasn't seen it yet
    if (_.indexOf(this.viewedDialogIds, dialogId) > -1) {
      return;
    }

    const dialogView = new Dialog(options);

    this.setCurrentDialogView(dialogView);

    return dialogView;
  },

};

export default DialogManager.initialize();


