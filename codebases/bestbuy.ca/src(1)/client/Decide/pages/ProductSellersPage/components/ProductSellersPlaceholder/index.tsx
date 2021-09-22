import * as React from "react";

import ProductSellerPlaceholder from "../ProductSellerPlaceholder";
import * as styles from "./style.css";

export default (props) => {
    const offers = new Array(5).fill({}).map((el, index) => <ProductSellerPlaceholder key={index} />);

    return (
        <React.Fragment>
            <div className={styles.productPlaceholder}>
                <div className={styles.productImagePlaceholder} />
                <div className={styles.productNamePlaceholder} />
            </div>
            {offers}
        </React.Fragment>
    );
};
