import DialogView from 'core/src/views/modules/dialog';
import DialogManager from 'core/src/utils/dialog-manager';
import template from 'text!core/src/templates/dialogs/class-details-follow-dialog.mustache';

const ClassDetailsFollowDialogView = DialogView.extend({

  className: 'follow-dialog shadow on-main',

  placement: 'left',

  arrowPlacement: 'right',

  template: template,

  dialogId: DialogManager.CLASS_DETAILS_FOLLOW_DIALOG_ID,

  initialize: function() {
    DialogView.prototype.initialize.apply(this, arguments);
  },

});

export default ClassDetailsFollowDialogView;

