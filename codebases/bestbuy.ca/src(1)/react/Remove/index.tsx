var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
import { injectIntl } from "react-intl";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export const Remove = (props) => {
    const { intl, className, onRemove } = props, restOfProps = __rest(props, ["intl", "className", "onRemove"]);
    return (React.createElement("button", Object.assign({ className: `${styles["remove-item"]} ${className ? className : ""}`, onClick: onRemove, type: "button" }, restOfProps), intl.formatMessage(messages.remove)));
};
export default injectIntl(Remove);
//# sourceMappingURL=index.js.map