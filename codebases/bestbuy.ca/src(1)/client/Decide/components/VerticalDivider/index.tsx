import * as React from "react";

import * as styles from "./style.css";

interface Props {
    className?: string;
}

const VerticalDivider = (props: Props) => {
    return (
        <div className={`${styles.verticalDivider} ${props.className ? props.className : ""}`} />
    );
};

export default VerticalDivider;
