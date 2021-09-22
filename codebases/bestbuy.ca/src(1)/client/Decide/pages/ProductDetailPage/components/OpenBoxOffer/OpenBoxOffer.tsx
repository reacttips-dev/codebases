import * as React from "react";

import {SimpleProduct, OpenBoxRecommendation, Region} from "models";

import {recommendationDataMapper} from "../../../../providers/ProductProvider/recommendationDataMapper";
import VerticalDivider from "../../../../components/VerticalDivider";
import {OpenBoxOfferPure} from ".";

export interface OpenBoxOfferProps {
    openBox: OpenBoxRecommendation;
    appLocationRegionCode: Region;
    locale: Locale;
}

export const OpenBoxOffer: React.FC<OpenBoxOfferProps> = (props) => {
    const {openBox, appLocationRegionCode, locale} = props;

    if (!openBox || !openBox.skus || !openBox.skus.length || appLocationRegionCode === "NB") {
        return null;
    }

    const products = openBox.skus.map((sku) => {
        const mappedProduct = recommendationDataMapper(sku, locale, appLocationRegionCode);
        return new SimpleProduct(mappedProduct);
    });

    if (products.length === 0) {
        return null;
    }

    return (
        <>
            <VerticalDivider />
            <OpenBoxOfferPure products={[...products]} pdpIsOpenBox={openBox.pdpIsOpenBox} />
        </>
    );
};
