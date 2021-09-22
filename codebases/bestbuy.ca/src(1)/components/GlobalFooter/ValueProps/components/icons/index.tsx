import * as React from "react";
import * as styles from "../../style.css";
import { DeliveryIcon, LatestAndGreatest, LowestPrice, QuickStorePickup, } from "@bbyca/bbyca-components";
/**
 * Icons should be linked to the API response in the
 * next iteratrion to give the CMS user control over
 * which icon gets displayed.
 */
var IconNames;
(function (IconNames) {
    IconNames[IconNames["freeShipping"] = 0] = "freeShipping";
    IconNames[IconNames["storePickup"] = 1] = "storePickup";
    IconNames[IconNames["lowPriceGuarantee"] = 2] = "lowPriceGuarantee";
    IconNames[IconNames["latestTech"] = 3] = "latestTech";
})(IconNames || (IconNames = {}));
;
const iconMap = {
    freeShipping: (React.createElement(DeliveryIcon, { className: styles.valuePropIcon, color: "blue", viewBox: "0 0 35 30" })),
    storePickup: (React.createElement(QuickStorePickup, { className: styles.valuePropIcon, color: "blue" })),
    lowPriceGuarantee: (React.createElement(LowestPrice, { className: styles.valuePropIcon, color: "blue", viewBox: "0 0 35 30" })),
    latestTech: (React.createElement(LatestAndGreatest, { className: styles.valuePropIcon, color: "blue", viewBox: "0 0 35 30" })),
};
const iconLinksMap = {
    "vp-free-shipping-over-35": iconMap.freeShipping,
    "vp-expedition-gratuite-sur-les-commandes-de-plus-de-35": iconMap.freeShipping,
    "vp-quick-and-easy-store-pickup": iconMap.storePickup,
    "vp-ramassage-rapide-et-facile": iconMap.storePickup,
    "vp-low-price-guarantee": iconMap.lowPriceGuarantee,
    "vp-bas-prix-garanti": iconMap.lowPriceGuarantee,
    "vp-latest-and-greatest-tech": iconMap.latestTech,
    "vp-le-top-de-la-techno": iconMap.latestTech,
};
export default iconLinksMap;
//# sourceMappingURL=index.js.map