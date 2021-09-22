import * as React from "react";
import * as styles from "./styles.css";
import { Step } from "./Step";
import classNames from "classnames";
export const StepIndicator = ({ children, className = "", columnDisplay = false, currentPath = "", }) => {
    if (!children) {
        return null;
    }
    const steps = React.useMemo(() => React.Children.map(children, (child, index) => {
        if (!child) {
            return;
        }
        const { to, isCurrentStep } = child.props;
        const isOnCurrentStep = isCurrentStep || to === currentPath;
        return (React.createElement(Step, Object.assign({ key: `step-${index}`, isActiveLink: !!(to && !isOnCurrentStep), isCurrentStep: isOnCurrentStep }, child.props)));
    }), [children]);
    const stepIndicatorClasses = classNames(styles.stepIndicator, className, { [styles.columnDisplay]: columnDisplay });
    return (React.createElement("div", { className: stepIndicatorClasses },
        React.createElement("ol", null, steps)));
};
export default StepIndicator;
//# sourceMappingURL=StepIndicator.js.map