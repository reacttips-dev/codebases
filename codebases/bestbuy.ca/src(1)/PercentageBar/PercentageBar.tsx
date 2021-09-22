import * as React from "react";
import { useCallback } from "react";
import * as styles from "./styles.css";
export const PercentageBar = ({ className: containerClassName = styles.defaultBarClassName, givenValue = 0, totalValue = 100, }) => {
    const getPercentage = useCallback(() => ((givenValue - 0) * 100) / (totalValue - 0) + "%", [
        givenValue,
        totalValue,
    ]);
    return (React.createElement("div", { className: `${styles.barBase} ${containerClassName}`, role: "percentagebar", "aria-value-now": givenValue, "aria-value-min": "0", "aria-value-max": totalValue },
        React.createElement("div", { style: { width: getPercentage() }, className: styles.percentageContainer }),
        React.createElement("div", { className: styles.totalContainer })));
};
export default PercentageBar;
//# sourceMappingURL=PercentageBar.js.map