import { getTimePanelSource } from '../selectors/timePanelStoreSelectors';
import { getFirstFocusable } from '@fluentui/react/lib/Utilities';
import * as React from 'react';

/**
 * We conditionally set autofocus on the first focusable child of the Time Panel header bar when the panel has been opened by intentional user action.
 *
 * The autofocus is delayed by 500ms to allow sufficient time for the flex panel animation to finish, as otherwise the focus will not work as expected.
 */
export function useAutoFocusRef() {
    const ref = React.useRef(null);
    const source = getTimePanelSource();

    React.useEffect(() => {
        if (ref.current && source !== 'AutoOpen') {
            window.setTimeout(() => {
                getFirstFocusable(
                    ref.current,
                    ref.current,
                    true /*includeElementsInFocusZones*/
                )?.focus();
            }, 500);
        }
    }, [ref.current]);

    return { ref };
}
