import Common from 'core/src/common';
import PopoverView from 'core/src/views/modules/popover';

const AttachmentsPopover = PopoverView.extend({

  autoPosition: false,

  events: {
    'click .attachment-link': 'onAttachmentClick',
  },

  afterRender: function() {
    Common.initRestrictedAccessHandlers(this);
    PopoverView.prototype.afterRender.apply(this, arguments);
  },

  onAttachmentClick: function(ev) {
    ev.stopPropagation();
  },

});

export default AttachmentsPopover;

