import { getTimePanelDndPivotTabId } from '../utils/getTimePanelDndPivotTabId';
import { IPivotProps, Pivot } from '@fluentui/react/lib/Pivot';
import * as React from 'react';

export type TimePanelDndPivotProps = { children?: React.ReactNode } & Omit<IPivotProps, 'getTabId'>;

/**
 * Component wrapper for `Pivot` that assigns predictable element IDs to the children `PivotItem` components
 * based on each child's `itemKey` prop.
 *
 * This allows `TimePanelDndView` to provide the "secondary" drop hint with a reference to the currently
 * unselected `PivotItem` by reconstructing its element ID from the `itemKey` value, which allows the beak
 * to be correctly positioned pointing at the horizontal center of the unselected `PivotItem` (to handle
 * dynamic concerns such as localization of the pivot strings).
 */
export default function TimePanelDndPivot(props: TimePanelDndPivotProps) {
    const { children, ...pivotProps } = props;
    return (
        <Pivot getTabId={getTimePanelDndPivotTabId} {...pivotProps}>
            {children}
        </Pivot>
    );
}
