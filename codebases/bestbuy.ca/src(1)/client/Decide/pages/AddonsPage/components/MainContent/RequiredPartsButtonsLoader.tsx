import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import * as styles from "./styles.css";

interface Props {
    numberOfButtons: number;
}

const RequiredPartsButtonsLoader: React.FC<Props> = ({numberOfButtons}) => (
    <div className={styles.footer}>
        <LoadingSkeleton.Button width={80} className={styles.footerBtnLoader} />
        {numberOfButtons > 1 && <LoadingSkeleton.Button width={80} className={styles.footerBtnLoader} />}
    </div>
);

export default RequiredPartsButtonsLoader;
