import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { bindActionCreators } from "redux";
import { ChevronLeft, Link } from "@bbyca/bbyca-components";
import { ManufacturersWarrantyPage as ManufacturersWarranty } from "@bbyca/ecomm-checkout-components/dist/components";
import { connect } from "react-redux";

import Header from "components/Header";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import Footer from "components/Footer";
import { RoutingActionCreators, routingActionCreators } from "actions";
import State from "store";

import messages from "./translations/messages";
import * as style from "./style.css";
import { RouteParams } from "../CreateProductReviewPage/CreateProductReviewPage";

const metaTags = [{ name: "robots", content: "noindex" }];

interface OwnProps {
    params: RouteParams;
}

interface StateProps {
    canGoBack: boolean;
}

interface DispatchProps {
    routingActions: RoutingActionCreators;
}

type Props = OwnProps & StateProps & DispatchProps & InjectedIntlProps;

export const ManufacturerWarrantyPage: React.SFC<Props> = ({ params, intl, canGoBack, routingActions }) => (
    <>
        <HeadTags
            title={intl.formatMessage(messages.title)}
            metaTags={metaTags} />
        <Header />
        <div className={style.manufacturerPageContainer}>
            <PageContent>
                <div className={style.backBtnContainer}>
                    {
                        canGoBack &&
                        <Link onClick={(e) => {
                            e.preventDefault();
                            routingActions.goBack();
                        }}>
                            <div className={style.backButton} data-automation="back-to-cart">
                                <div className={style.leftChevron}>
                                    <ChevronLeft color="blue" />
                                </div>
                                {intl.formatMessage(messages.backBtn)}
                            </div>
                        </Link>
                    }
                </div>
                <hr />
                <ManufacturersWarranty sku={params.sku} />
            </PageContent>
        </div>
        <Footer />
    </>
);

const mapStateToProps = (state: State): StateProps => ({
    canGoBack: !!state.routing.previousLocationBeforeTransitions,
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(
    injectIntl(ManufacturerWarrantyPage),
);
