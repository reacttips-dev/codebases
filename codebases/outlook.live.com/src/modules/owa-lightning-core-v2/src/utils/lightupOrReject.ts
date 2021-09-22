import type { ObservableMap } from 'mobx';
import { trace } from 'owa-trace';
import lightup from '../actions/lightup';
import { getStore } from '../store/store';
import type { LightningUnseenItem } from '../store/schema/LightningState';
import { isDeepLink } from 'owa-url';
import { LightningCategory } from '../store/schema/LightningCategory';
/**
 * Interface for LightupOrRejectState
 */
export interface LightupOrRejectState {
    lastShownId: string;
    lightedCount: number;
    unseenItems: ObservableMap<string, LightningUnseenItem>;
}

/**
 * Function to help decide whether or not we should show the callout, or reject it
 * @param id lightning id
 * @param seriesCount series count
 * @param state lightning state
 */
export default function lightupOrReject(id: string, series?: string[]): void {
    trace.info(
        `lightupOrReject - id:${id}, recurrenceCount:${series}, lightedCount:${
            getStore().lightedCount
        }, lastShown:${getStore().lastShownId}`
    );

    if (isDeepLink()) {
        trace.info('lightning is disabled for deeplink');
        return;
    }
    if (!getStore().unseenItems.has(id)) {
        return;
    }

    // We should light up if no other lightnings have shown, it is next in a series of lightnings, or it is UIFeatureCategory, or it is Compliance category
    const shouldLightup =
        !hasShownAnyLightning() ||
        isNextLightningInSeries(id, series) ||
        isUIFeatureCategory(id) ||
        isComplianceCategory(id);

    if (shouldLightup) {
        lightup(id);
    }
}

function isNextLightningInSeries(id: string, series?: string[]): boolean {
    let isNextLightning = false;
    const { lastShownId } = getStore();
    if (lastShownId) {
        if (series && !isLastShownVisible()) {
            let seq0 = series.indexOf(lastShownId);
            let seq1 = series.indexOf(id);

            if (seq0 >= 0 && seq0 + 1 == seq1) {
                isNextLightning = true;
            }
        }
    }
    return isNextLightning;
}

function hasShownAnyLightning(): boolean {
    return getStore().lastShownId ? true : false;
}

function isUIFeatureCategory(id: string): boolean {
    const unseenId = getStore().unseenItems.get(id);
    return !!unseenId && unseenId.category == LightningCategory.UIFeatureDiscovery;
}

function isComplianceCategory(id: string): boolean {
    const unseenId = getStore().unseenItems.get(id);
    return !!unseenId && unseenId.category == LightningCategory.Compliance;
}

function isLastShownVisible() {
    const { lastShownId, unseenItems } = getStore();
    return lastShownId && unseenItems.has(lastShownId) && unseenItems.get(lastShownId)!.visible;
}
