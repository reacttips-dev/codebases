import * as React from "react";
import {InjectedIntlProps} from "react-intl";

import {SpecItem, Offer, BundleProduct, Specs} from "models";
import formatWarrantyText from "utils/warrantyText";

import messages from "./translations/messages";

export interface Props extends InjectedIntlProps {
    offer: Offer;
    bundleProducts: BundleProduct[];
    specs: Specs;
    isMarketplace: boolean;
    isBundle: boolean;
    sku: string;
}

export interface WrappedComponentProps extends Omit<Props, "offer" | "isMarketplace"> {
    warrantySpecs: Specs;
}

const withWarrantySpecs = (Component: React.ComponentType<WrappedComponentProps>): React.ComponentType<Props> => (
    props,
) => {
    const {offer, intl, isMarketplace, isBundle, specs, bundleProducts, sku} = props;
    const warrantySpecs = {};

    if (offer && offer.warranty) {
        const warranty = offer.warranty;
        const warranties: SpecItem[] = [];
        const {formatMessage} = intl;

        if (warranty.parts > 0) {
            const partsHeader = isMarketplace
                ? formatMessage(messages.WarrantyPartsTitleMarketPlace)
                : formatMessage(messages.WarrantyPartsTitle);

            warranties.push({name: partsHeader, value: formatWarrantyText(warranty.parts, intl)} as SpecItem);
        }

        const labour: number = Math.max(warranty.labourCarryIn, warranty.labourOnSite);
        if (labour > 0) {
            const labourHeader = isMarketplace
                ? formatMessage(messages.WarrantyLabourTitleMarketPlace)
                : formatMessage(messages.WarrantyLabourTitle);

            warranties.push({name: labourHeader, value: formatWarrantyText(labour, intl)} as SpecItem);
        }

        if (warranties.length > 0) {
            const warrantyHeader = formatMessage(messages.WarrantyHeader);
            warrantySpecs[warrantyHeader] = warranties;
        }
    }

    return (
        <Component
            intl={intl}
            isBundle={isBundle}
            bundleProducts={bundleProducts}
            specs={specs}
            warrantySpecs={warrantySpecs}
            sku={sku}
        />
    );
};

export default withWarrantySpecs;
