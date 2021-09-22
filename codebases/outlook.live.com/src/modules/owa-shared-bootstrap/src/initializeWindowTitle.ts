/* tslint:disable:forbid-import */
// Effectively we're treating the window title as a UI element here; however,
// there's no way to put @observer on the window title, so we need to use
// autorun() to observe and react to the state change.
import { autorun } from 'mobx';
/* tslint:enable:forbid-import */

export default function initializeWindowTitle(getWindowTitle: () => string) {
    autorun(() => {
        document.title = getWindowTitle();
    });
}
