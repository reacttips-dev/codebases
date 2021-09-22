import * as React from "react";
import * as styles from "./style.css";

export default (props) => {
    return (
        <div className={styles.facetFilterPlaceholderContainer}>
            <div className={styles.facetFilterPlaceholder} />
            <div className={styles.facetFilterPlaceholder} />
            <div className={styles.facetFilterPlaceholder} />
        </div>
    );
};
