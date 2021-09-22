import SSView from 'core/src/views/base/ss-view';
import FormPopupView from 'core/src/views/popups/form-popup';
import ActionPopupView from 'core/src/views/popups/action-popup';

const TeacherMenuClassDetailsView = SSView.extend({
  el: '.teacher-area',

  events: {
    'click .js-post-announcement': 'onClickPostAnnouncement',
    'click .js-unenroll': 'unenroll',
    'click .btn-enroll': 'onClickEnroll',
  },

  /*
     * Teacher / Admin sidebar actions
     */

  onClickPostAnnouncement: function(e) {
    e.preventDefault();
    new FormPopupView({
      endpoint: '/discussions/renderForm',
      endpointData: {
        'type': 'Announcement',
        'id': $(e.currentTarget).data('ss-parent-id'),
        'showRichDescription': 'true',
      },
    });
  },

  unenroll: function(e) {
    e.preventDefault();
    const unenrollPath = $(e.currentTarget).attr('data-ss-unenrollPath');
    const popup = new ActionPopupView({
      content: '<p>You are about unenroll from this class. '
          + 'You will lose the cost of your ticket.</p>',
      submitBtnVal: 'Yes, unenroll me',
    });
    popup.openPopup();
    popup.on('onConfirmationDidConfirmEvent', function() {
      window.location.href = unenrollPath;
    });
  },

  onClickEnroll: function(e) {
    const $el = $(e.currentTarget);
    if ($el.hasClass('disabled')) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      $el.addClass('disabled');
    }
  },

});

export default TeacherMenuClassDetailsView;

