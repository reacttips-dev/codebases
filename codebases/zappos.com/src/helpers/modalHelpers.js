import { modalOverlay } from 'styles/components/landing/melodyPromoGroup.scss';
export const handleOverlayAfterSubmission = clickHandler => {
  // There is a bug in the code of ReactModal that returns the focus to the parent page after form submission, which
  // Changes tab index and makes it so it takes two clicks on the overlay to dismiss the modal. Here we manually set the tab
  // index back to the modal, and assign the close function directly in an event listener to ensure 1-click close
  const overlay = document.querySelector(`.${modalOverlay}`);
  if (overlay) {
    overlay.firstChild.focus();
    overlay.addEventListener('click', e => {
      clickHandler(e);
    });
  }
};
