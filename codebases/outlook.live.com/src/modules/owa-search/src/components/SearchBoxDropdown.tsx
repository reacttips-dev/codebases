import { observer } from 'mobx-react-lite';
import { SEARCHBOX_ANCHOR_ID } from 'owa-search-constants';
import getSearchBoxWidth from '../selectors/getSearchBoxWidth';
import type { SearchScenarioId } from 'owa-search-store';
import { Callout } from '@fluentui/react/lib/Callout';
import * as React from 'react';
import { onResize } from 'owa-search-actions';
import { getGuid } from 'owa-guid';

export interface SearchBoxDropdownProps {
    content: JSX.Element | JSX.Element[];
    id?: string;
    onDismiss?: (evt: any) => void;
    onPositioned?: () => void;
    role?: string;
    scenarioId: SearchScenarioId;
    setInitialFocus: boolean;
    targetId?: string;
}

export default observer(function SearchBoxDropdown(props: SearchBoxDropdownProps) {
    React.useEffect(() => {
        onResize(document.getElementById(getTargetId()).offsetWidth, props.scenarioId);
    }, []);
    /**
     * Gets the known width of the search box by checking the store value, or
     * directly accessing the element if the store value hasn't yet been
     * updated.
     */
    const getWidth = (scenarioId: SearchScenarioId): number => {
        return getSearchBoxWidth(scenarioId) || document.getElementById(getTargetId()).offsetWidth;
    };
    /**
     * onDismiss callback for the Callout component.
     */
    const onDismiss = (evt: unknown): void => {
        const { onDismiss } = props;
        onDismiss?.(evt);
    };
    /**
     * Gets target ID of which component is mounting on. It's an optional prop,
     * so a default case is set to the anchor div in the SearchBox component.
     */
    const getTargetId = (): string => {
        return props.targetId || SEARCHBOX_ANCHOR_ID;
    };
    // Calculates the max height of the callout based off the window height and the bottom of the target element
    const getMaxHeight = (): number => {
        const searchBoxElement = document.getElementById(getTargetId());

        // max height is the inner height of the window, minus the bottom x of the search box and 9 pixel for padding
        // 9 pixels = default minPagePadding of the callout is 8px, and 1 pixel for the border
        const maxHeight = window.innerHeight - searchBoxElement.getBoundingClientRect().bottom - 9;

        return maxHeight;
    };
    /**
     * Callback for when the Callout gets correctly positioned.
     */
    const onPositioned = (): void => {
        if (props.onPositioned) {
            props.onPositioned();
        }
    };
    const { content, scenarioId, id = getGuid(), setInitialFocus } = props;
    return (
        <Callout
            calloutWidth={getWidth(scenarioId)}
            id={id}
            onDismiss={onDismiss}
            onPositioned={onPositioned}
            setInitialFocus={setInitialFocus}
            gapSpace={1}
            calloutMaxHeight={getMaxHeight()}
            isBeakVisible={false}
            target={`#${getTargetId()}`}>
            {content}
        </Callout>
    );
});
