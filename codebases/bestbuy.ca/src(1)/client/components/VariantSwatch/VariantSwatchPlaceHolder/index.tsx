import * as React from "react";
import * as styles from "./style.css";

const VariantSwatchPlaceHolder: React.FC<{}> = () => (
    <div className={styles.container} data-automation="variant-swatch-placeholder">
        <div className={styles.variantHeaderPlaceholder} />
        <div className={styles.swatchContainer}>
            <div className={styles.variantSwatchesPlaceholder} />
            <div className={styles.variantSwatchesPlaceholder} />
            <div className={styles.variantSwatchesPlaceholder} />
        </div>
    </div>
);

export default VariantSwatchPlaceHolder;
