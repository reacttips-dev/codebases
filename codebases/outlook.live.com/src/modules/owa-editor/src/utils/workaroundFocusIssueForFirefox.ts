import { isBrowserFirefox } from 'owa-user-agent';

let textbox: HTMLInputElement;

/**
 * There's an issue in firefox that focus will be invisible after a Fabric dialog box is shown if focus was in editor originally
 * To workaround this issue, we insert a hidden textbox and let it grab the focus before showing dialog box
 */
const workaroundFocusIssueForFirefox = isBrowserFirefox()
    ? (document?: Document) => {
          if (!textbox && document) {
              textbox = document.createElement('input');
              textbox.type = 'textbox';
              textbox.style.width = '0';
              textbox.style.height = '0';
              document.body.appendChild(textbox);
          }

          textbox.style.display = '';
          textbox.focus();
          textbox.style.display = 'none';
      }
    : () => {};

export default workaroundFocusIssueForFirefox;
