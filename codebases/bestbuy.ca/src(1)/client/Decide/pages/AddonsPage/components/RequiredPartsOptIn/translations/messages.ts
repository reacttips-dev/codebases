import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("pages.AddonsPage.components.RequiredPartsOptIn");

export default defineMessages({
    requiredPartsOptInNo: get("option.no"),
    requiredPartsOptInYes: get("option.yes"),
});
