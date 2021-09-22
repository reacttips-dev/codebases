import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import * as styles from "./styles.css";

const WarrantyOptionsLoader: React.FC = () => {
    return (
        <div className={styles.warrantyBoxContainer}>
            <LoadingSkeleton.Button />
        </div>
    );
};

WarrantyOptionsLoader.displayName = "WarrantyOptionsLoader";

export default WarrantyOptionsLoader;
