import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("pages.productDetailPage.components.warrantyOptions");

export default defineMessages({
    noPlan: get("noPlan"),
    year: get("year"),
    years: get("years"),
    warrantyConditionsLinkText: get("warrantyConditionsLinkText"),
    warrantyConditionsLink: get("warrantyConditionsLink"),
});
