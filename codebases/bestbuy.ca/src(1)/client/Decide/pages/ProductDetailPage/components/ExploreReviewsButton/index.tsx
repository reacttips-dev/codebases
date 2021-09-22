import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FormattedMessage} from "react-intl";
import {Button} from "@bbyca/bbyca-components";

import {State} from "store";
import {classname} from "utils/classname";
import {Dispatch} from "models";
import {routingActionCreators, RoutingActionCreators} from "actions";
import routeManager from "utils/routeManager";

import * as styles from "./style.css";
import messages from "./translations/messages";

interface OwnProps {
    className?: string;
    productName: string;
    productSku: string;
}

interface StateProps {
    language: Language;
}

interface DispatchProps {
    routingActions: RoutingActionCreators;
}

export type ExploreReviewsButtonProps = OwnProps & StateProps & DispatchProps;

export const ExploreReviewsButton: React.FC<ExploreReviewsButtonProps> = ({
    productName,
    productSku,
    className,
    routingActions,
    language,
}) => {
    const goToReviewsPage = (e) => {
        e.preventDefault();
        routingActions.push(routeManager.getPathByKey(language, "productReviews", productName, productSku));
    };

    return (
        <>
            <hr className={classname([styles.divider, styles.exploreAllReviewsButtonDivider])} />
            <Button
                className={classname([styles.innerButton, className])}
                appearance="secondary"
                onClick={(e) => goToReviewsPage(e)}
                extraAttrs={{"data-automation": "pdp-explore-all-reviews-link"}}>
                <FormattedMessage {...messages.seeAllReviews} />
            </Button>
        </>
    );
};

const mapStateToProps = (state: State) => {
    return {
        language: state.intl.language,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<{}, {}, ExploreReviewsButtonProps>(mapStateToProps, mapDispatchToProps)(ExploreReviewsButton);
