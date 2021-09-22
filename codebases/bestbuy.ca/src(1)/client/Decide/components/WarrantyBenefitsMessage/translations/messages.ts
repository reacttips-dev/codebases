import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("components.WarrantyBenefitsMessage");

export default defineMessages({
    pspTitle: get("pspTitle"),
    pspBody: get("pspBody"),
    prpTitle: get("prpTitle"),
    prpBody: get("prpBody"),
    termsLinkText: get("termsLinkText"),
    geekSquadProtectionLink: get("geekSquadProtectionLink"),
});
