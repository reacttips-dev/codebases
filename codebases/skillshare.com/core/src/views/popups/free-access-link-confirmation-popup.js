import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import freeAccessLinkConfirmationPopupTemplate from 'text!core/src/templates/popups/free-access-link-confirmation-popup.mustache';

const FreeAccessLinkConfirmationPopup = AbstractPopupView.extend({

  basicPopup: true,
  template: freeAccessLinkConfirmationPopupTemplate,
  className: 'free-access-link-confirmation-popup',
});

export default FreeAccessLinkConfirmationPopup;

