import * as React from "react";
import {FormattedMessage} from "react-intl";

import * as styles from "./style.css";
import messages from "./translations/messages";
import useTrackTabVisit from "hooks/useTrackVisit";

export const bundleReturnPolicyMessages = messages;

export interface BundleReturnPolicyProps {
    sku: string;
}

export const BundleReturnPolicy: React.FC<BundleReturnPolicyProps> = ({sku}) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "Return Policy Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });

    return (
        <p className={styles.bundleReturnPolicy} ref={ref}>
            <FormattedMessage {...messages.content} />
        </p>
    );
};

export default BundleReturnPolicy;
