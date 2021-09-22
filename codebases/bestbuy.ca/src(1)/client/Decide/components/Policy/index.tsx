import * as React from "react";

import * as styles from "./style.css";

export interface PolicyProps {
    html: string;
}

export function Policy(props: PolicyProps) {
    return <div className={styles.policy} dangerouslySetInnerHTML={{ __html: props.html }} />;
}

Policy.displayName = "Policy";
