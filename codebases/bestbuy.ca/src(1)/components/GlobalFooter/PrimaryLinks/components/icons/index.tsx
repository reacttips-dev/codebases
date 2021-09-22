import * as React from "react";
import * as styles from "./style.css";
import { Android, Apple, } from "@bbyca/bbyca-components";
/**
 * Icons should be linked to the API response in the
 * next iteratrion to give the CMS user control over
 * which icon gets displayed.
 */
var IconNames;
(function (IconNames) {
    IconNames[IconNames["android"] = 0] = "android";
    IconNames[IconNames["ios"] = 1] = "ios";
})(IconNames || (IconNames = {}));
;
const iconMap = {
    android: (React.createElement(Android, { className: styles.icon, viewBox: "0 0 24 24" })),
    ios: (React.createElement(Apple, { className: styles.icon, viewBox: "0 0 24 24" })),
};
const iconLinksMap = {
    "fp-android-app": iconMap.android,
    "fp-application-pour-android": iconMap.android,
    "fp-ios-app": iconMap.ios,
    "fp-application-pour-ios": iconMap.ios,
};
export default iconLinksMap;
//# sourceMappingURL=index.js.map