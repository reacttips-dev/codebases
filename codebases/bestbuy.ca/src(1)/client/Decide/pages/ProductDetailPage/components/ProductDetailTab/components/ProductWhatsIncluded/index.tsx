import * as React from "react";

import * as styles from "./style.css";
import useTrackTabVisit from "hooks/useTrackVisit";

interface ProductWhatsIncludedProps {
    boxContents: string[];
    sku: string;
}

export const ProductWhatsIncluded: React.FC<ProductWhatsIncludedProps> = ({boxContents, sku}) => {
    if (!boxContents || !boxContents.length) {
        return null;
    }

    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "What's Included Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });

    return (
        <div className={styles.boxContentsContainer} ref={ref}>
            <ul className={styles.boxContents}>
                {boxContents.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductWhatsIncluded;
