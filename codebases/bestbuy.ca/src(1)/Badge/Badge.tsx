import classNames from "classnames";
import * as React from "react";
import * as styles from "./style.css";
export const defaultTranslations = {
    en: {
        BLACK_FRIDAY: "Black Friday Top Deal",
        BLACK_FRIDAY_EARLY: "Black Friday Price Now",
        BLACK_FRIDAY_EXT: "New Black Friday Deal",
        BOXING_DAY: "Boxing Day Top Deal",
        BOXING_DAY_EARLY: "Boxing Day Price Now",
        CLEARANCE: "Clearance",
        ENDS_SUNDAY: "Ends Sunday",
        NEW_DEAL_ADDED: "New Deal Added",
        TODAY_ONLY: "Today Only",
    },
    fr: {
        BLACK_FRIDAY: "Aubaine du Vendredi fou",
        BLACK_FRIDAY_EARLY: "Aubaine du Vendredi fou",
        BLACK_FRIDAY_EXT: "Aubaine du Vendredi fou",
        BOXING_DAY: "Aubaine d’après Noël",
        BOXING_DAY_EARLY: "Aubaine d’après Noël",
        CLEARANCE: "En liquidation",
        ENDS_SUNDAY: "Prend fin dimanche",
        NEW_DEAL_ADDED: "Nouvelle aubaine ajoutée",
        TODAY_ONLY: "Aujourd’hui seulement",
    },
};
export var BadgeTypes;
(function (BadgeTypes) {
    BadgeTypes["BLACK_FRIDAY"] = "BLACK_FRIDAY";
    BadgeTypes["BLACK_FRIDAY_EARLY"] = "BLACK_FRIDAY_EARLY";
    BadgeTypes["BLACK_FRIDAY_EXT"] = "BLACK_FRIDAY_EXT";
    BadgeTypes["BOXING_DAY_EARLY"] = "BOXING_DAY_EARLY";
    BadgeTypes["BOXING_DAY"] = "BOXING_DAY";
    BadgeTypes["CLEARANCE"] = "CLEARANCE";
    BadgeTypes["ENDS_SUNDAY"] = "ENDS_SUNDAY";
    BadgeTypes["NEW_DEAL_ADDED"] = "NEW_DEAL_ADDED";
    BadgeTypes["TODAY_ONLY"] = "TODAY_ONLY";
})(BadgeTypes || (BadgeTypes = {}));
export const Badge = ({ title, className, type = "", locale = "en", translations = defaultTranslations, }) => {
    const badgeWrpClass = classNames(styles.badgeWrp, className);
    locale = locale.startsWith("fr") ? "fr" : "en";
    translations = !translations || !translations[locale] ? defaultTranslations : translations;
    if (!type && !title && !translations[locale][type]) {
        return null;
    }
    return (React.createElement("div", { className: badgeWrpClass, "data-automation": "promo-badge" },
        React.createElement("div", { className: styles.badge }, String(title || translations[locale][type]).trim())));
};
export default Badge;
//# sourceMappingURL=Badge.js.map