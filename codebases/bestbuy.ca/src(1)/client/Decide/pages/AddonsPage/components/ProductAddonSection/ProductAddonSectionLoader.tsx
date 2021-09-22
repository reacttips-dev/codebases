import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import * as styles from "../../styles.css";

const ProductAddonSectionLoader: React.FC = () => {
    return (
        <div className={styles.productAddonSecion}>
            <LoadingSkeleton.Title width={200} />
            <LoadingSkeleton.Title width={350} />
        </div>
    );
};

ProductAddonSectionLoader.displayName = "ProductAddonSectionLoader";

export default ProductAddonSectionLoader;
