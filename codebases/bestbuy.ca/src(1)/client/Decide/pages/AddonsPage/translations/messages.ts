import {defineMessages, FormattedMessage} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("pages.AddonsPage");

const messages: {[key: string]: FormattedMessage.MessageDescriptor} = defineMessages({
    backToCart: get("backToCart"),
    brandNewParts: get("brandNewParts"),
    continueShopping: get("continueShopping"),
    goToCart: get("goToCart"),
    header: get("header"),
    itemAdded: get("itemAdded"),
    partsYouNeed: get("partsYouNeed"),
    productProtection: get("productProtection"),
    forDeliveryDay: get("forDeliveryDay"),
    youMightAlsoNeed: get("youMightAlsoNeed"),
    errorAddWarranty: get("errors.errorAddWarranty"),
    errorFallbackMessage: get("errors.fallbackMessage"),
    errorLoadCart: get("errors.errorLoadCart"),
    errorRemoveItem: get("errors.errorRemoveItem"),
    errorRemoveWarranty: get("errors.errorRemoveWarranty"),
    errorUpdateQuantity: get("errors.errorUpdateQuantity"),
});

export default messages;
