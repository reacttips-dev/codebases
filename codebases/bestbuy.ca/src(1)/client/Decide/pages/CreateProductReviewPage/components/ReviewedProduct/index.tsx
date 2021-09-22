import * as React from "react";

import Link from "components/Link";
import {DetailedProduct} from "models";

import {SimpleProductDetailsBrief, SimpleProductDetailsBriefPlaceHolder} from "../../../../components/ProductDetailsBrief";
import {RouteParams} from "../../../CreateProductReviewPage/CreateProductReviewPage";

interface ReviewedProductProps {
    product: DetailedProduct;
    params: RouteParams;
}

const ReviewedProduct: React.FC<ReviewedProductProps> = ({product, params}) => {
    if (!product || !product.sku) {
        return <SimpleProductDetailsBriefPlaceHolder />;
    }

    return (
        <Link to="product" params={[params.seoName, params.sku]}>
            <SimpleProductDetailsBrief product={product} shouldHidePrice={true} hasPadding />
        </Link>
    );
};

export default ReviewedProduct;
