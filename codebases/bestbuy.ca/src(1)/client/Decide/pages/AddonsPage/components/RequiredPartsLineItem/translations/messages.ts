import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("pages.AddonsPage.components.RequiredPartsLineItem");

export default defineMessages({
    requiredPart: get("requiredPart"),
    requiredPartsOptInNo: get("requiredPartsOptIn.no"),
    requiredPartsOptInYes: get("requiredPartsOptIn.yes"),
});
