import * as React from "react";

import * as styles from "./style.css";

export interface VariantHeaderProp {
    label: string;
    text: string;
    variantDisplayType: string;
    variantType: string;
}

export const VariantHeader: React.FC<VariantHeaderProp> = ({label, text, variantDisplayType, variantType}) => {
    // remove space in variant type value
    const type = variantDisplayType.replace(/\s+/g, "");

    return (
        <h3 className={styles.header} data-automation={`variant-header-${type}-${variantType}`}>
            {label}
            <span className={styles.variantValue}>{`: ${text}`}</span>
        </h3>
    );
};
