import * as React from "react";
import {FormattedMessage} from "react-intl";
import {EventTypes} from "@bbyca/apex-components/dist/models";

import {ProductPrice} from "components/ProductCost/ProductPrice";
import Link from "components/Link";
import {SimpleProduct} from "models";

import {getRecommendedData, OpenBoxOfferProps} from "./getRecommendedData";
import * as styles from "./style.css";

const getLink = (data: OpenBoxOfferProps) => {
    return data.link.type === EventTypes.product ? (
        <Link
            chevronType={"right"}
            to={data.link.type}
            params={[data.product.seoName, data.link.query]}
            query={{
                icmp: "Recos_1across_pn_bx",
            }}
            className={styles.link}>
            <FormattedMessage {...data.link.messaging} />
        </Link>
    ) : (
        <Link
            chevronType={"right"}
            to={data.link.type}
            query={{
                search: data.link.query,
                icmp: "Recos_1across_pn_bx",
            }}
            className={styles.link}>
            <FormattedMessage {...data.link.messaging} />
        </Link>
    );
};

interface Props {
    products: SimpleProduct[];
    pdpIsOpenBox: boolean;
}

export const OpenBoxOfferPure: React.FC<Props> = (props) => {
    const data = getRecommendedData(props.products, props.pdpIsOpenBox);

    if (!data) {
        return null;
    }
    const dynamicLink = getLink(data);

    return (
        <div className={styles.container}>
            <FormattedMessage {...data.messaging} />
            <div className={styles.price}>
                <ProductPrice superscriptCent={false} value={data.product.priceWithEhf} size="medium" />
            </div>
            {dynamicLink}
        </div>
    );
};
