import * as React from "react";
import {Expandable, DisplayLimitTable} from "@bbyca/bbyca-components";
import {InjectedIntlProps, injectIntl} from "react-intl";

import {BundleProduct, Specs} from "models";

import ProductSpecs, {getProductSpecElements} from "../ProductSpecs";
import messages from "./translations/messages";
import * as styles from "./style.css";
import withWarrantySpecs from "../../withWarrantySpecs";
import ConstituentContainer, {ConstituentContainerProps} from "../../ConstituentContainer";
import useTrackTabVisit from "hooks/useTrackVisit";

export interface ConstituentExpandableProductSpecsProps extends ConstituentContainerProps, InjectedIntlProps {
    totalRows: number;
    specs: Specs;
    warrantySpecs?: Specs;
}

export const ConstituentExpandableProductSpecs: React.FC<ConstituentExpandableProductSpecsProps> = ({
    totalConstituents,
    totalRows,
    specs,
    intl,
    index,
    warrantySpecs,
    productImage,
    name,
    sku,
}) => {
    const headerText = intl.formatMessage(messages.specsExpandableShowMoreDetails);
    const toggleHeaderText = intl.formatMessage(messages.specsExpandableShowLessDetails);
    return (
        <ConstituentContainer
            productImage={productImage}
            name={name}
            sku={sku}
            totalConstituents={totalConstituents}
            index={index}
            className={"detailsAndSpecs"}>
            <Expandable
                key={`constituent-expandable-product-specs-${index}`}
                variant="compact"
                direction="up"
                className={styles.showMoreDetailsToggle}
                headerText={headerText}
                toggleHeaderText={toggleHeaderText}
                dataAutomation={`pdp-bundle-product-specs-expandable-btn-${index}`}>
                <DisplayLimitTable limitRows={totalRows} className={styles.showMoreDetailsBody}>
                    {getProductSpecElements({...specs, ...warrantySpecs})}
                </DisplayLimitTable>
            </Expandable>
        </ConstituentContainer>
    );
};

export interface ConstituentProductSpecsProps extends ConstituentContainerProps {
    specs: Specs;
    warrantySpecs?: Specs;
}

export const ConstituentProductSpecs: React.FC<ConstituentProductSpecsProps> = ({
    totalConstituents,
    specs,
    index,
    warrantySpecs,
    productImage,
    name,
    sku,
}) => {
    const mergedSpecs = {...specs, ...warrantySpecs};
    return (
        <ConstituentContainer
            productImage={productImage}
            sku={sku}
            name={name}
            totalConstituents={totalConstituents}
            index={index}
            className={"detailsAndSpecs"}>
            <ProductSpecs specs={mergedSpecs} />
        </ConstituentContainer>
    );
};

export interface ConstituentDetailsAndSpecsProps {
    warrantySpecs: Specs;
    bundleProducts: BundleProduct[];
    totalRows?: number;
}

export const getSpecsItemsCount = (specs: Specs = {}) => {
    let totalSpecItems = 0;
    Object.keys(specs).forEach((key: string) => (totalSpecItems += specs[key].length));
    return totalSpecItems;
};

export const ConstituentDetailsAndSpecs: React.FC<ConstituentDetailsAndSpecsProps> = ({
    warrantySpecs,
    bundleProducts,
    totalRows = 10,
}) => {
    const bundleProductSpecs = bundleProducts
        .map((constituent: BundleProduct, index) => {
            const totalSpecsItems = getSpecsItemsCount({...constituent.specs, ...warrantySpecs});

            const props = {
                productImage: constituent.productImage,
                name: constituent.name,
                sku: constituent.sku,
                index,
                key: index,
                specs: constituent.specs,
                warrantySpecs,
                totalConstituents: bundleProducts.length,
            };

            if (totalSpecsItems > totalRows) {
                const InjectedIntlConsitutentExpandable = injectIntl(ConstituentExpandableProductSpecs);
                return <InjectedIntlConsitutentExpandable key={index} totalRows={totalRows} {...props} />;
            }
            return <ConstituentProductSpecs key={index} {...props} />;
        })
        .filter(Boolean);

    if (bundleProductSpecs.length === 0) {
        return null;
    }

    return <>{bundleProductSpecs}</>;
};

export interface DetailsAndSpecsProps extends InjectedIntlProps {
    isBundle: boolean;
    bundleProducts: BundleProduct[];
    specs: Specs;
    warrantySpecs: Specs;
    totalRows?: number;
    sku: string;
}

export const DetailsAndSpecs: React.FC<DetailsAndSpecsProps> = ({
    isBundle,
    bundleProducts,
    warrantySpecs,
    specs,
    totalRows,
    sku,
}) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "Details Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });

    return (
        <div ref={ref}>
            {isBundle ? (
                <ConstituentDetailsAndSpecs
                    warrantySpecs={warrantySpecs}
                    bundleProducts={bundleProducts}
                    totalRows={totalRows}
                />
            ) : (
                <ProductSpecs specs={{...specs, ...warrantySpecs}} />
            )}
        </div>
    );
};

export default withWarrantySpecs(DetailsAndSpecs);
