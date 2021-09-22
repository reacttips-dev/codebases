import * as React from "react";
import * as styles from "./style.css";
import useTrackTabVisit from "hooks/useTrackVisit";

export interface Props {
    children?: JSX.Element | React.Component;
    sku: string;
    customLink: string;
}

export const SellerPolicy: React.FC<Props> = ({children, customLink, sku}: Props) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink,
        },
        event: "PDP_TAB_IMPRESSION",
    });
    return (
        <div className={styles.sellerPolicy} ref={ref}>
            {children}
        </div>
    );
};

export default SellerPolicy;
