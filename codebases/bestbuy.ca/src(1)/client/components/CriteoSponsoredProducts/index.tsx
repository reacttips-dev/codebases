import * as React from "react";
import {connect} from "react-redux";
import {IBrowser} from "redux-responsive/types";
import {MerchSkuList} from "components/banners/MerchSkuList";
import {SectionItemTypes, Intl, App, Region, DetailedProduct} from "models";
import {sendCriteoImagePixel} from "../../utils/criteo";
import {Key} from "@bbyca/apex-components";
import {useState} from "react";
import {useCriteoSponsoredProductList} from "./hooks/useCriteoSponsoredProductList";
import {useCriteoProductAds} from "components/CriteoSponsoredProducts/hooks/useCriteoProductAds";
import {getScreenSize} from "store/selectors";

export interface OwnProps {
    disableSeoAttributes?: boolean;
    alignLeft?: boolean;
}

export interface StateProps {
    app: App;
    intl: Intl;
    pageKey: Key;
    screenSize: IBrowser;
    regionName: string;
    regionCode: Region;
    language: Language;
    environment: string;
    searchApiUrl: string;
    criteoUrl: string | undefined;
    criteoAccountId: string | undefined;
    product?: DetailedProduct;
}

export const CriteoSponsoredProducts: React.FC<StateProps & OwnProps> = ({
    screenSize,
    regionName,
    regionCode,
    language,
    intl,
    pageKey,
    alignLeft,
    disableSeoAttributes,
    searchApiUrl,
    criteoAccountId,
    criteoUrl,
    product,
    environment,
    children,
}) => {
    if (!criteoUrl || !criteoAccountId) {
        return null;
    }

    const criteoProductAds = useCriteoProductAds({criteoAccountId, criteoUrl, environment, pageKey, product});
    const [viewedSponsoredProductSkus, setViewedSponsoredProductSkus] = useState<string[]>([]);
    const criteoSponsoredProductList = useCriteoSponsoredProductList({
        criteoProductAds,
        intl,
        searchApiUrl,
        pageKey,
        regionCode,
    });

    const fireCriteoViewProductBeacon = (sku: string) => {
        if (criteoProductAds && !viewedSponsoredProductSkus.includes(sku)) {
            const criteoViewBeaconUrl = criteoProductAds.find((ad) => ad.ProductSKU === sku).OnViewBeacon;
            sendCriteoImagePixel(criteoViewBeaconUrl);
            setViewedSponsoredProductSkus([...viewedSponsoredProductSkus, sku]);
        }
    };

    return criteoProductAds?.length && criteoSponsoredProductList?.length ? (
        <div data-automation={`criteo-sponsored-products-carousel-${pageKey}`}>
            {children}
            <MerchSkuList
                language={language}
                screenSize={screenSize}
                regionName={regionName}
                type={SectionItemTypes.skuList}
                skuList={criteoSponsoredProductList}
                noConversion={true}
                onProductItemScrollIntoView={fireCriteoViewProductBeacon}
                shouldRenderAnchorLinkOnProductItems
                alignLeft={alignLeft}
                disableSeoAttributes={disableSeoAttributes}
            />
        </div>
    ) : null;
};

const mapStateToProps = (state: any) => ({
    app: state.app,
    environment: state.app.environment.appEnv,
    intl: state.intl,
    pageKey: state.routing.pageKey,
    language: state.intl.language,
    regionName: state.user.shippingLocation.regionName,
    regionCode: state.app.location.regionCode,
    screenSize: getScreenSize(state),
    searchApiUrl: state.config.dataSources.searchApiUrl,
    criteoUrl: state.config.criteo?.criteoUrl,
    criteoAccountId: state.config.criteo?.accountId,
    product: state.product.product,
});

CriteoSponsoredProducts.displayName = "CriteoSponsoredProducts";

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(CriteoSponsoredProducts);
