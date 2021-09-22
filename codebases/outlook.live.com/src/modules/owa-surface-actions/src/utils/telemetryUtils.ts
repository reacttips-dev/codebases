import type SurfaceActionItem from '../store/schema/SurfaceActionItem';
import { logUsage } from 'owa-analytics';

export function logUserAction(
    isCompose: boolean,
    action: string,
    item: SurfaceActionItem,
    defaultActionSource?: string
) {
    // The item will be null if rendered as a fabric button on the surface.
    let actionSource;

    if (defaultActionSource) {
        actionSource = defaultActionSource;
    } else {
        actionSource = 'Pinned';
        if (item?.renderedInOverflow) {
            // If the item is rendered in the overflow, it either wasn't pinned to begin with or
            // was moved to the overflow due to limited space.
            if (item.isPinned) {
                actionSource = 'Overflow';
            } else {
                actionSource = 'NotPinned';
            }
        }
    }

    logUsage(isCompose ? 'CSACountComposeUserAction' : 'CSACountReadUserAction', [
        action,
        actionSource,
    ]);
}

export function onCommandBarDataReduced(movedItem: SurfaceActionItem): void {
    // Mark each subMenu item as rendered in overflow for telemetry.
    movedItem.subMenuProps?.items?.forEach(subItem => {
        subItem.renderedInOverflow = true;
    });
}

export function onCommandBarDataGrown(movedItem: SurfaceActionItem): void {
    // Mark each subMenu item as not rendered in overflow for telemetry.
    movedItem.subMenuProps?.items?.forEach(subItem => {
        subItem.renderedInOverflow = false;
    });
}
