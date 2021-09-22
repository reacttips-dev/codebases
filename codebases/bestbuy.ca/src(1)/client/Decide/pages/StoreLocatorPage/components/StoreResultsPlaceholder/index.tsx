import * as React from "react";

import * as styles from "./style.css";

export const StoreResultsPlaceholder = () =>
    (
        <div className={styles.container}>
            <div className={styles.listTitlePlaceholder}></div>
            <div className={styles.listItemPlaceholder}></div>
            <div className={styles.listItemPlaceholder}></div>
            <div className={styles.listItemPlaceholder}></div>
        </div>
    );
