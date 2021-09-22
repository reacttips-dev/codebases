import {defineMessages} from "react-intl";
import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";

const get = makeGetMsgFunction("components.TermsAndConditions");

export default defineMessages({
    agreement: get("agreement"),
    quebec: get("quebec"),
    manufacturer: get("manufacturer"),
    geeksquad: get("geeksquad"),
});
