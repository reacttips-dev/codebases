import { utils as adobeLaunch } from "@bbyca/adobe-launch";

export default () => {

    const Events = {
        Analytics: "analytics-event",
        DtmLoaded: "analytics-dtm-loaded",
    };

    const pageLoadEvents = ["PAGE_LOAD", "ANALYTICS_CART_LOADED"];

    const EventBufferMaxSize = 50;

    // Create a buffer of initial events so we can dispatch these events when
    // the DTM library is loaded
    const CachedEvents = [];

    const eventCacheHandler = (event) => {
        if (CachedEvents.length >= EventBufferMaxSize) {
            CachedEvents.shift();
        }

        CachedEvents.push(event);
    };

    const pushCachedEvents = () => {
        CachedEvents.forEach((cachedEv) => {
            adobeLaunch.pushEventToDataLayer(cachedEv.detail);
        });
        CachedEvents.length = 0;
    };

    const pushToDataLayer = (event) => {
        adobeLaunch.pushEventToDataLayer(event.detail);
    };

    const firstPageLoadHandler = (event) => {
        if (event && event.detail && pageLoadEvents.some((pageLoadEvent) => event.detail.event.includes(pageLoadEvent))) {
            adobeLaunch.pushEventToDataLayer(event.detail);
            pushCachedEvents();
            // change the listener to push directly to datalayer
            document.removeEventListener(Events.Analytics, firstPageLoadHandler);
            document.addEventListener(Events.Analytics, pushToDataLayer);
        } else {
            eventCacheHandler(event);
        }
    };

    const checkCacheForPageload = () => {
        let pageLoadFound = false;
        CachedEvents.forEach((event, index) => {
            if (event && event.detail && pageLoadEvents.some((pageLoadEvent) => event.detail.event.includes(pageLoadEvent))) {
                adobeLaunch.pushEventToDataLayer(event.detail);
                // remove the event in the cached events so it isnt fired twice
                CachedEvents.splice(index, 1);
                pushCachedEvents();
                pageLoadFound = true;
                document.addEventListener(Events.Analytics, pushToDataLayer);
                return;
            }
        });
        if (!pageLoadFound) {
            // change listener to look for the first pageload
            document.addEventListener(Events.Analytics, firstPageLoadHandler);
        }
        document.removeEventListener(Events.Analytics, eventCacheHandler);
    };

    const dtmLoadedHandler = () => {
        adobeLaunch.mapSessionStorageToWindow(undefined, undefined, checkCacheForPageload);
    };

    document.addEventListener(Events.Analytics, eventCacheHandler);
    document.addEventListener(Events.DtmLoaded, dtmLoadedHandler);
};
