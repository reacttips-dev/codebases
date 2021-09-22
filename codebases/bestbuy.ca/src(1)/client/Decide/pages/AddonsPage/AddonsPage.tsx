import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {ErrorToaster} from "@bbyca/bbyca-components";
import {clearCartFailureCode} from "@bbyca/ecomm-checkout-components";

import Header from "components/Header";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import Footer from "components/Footer";
import {RoutingState} from "reducers";
import {Dispatch} from "models";
import {FeatureToggles} from "config";
import State from "store";
import {getRouting, getConfigFeatures} from "store/selectors";

import {getCartErrorType} from "../../store/selectors";
import {BasketActionCreators, basketActionCreators} from "../../actions/basketActions";
import MainContent from "./components/MainContent";
import messages from "./translations/messages";
import * as styles from "./styles.css";

interface StateProps {
    routing: RoutingState;
    features?: FeatureToggles;
    cartErrorType?: string;
}
interface DispatchProps {
    basketActions: BasketActionCreators;
    dismissCartError: () => void;
}

const metaTags = [{name: "robots", content: "noindex"}];

interface OwnProps {
    params: {sku: string};
}

export type AddonsPageProps = OwnProps & DispatchProps & StateProps;

// TODO: move content from MainContent component to here
export class AddOnsPage extends React.Component<AddonsPageProps & InjectedIntlProps> {
    public async componentDidMount() {
        await this.props.basketActions.syncRequiredPartsStateWithLocation(this.props.routing.locationBeforeTransitions);
    }
    public render() {
        const {
            params: {sku},
            cartErrorType,
        } = this.props;
        return (
            <>
                <HeadTags metaTags={metaTags} />
                <Header />
                <PageContent extraProps={{className: `x-page-content ${styles.addonPageWrapper}`}}>
                    <div className={styles.addonsTitleContainer}>
                        <h1 className={styles.addonsPageTitle}>
                            <FormattedMessage {...messages.header} />
                        </h1>
                    </div>
                    <MainContent sku={sku} features={this.props.features} />
                    <ErrorToaster
                        visible={(cartErrorType && cartErrorType !== "") || false}
                        close={this.props.dismissCartError}
                        message={this.getCartErrorMessage()}
                    />
                </PageContent>
                <Footer />
            </>
        );
    }

    private getCartErrorMessage = (): string => {
        try {
            const {
                intl: {formatMessage},
                cartErrorType,
            } = this.props;

            let translation = formatMessage(messages.errorFallbackMessage);

            if (cartErrorType) {
                translation = formatMessage(messages[cartErrorType]);
            }

            return translation;
        } catch (error) {
            // do nothing
            return "";
        }
    };
}

const mapStateToProps = (state: State): StateProps => ({
    routing: getRouting(state),
    features: getConfigFeatures(state),
    cartErrorType: getCartErrorType(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    basketActions: bindActionCreators(basketActionCreators, dispatch),
    dismissCartError: () => dispatch(clearCartFailureCode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddOnsPage));
