import * as React from "react";
import {connect} from "react-redux";

import StarRate from "components/StarRate";
import {DetailedProduct as Product} from "models";
import ProductPricing, {ProductPricingProps} from "components/ProductCost/ProductPricing";
import {State} from "store";

import * as styles from "./style.css";
import SimpleProductDetailsBrief from "./components/SimpleProductDetailsBrief";

export interface StateProps {
    productDetailsBrief: Product;
}
export interface OwnProps {
    truncateMaxLines?: number;
}

export class ProductDetailsBriefPure extends React.Component<StateProps & OwnProps> {
    public render() {
        const productPricingProps: ProductPricingProps = {
            displaySaleEndDate: false,
            displaySavingPosition: "right",
            ehf: this.props.productDetailsBrief.ehf,
            priceSize: "medium",
            priceWithEhf: this.props.productDetailsBrief.priceWithEhf,
            priceWithoutEhf: this.props.productDetailsBrief.priceWithoutEhf,
            saving: this.props.productDetailsBrief.saving,
        };

        return (
            <div className={styles.productDetailsBrief} data-automation="product-details-brief">
                <SimpleProductDetailsBrief
                    product={this.props.productDetailsBrief}
                    truncateMaxLine={this.props.truncateMaxLines}>
                    <div className={styles.ratingContainer}>
                        <StarRate
                            rate={this.props.productDetailsBrief.customerRating}
                            count={this.props.productDetailsBrief.customerRatingCount}
                        />
                    </div>
                    <ProductPricing {...productPricingProps} />
                </SimpleProductDetailsBrief>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    productDetailsBrief: state.product.product,
});

export default connect<StateProps, {}, OwnProps>(mapStateToProps, null)(ProductDetailsBriefPure);
