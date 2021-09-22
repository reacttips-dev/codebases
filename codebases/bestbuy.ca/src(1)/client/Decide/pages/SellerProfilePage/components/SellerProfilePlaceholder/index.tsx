import * as React from "react";
import * as styles from "./style.css";

export const SellerProfilePlaceholder = () => {
    return (
        <div className={styles.container}>
            <div className={styles.namePlaceholder} />
            <div className={styles.ratingPlaceholder} />
            <div className={styles.descriptionPlaceholder} />
            <hr className={styles.topHr} />

            <div className={styles.policyPlaceholder} />
            <hr className={styles.topHr} />

            <div className={styles.policyPlaceholder} />
            <hr className={styles.topHr} />

            <div className={styles.titlePlaceholder} />
            <div className={styles.reviewRatingPlaceholder} />
            <div className={styles.reviewPlaceholder} />
            <div className={styles.authorPlaceholder} />
            <hr className={styles.topHr} />

            <div className={styles.reviewRatingPlaceholder} />
            <div className={styles.reviewPlaceholder} />
            <div className={styles.authorPlaceholder} />
            <hr className={styles.topHr} />

            <div className={styles.reviewRatingPlaceholder} />
            <div className={styles.reviewPlaceholder} />
            <div className={styles.authorPlaceholder} />
        </div>
    );
};
