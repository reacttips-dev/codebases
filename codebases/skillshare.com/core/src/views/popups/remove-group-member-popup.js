import Utils from 'core/src/base/utils';
import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import GroupMemberTemplate from 'text!core/src/templates/groups/group-member.mustache';
import template from 'text!core/src/templates/popups/remove-group-member-popup.mustache';

const RemoveGroupMemberPopup = AbstractPopupView.extend({
  basicPopup: true,

  className: 'group-popup',

  events: function () {
    return _.extend(AbstractPopupView.prototype.events.call(this), {
      'click .group-popup-btn': 'onClickRemoveMember',
    });
  },

  template: template,

  templatePartials: {
    'groups/group-member': GroupMemberTemplate,
  },

  templateData: function () {
    return _.extend(this.model.attributes, {
      isPopup: true,
    });
  },

  onClickRemoveMember: function () {
    Utils.ajaxRequest(`/groups/membership/${this.model.get('membershipId')}`, {
      type: 'DELETE',
      success: () => {
        this.model.destroy();
        this.closePopup();
      },
      error: () => {
        SS.events.trigger('alerts:create', {
          title: 'Sorry we encountered a problem removing the member',
          type: 'error',
        });
      },
    });
  },
});

export default RemoveGroupMemberPopup;

