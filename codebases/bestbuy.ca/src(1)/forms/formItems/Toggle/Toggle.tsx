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
import FormItem from "../FormItem";
import * as styles from "./styles.css";
export const Toggle = (_a) => {
    var { isToggleOn, name, helperTxt, handleSyncChange, handleAsyncChange, label, error, errorMsg } = _a, extraAttrs = __rest(_a, ["isToggleOn", "name", "helperTxt", "handleSyncChange", "handleAsyncChange", "label", "error", "errorMsg"]);
    const [isToggled, setIsToggled] = React.useState(!!isToggleOn);
    React.useEffect(() => {
        setIsToggled(!!isToggleOn);
    }, [isToggleOn]);
    const handleToggleChange = (e) => {
        const newToggledState = !isToggled;
        const callback = handleAsyncChange || handleSyncChange;
        if (typeof callback == "function") {
            callback(e.currentTarget.name, newToggledState ? "checked" : "");
        }
        setIsToggled(newToggledState);
    };
    return (React.createElement("div", { className: `${error ? "validation-error" : ""} ${styles.bbycaFormToggle}` },
        React.createElement("label", { htmlFor: name, className: `x-toggle-switch ${styles.toggleSwitch}` },
            React.createElement("span", { className: `${styles.toggleLabel} ${label ? styles.labelMargin : ""}` }, label),
            React.createElement("input", Object.assign({ type: "checkbox", name: name, id: name, onChange: handleToggleChange, value: isToggled ? "checked" : "", checked: isToggled }, extraAttrs)),
            React.createElement("span", { className: `x-switch ${styles.switch}` })),
        React.createElement("div", { className: "highlight" })));
};
export default FormItem({ showLabel: false })(Toggle);
//# sourceMappingURL=Toggle.js.map