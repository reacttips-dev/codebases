import {defineMessages} from "react-intl";
import makeGetMsgFunction from "../../../../utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("product.containers.pdpPage");

export default defineMessages({
    backButton: get("backButton"),
    modelNumber: get("modelNumber"),
    overview: get("overview"),
    ratings: get("ratings"),
    seeAllVendors: get("seeAllVendors"),
    soldByBestBuy: get("soldByBestBuy"),
    title: get("title"),
    webCode: get("webCode"),
    productDetails: get("productDetails"),
});
