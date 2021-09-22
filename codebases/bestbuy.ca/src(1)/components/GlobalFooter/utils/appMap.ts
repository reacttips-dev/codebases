/*
 * todo: this logic should be updated so we have a more robust way to
 * determine the app. There is a possibility here that we update the
 * ID in the CMS and prevent these external links from working
 */
export const appMap = {
    "fp-order-status": "orders",
    "fp-etat-de-la-commande": "orders",
    "fp-manage-account": "accounts",
    "fp-gestion-de-compte": "accounts",
    "fp-email-preferences": "accounts",
    "fp-preferences-de-courriel": "accounts",
};
export const getLinkApp = (path = "") => path in appMap ? appMap[path] : "ecomm-webapp";
//# sourceMappingURL=appMap.js.map