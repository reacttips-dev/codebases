import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("pages.productDetailPage.components.warrantyBenefits");

export default defineMessages({
    benefits: get("benefits"),
    okay: get("okay"),
    gsp: get("gsp"),
    grp: get("grp"),
});
