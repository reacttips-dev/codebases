import * as React from "react";

import * as styles from "./style.css";

export default (props) => {

        return(
            <div className={styles.offerPlaceholder}>
                <div className={styles.pricePlaceholder} />
                <div className={styles.sellerNamePlaceholder}/>
                <div className={styles.sellerReviewPlaceholder}/>
                <div className={styles.sellerProfilePlaceholder}/>
                <div className={styles.addToCartPlaceholder} />
            </div>);

};
