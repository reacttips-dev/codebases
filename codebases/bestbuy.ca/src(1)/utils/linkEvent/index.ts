import { EventTypes } from "../../models";
import { copyObjectByKeys, urlBuilder } from "../builders";
import routeManager from "../routeManager";
export class LinkEvent {
    constructor(params = { eventType: EventTypes.product }) {
        this.url = this.buildUrl(params);
    }
    toHref() {
        return this.url;
    }
    buildUrl(params) {
        const { eventType, eventId, seoText, language, url, query } = params;
        switch (eventType) {
            case EventTypes.search:
                return urlBuilder.internal(routeManager.getPathByKey(language, "search"), copyObjectByKeys(query, ["sort", "search", "path", "icmp"]));
            case EventTypes.category:
            case EventTypes.facet:
                return urlBuilder.internal(routeManager.getPathByKey(language, "category", seoText, eventId), query);
            case EventTypes.product:
                return urlBuilder.internal(routeManager.getPathByKey(language, "product", seoText, eventId), query);
            case EventTypes.collection:
                return urlBuilder.internal(routeManager.getPathByKey(language, "collection", seoText, eventId), query);
            case EventTypes.marketing:
                return urlBuilder.internal(routeManager.getPathByKey(language, "eventMarketing", seoText, eventId), query);
            case EventTypes.brandstore:
                return urlBuilder.internal(routeManager.getPathByKey(language, "brandStore", seoText, eventId), query);
            case EventTypes.help:
                return urlBuilder.internal(routeManager.getPathByKey(language, "help", seoText, eventId), query);
            case EventTypes.corporate:
                return urlBuilder.internal(routeManager.getPathByKey(language, "corporate", seoText, eventId), query);
            case EventTypes.services:
                return urlBuilder.internal(routeManager.getPathByKey(language, "services", seoText, eventId), query);
            case EventTypes.careers:
                return urlBuilder.internal(routeManager.getPathByKey(language, "careers", seoText), query);
            case EventTypes.externalUrl:
                return urlBuilder.external(url, query);
            case EventTypes.brand:
                return urlBuilder.internal(routeManager.getPathByKey(language, "brand", seoText, eventId), query);
            /**
             * todo: Flyer is now depreciated and can be removed
             * once all we know all internal links to the flyer
             * have been removed
             *  */
            case EventTypes.flyer:
                return urlBuilder.internal(routeManager.getPathByKey(language, "collection", seoText, "16074"), query);
            case EventTypes.homepage:
                return urlBuilder.internal(routeManager.getPathByKey(language, "homepage"));
            default:
                return "";
        }
    }
}
//# sourceMappingURL=index.js.map