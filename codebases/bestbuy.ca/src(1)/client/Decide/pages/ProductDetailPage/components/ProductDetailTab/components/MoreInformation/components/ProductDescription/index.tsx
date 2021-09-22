import * as React from "react";

import * as styles from "./style.css";

interface ProductDescriptionProps {
    description?: string;
}

export const ProductDescription = ({description}: ProductDescriptionProps) => {
    if (!description) {
        return null;
    }

    return <div className={styles.productDescription} dangerouslySetInnerHTML={{__html: description}}></div>;
};

export default ProductDescription;
