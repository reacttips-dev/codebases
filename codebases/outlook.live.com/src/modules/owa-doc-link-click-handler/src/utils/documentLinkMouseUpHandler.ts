import logSharePointLinkClick from './logSharePointLinkClick';
import { MOUSE_MIDDLE_BUTTON, MOUSE_RIGHT_BUTTON } from './constants';

export default function documentLinkMouseUpHandler(
    ev: MouseEvent,
    isSafeLinkWrapped: boolean,
    isSafeLinkVerified: boolean
) {
    if (ev.button === MOUSE_MIDDLE_BUTTON) {
        // Mouse middle button click on a SharePoint link
        // This will open a new tab but not going through the regular click handler
        logSharePointLinkClick('MouseMiddleButton', isSafeLinkWrapped, isSafeLinkVerified);
    } else if (ev.button === MOUSE_RIGHT_BUTTON) {
        // Mouse right button click on a SharePoint link
        // This will open the brower's context menu
        // we have no way to track what the user is going to do with the context menu
        logSharePointLinkClick('MouseRightButton', isSafeLinkWrapped, isSafeLinkVerified);
    }
}
