import { FlexPaneTitleHeight } from 'owa-flex-pane/lib/components/FlexPaneVariables';
import { lazySubscribeToResizeEvent, lazyUnsubscribeFromResizeEvent } from 'owa-resize-event';
import { getTimePanelConfig } from 'owa-time-panel-config';
import * as React from 'react';

/**
 * We dynamically set the time panel content height here to the (innerHeight of the window) - (height of content above panel).
 * This is similar to the calculation made in `FlexPaneVariables` for contentHeight, except we use the innerHeight of the window, instead of 100vh.
 * The reason we need to do this is that [the "100vh" is not constant in mobile browsers](https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser).
 * and a parent of the panel uses vh. Without this logic to calcuate the content height based on the inner height of the window, the bottom of the
 * time panel is cut off when using an iPad.
 */
export function useAutoCorrectContentHeightRef() {
    let timePanelRef = React.useRef(null);

    const setTimePanelHeight = React.useCallback(() => {
        if (timePanelRef.current) {
            // TODO: VSO #78779 Simplify auto-correction of Time Panel height to work across all scenarios
            const height =
                window.innerHeight - FlexPaneTitleHeight - getTimePanelConfig().abovePanelHeight;
            const heightStyle = height.toString() + 'px';
            timePanelRef.current.style.height = heightStyle;
            timePanelRef.current.style.maxHeight = heightStyle;
        }
    }, [timePanelRef.current]);

    React.useEffect(setTimePanelHeight, [timePanelRef.current]);

    React.useEffect(() => {
        lazySubscribeToResizeEvent.importAndExecute(setTimePanelHeight);
        return () => lazyUnsubscribeFromResizeEvent.importAndExecute(setTimePanelHeight);
    }, []);

    return { ref: timePanelRef };
}
