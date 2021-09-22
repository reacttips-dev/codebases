import * as React from "react";
import { CheckmarkAnimated } from "../SvgIcons";
const SuccessConfirmation = ({ children, className = "" }) => {
    return (React.createElement("div", { className: className },
        React.createElement(CheckmarkAnimated, null),
        children));
};
export default SuccessConfirmation;
//# sourceMappingURL=SuccessConfirmation.js.map