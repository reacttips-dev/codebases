import * as React from "react";
import {SpecItem} from "models";

import * as styles from "./style.css";

interface Props {
    item: SpecItem;
}

export default ({item: {name, value}}: Props) => {
    return (
        <div className={styles.itemContainer}>
            <div className={styles.itemName}>{name}</div>
            <div className={styles.itemValue}>{value}</div>
        </div>
    );
};
