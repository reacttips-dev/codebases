import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";
import * as styles from "./style.css";

export default () => (
    <div className={styles.contentLoadingContainer}>
        <LoadingSkeleton.Banner className={styles.loadingBanner} />
        <LoadingSkeleton.Title className={styles.loadingTitle} width={800} />
        <LoadingSkeleton.Line className={styles.loadingContent1} />
        <LoadingSkeleton.Line className={styles.loadingContent2} />
        <LoadingSkeleton.Line className={styles.loadingContent3} />
        <LoadingSkeleton.Line className={styles.loadingContent1} />
        <LoadingSkeleton.Line className={styles.loadingContent4} />
        <LoadingSkeleton.Line className={styles.loadingContent5} />
        <LoadingSkeleton.Button width={300} />
    </div>
);
