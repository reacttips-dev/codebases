import * as React from "react";

import * as styles from "./style.css";

export const SimpleProductDetailsBriefPlaceHolder = () =>
    (
        <div className={styles.container}>
            <div className={styles.productImagePlaceholder}/>
            <div className={styles.productDetailsPlaceholder}>
                <div className={styles.productTitlePlaceholder} />
                <div className={styles.reviewRatingPlaceholder} />
                <div className={styles.pricePlaceholder} />
            </div>
        </div>
    );
