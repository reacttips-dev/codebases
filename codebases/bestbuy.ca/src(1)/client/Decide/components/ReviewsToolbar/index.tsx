import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Toggle} from "@bbyca/bbyca-components";

import State from "store";
import {classname} from "utils/classname";
import {Dispatch} from "models";
import {ReviewSortOptions} from "models";
import {FeatureToggle} from "components/FeatureToggle";
import ReviewsSortDropdown from "../ReviewsSortDropdown";
import {productReviewActionCreators, ProductReviewActionCreators} from "../../actions/productActions/customerReviews";
import * as styles from "./style.css";
import messages from "./translations/messages";

interface StateProps {
    totalReviews: number;
    sortOptionSelected: ReviewSortOptions;
    isToggleSelected: boolean;
    isVerifiedPurchaserToggleEnabled: boolean;
}

interface DispatchProps {
    productReviewsActions: ProductReviewActionCreators;
}

interface OwnProps {
    className?: string;
}

export type ReviewsToolbarProps = OwnProps & DispatchProps & StateProps & InjectedIntlProps;

export const ReviewsToolbar: React.FC<ReviewsToolbarProps> = ({
    sortOptionSelected,
    productReviewsActions,
    isToggleSelected,
    intl,
    className,
    isVerifiedPurchaserToggleEnabled,
}) => {
    return (
        <div className={classname([styles.reviewsToolbar, className])}>
            <div className={styles.filterSortContainer}>
                <FeatureToggle
                    featureComponent={
                        <Toggle
                            data-automation="verified-purchaser-toggle"
                            className={styles.verifiedPurchaserToggle}
                            name="verifiedPurchaserToggle"
                            label={intl.formatMessage(messages.verifiedPurchaserTitle)}
                            isToggleOn={isToggleSelected}
                            handleAsyncChange={(name, value) =>
                                productReviewsActions.filterReviewsByVerifiedPurchaser(!!value)
                            }
                        />
                    }
                    defaultComponent={null}
                    isFeatureActive={isVerifiedPurchaserToggleEnabled}
                />
                <ReviewsSortDropdown handleChange={productReviewsActions.sortReviews} sort={sortOptionSelected} />
            </div>
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    isVerifiedPurchaserToggleEnabled: state.config.features.verifiedPurchaserToggleEnabled,
    sortOptionSelected: state.product.customerReviews.sortOption,
    isToggleSelected: state.product.customerReviews.filter.verifiedPurchaserToggleSelected,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    productReviewsActions: bindActionCreators(productReviewActionCreators, dispatch),
});

export default connect<StateProps, {}, ReviewsToolbarProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ReviewsToolbar));
