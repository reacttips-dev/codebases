import * as React from "react";
import classnames from "classnames";
import * as styles from "./styles.css";
const StyledTable = ({ className, children, stripesStyle = "odd" }) => {
    const stripeStyle = stripesStyle === "even" ? styles.evenStripes : styles.oddStripes;
    return React.createElement("table", { className: classnames([styles.table, className, stripeStyle]) }, children);
};
export default StyledTable;
//# sourceMappingURL=StyledTable.js.map