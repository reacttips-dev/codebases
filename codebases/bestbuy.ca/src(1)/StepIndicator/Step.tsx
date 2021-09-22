import * as React from "react";
import * as styles from "./styles.css";
import { Link } from "../Link";
import classNames from "classnames";
export const Step = ({ to, isActiveLink = false, isCurrentStep = false, children }) => {
    if (!children) {
        return null;
    }
    const stepClasses = React.useMemo(() => classNames(styles.stepWrapper, { [styles.active]: isActiveLink }, { [styles.current]: isCurrentStep }), [isActiveLink, isCurrentStep]);
    return React.createElement("li", { className: stepClasses }, renderStepLabel(isActiveLink, children, to));
};
const createAutomationString = (children) => (typeof children === "string" ? children.toLowerCase() : "");
const renderStepLabel = (active, children, to) => active ? (React.createElement(Link, { "data-automation": createAutomationString(children), href: to, targetSelf: true, className: styles.step, ariaLabel: children }, children)) : (React.createElement("p", { className: styles.step }, children));
//# sourceMappingURL=Step.js.map