import type {
    default as PopoutData,
    DeeplinkPopoutData,
    ExtractedPopoutData,
} from '../store/schema/PopoutData';
import { getStore } from '../store/parentStore';

export default function extractData(data: DeeplinkPopoutData | PopoutData): ExtractedPopoutData {
    let projectionTabId: string = null;
    let deeplinkData: DeeplinkPopoutData = undefined; // Use undefined as initial value since "null" is also a valid value of popout data
    let projectionTargetWindow: Window = null;
    let projectionParentWindow: Window = null;
    if (data) {
        if (isPopoutData(data)) {
            deeplinkData = data.deeplinkData;
            if (getStore().isAvailable) {
                projectionTabId = data.projectionTabId || null;
            }
            projectionTargetWindow = data.projectionTargetWindow;
            projectionParentWindow = data.projectionParentWindow;
        } else {
            deeplinkData = data;
        }
    }

    return {
        deeplinkCallback:
            typeof deeplinkData === 'undefined'
                ? () => Promise.resolve(<Object>null)
                : typeof deeplinkData === 'function'
                ? (deeplinkData as () => Promise<Object>)
                : () => Promise.resolve(deeplinkData),
        projectionTabId,
        projectionTargetWindow,
        projectionParentWindow,
    };
}

function isPopoutData(data: DeeplinkPopoutData | PopoutData): data is PopoutData {
    return (
        typeof (<PopoutData>data).deeplinkData != 'undefined' ||
        !!(<PopoutData>data).projectionTabId
    );
}
