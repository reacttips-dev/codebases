import * as React from "react";

import * as styles from "./style.css";

export const VerificationPlaceHolder = () =>
    (
        <div className={styles.container}>
            <div className={styles.verificationPlaceholder}>
                <div className={styles.titlePlaceholder} />
                <div className={styles.paragraphPlaceholder} />
                <div className={styles.linkPlaceholder} />
            </div>
        </div>
    );
