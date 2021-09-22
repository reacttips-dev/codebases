import * as React from "react";

import {classname} from "utils/classname";

import * as styles from "./style.css";

export interface ChildProductHeader {
    className?: string;
    dataAutomation?: string;
    icon?: React.ReactNode;
    header: React.ReactNode | string;
    subheader?: React.ReactNode | string;
}

const ChildProductHeader: React.FC<ChildProductHeader> = ({
    className = "",
    dataAutomation,
    icon,
    header,
    subheader,
}) => {
    const config = {
        className: classname([styles.container, className]),
        ...(dataAutomation ? {"data-automation": dataAutomation} : {}),
    };
    return (
        <header {...config}>
            {icon && <div className={styles.logoContainer}>{icon}</div>}
            <p className={styles.title}>{header}</p>
            {subheader && <p className={styles.subHeader}>{subheader}</p>}
        </header>
    );
};

export default ChildProductHeader;
