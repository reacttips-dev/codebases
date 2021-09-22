import { EventTypes } from "../../models";
import { LinkEvent } from "../linkEvent";
export const eventTypeToKey = {
    brand: "brand",
    brandstore: "brandStore",
    careers: "careers",
    category: "category",
    collection: "collection",
    corporate: "corporate",
    facet: "category",
    help: "help",
    homepage: "homepage",
    marketing: "eventMarketing",
    product: "product",
    search: "search",
    services: "services",
};
export const buildLinkProps = (event, isMobileApp) => {
    if (!event.eventType || event.eventType === EventTypes.externalUrl || !!isMobileApp) {
        return {
            external: true,
            href: new LinkEvent(event).toHref(),
        };
    }
    else if (event.eventType === EventTypes.internalUrl) {
        return {
            internalUrl: true,
            href: event.url
        };
    }
    else {
        return {
            params: event.seoText && event.eventId ? [event.seoText, event.eventId] : [event.eventId],
            query: event.query,
            to: eventTypeToKey[event.eventType],
        };
    }
    ;
};
//# sourceMappingURL=index.js.map