import * as React from "react";
import * as styles from "./style.css";

const AvailabilityPlaceHolder: React.FC<{}> = () => (
    <div itemScope className={styles.container}>
        <div className={styles.placeholderContainer}>
            <div className={styles.iconPlaceholder} />
            <div className={styles.availabilityContainer}>
                <div className={styles.titlePlaceholder} />
                <div className={styles.descriptionPlaceholder} />
            </div>
        </div>
    </div>
);

export default AvailabilityPlaceHolder;
