import * as React from "react";
import {FormattedMessage} from "react-intl";
import {RequiredProduct, PartStatus, Product} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import {ProductAddonSection} from "../ProductAddonSection";
import RequiredProductsLoader from "../RequiredProductsLoader";
import messages from "../../translations/messages";
import {RequiredPartsLineItem} from "../RequiredPartsLineItem";
import {RequiredPartsOptIn} from "../RequiredPartsOptIn";

interface Props {
    isError?: boolean;
    isLoading?: boolean;
    parentItemJustAddedToCart: boolean;
    parentProduct: Product;
    requiredProducts: RequiredProduct[];
    onUpdateStatus: (sku: string, status: PartStatus) => void;
    onConnectionError: (...params: any[]) => void;
    statusBySku: {
        [key: string]: PartStatus;
    };
    className?: string;
    hideHeader?: boolean;
}

const RequiredProducts: React.FC<Props> = ({
    className,
    isLoading,
    onConnectionError,
    onUpdateStatus,
    parentItemJustAddedToCart,
    parentProduct,
    requiredProducts,
    statusBySku,
    hideHeader = false,
}: Props) => {
    return (
        <ProductAddonSection
            isLoading={isLoading}
            className={className}
            dataAutomation="addons-page-required-parts-section"
            header={<FormattedMessage {...messages.partsYouNeed} />}
            subheader={<FormattedMessage {...messages.brandNewParts} />}
            hideHeader={hideHeader}
            loadingDisplay={<RequiredProductsLoader requiredProducts={requiredProducts} />}>
            {requiredProducts &&
                requiredProducts.map((product, index) => {
                    return (
                        <div key={product.sku}>
                            <RequiredPartsLineItem
                                {...product}
                                offer={{
                                    regularPrice: product.offer && product.offer.regularPrice,
                                    salePrice: product.offer && product.offer.salePrice,
                                }}
                                footer={
                                    <RequiredPartsOptIn
                                        status={statusBySku[product.sku]}
                                        updateStatus={onUpdateStatus}
                                        showErrorMessage={onConnectionError}
                                        parentSku={parentProduct.sku}
                                        requiredPartSku={product.sku}
                                        parentItemJustAddedToCart={parentItemJustAddedToCart}
                                    />
                                }
                            />
                            {index !== requiredProducts.length - 1 && <hr />}
                        </div>
                    );
                })}
        </ProductAddonSection>
    );
};

export default RequiredProducts;
