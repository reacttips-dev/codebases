import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {LinkEventProps} from "@bbyca/apex-components";

import Link from "components/Link";
import SectionTitle from "components/SectionTitle";

import * as styles from "./style.css";
import messages from "./translations/messages";
import {ReturnPolicySpecs} from "./ReturnPolicySpecs";
import useTrackTabVisit from "hooks/useTrackVisit";

export const productReturnPolicyMessages = messages;

export interface ProductReturnPolicyProps extends InjectedIntlProps {
    overwrite: ReturnPolicyOverwrite;
    withTitle: boolean;
    sku: string;
}

export interface ReturnPolicyOverwrite {
    type?: string;
    title?: string;
    productCategory: string;
    returnExchangePeriod: string;
    condition: string;
    returnDisclaimer: string;
    event?: LinkEventProps;
}

export type ProductReturnPolicyContainerProps = Omit<ProductReturnPolicyProps, "overwrite"> & {
    children?: React.ReactElement | React.ComponentType;
};

export const ProductReturnPolicyContainer: React.FC<ProductReturnPolicyContainerProps> = ({
    withTitle,
    intl,
    children,
}) => (
    <>
        {withTitle && <SectionTitle>{intl.formatMessage(messages.title)}</SectionTitle>}
        {children}
    </>
);

export type ProductReturnPolicyContentProps = Omit<ProductReturnPolicyProps, "overwrite">;

export const ProductReturnPolicyContent: React.FC<ProductReturnPolicyContentProps> = ({withTitle, intl}) => {
    const returnLink = (
        <Link to="returnPolicy" query={{icmp: "mdot_returnPolicy"}}>
            {intl.formatMessage(messages.returnContent)}
        </Link>
    );

    return (
        <ProductReturnPolicyContainer withTitle={withTitle} intl={intl}>
            <div className={styles.container}>
                <FormattedMessage {...messages.content} values={{return: returnLink}} />
            </div>
        </ProductReturnPolicyContainer>
    );
};

export const ProductReturnPolicyOverwrite: React.FC<ProductReturnPolicyProps> = ({withTitle, overwrite, intl}) => {
    return (
        <ProductReturnPolicyContainer withTitle={withTitle} intl={intl}>
            <ReturnPolicySpecs overwrite={overwrite} intl={intl} />
        </ProductReturnPolicyContainer>
    );
};

export const ProductReturnPolicy: React.FC<ProductReturnPolicyProps> = (props) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku: props.sku,
            customLink: "Return Policy Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });

    return (
        <div ref={ref}>
            {!props.overwrite ? <ProductReturnPolicyContent {...props} /> : <ProductReturnPolicyOverwrite {...props} />}
        </div>
    );
};

export default injectIntl<ProductReturnPolicyProps>(ProductReturnPolicy);
