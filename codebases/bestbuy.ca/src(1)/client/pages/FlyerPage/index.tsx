import * as React from "react";
import {connect} from "react-redux";
import {State} from "store";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {userActionCreators as userAction, UserActionCreators as UserActions} from "../../actions/userActions";
import {flyerActionCreators as flyerAction, FlyerActionCreators as FlyerActions} from "../../actions/flyerActions";
import Header from "components/Header";
import Footer from "components/Footer";
import HeadTags from "components/HeadTags";
import messages from "./translations/messages";
import PageContent from "components/PageContent";
import Flyer from "./components/Flyer";
import {ApiStoreLocationProvider} from "providers";
import {ClientConfig, ServerConfig} from "config";
import {bindActionCreators} from "redux";
import routeManager from "utils/routeManager";
import {RoutingState} from "reducers";
import TitleHeader from "components/TitleHeader";
import styles from "./styles.css";

interface StateProps {
    config: ClientConfig & ServerConfig;
    language: Language;
    postalCode: string;
    routing: RoutingState;
}
export interface DispatchProps {
    flyerActions: FlyerActions;
    locate: (includedStores: boolean) => void;
}

export interface LocalState {
    storeId: string;
    isLocationUpdated: boolean;
}

export class FlyerPage extends React.Component<StateProps & DispatchProps & InjectedIntlProps, LocalState> {
    constructor(props) {
        super(props);
        this.state = {
            storeId: null,
            isLocationUpdated: false,
        };
    }

    public async componentDidMount() {
        await this.props.locate(true);
        const stores = await this.getStores();
        await this.props.flyerActions.syncFlyerStateWithLocation(this.props.routing.locationBeforeTransitions);
        if (stores && stores.length > 0) {
            const firstStoreId = stores[0].locationId;
            this.setState({storeId: firstStoreId});
        }
        this.setState({isLocationUpdated: true});
        this.props.flyerActions.trackFlyerPageLoad();
    }

    public render() {
        const h1 = this.props.intl.formatMessage(messages.h1);
        return (
            <>
                {this.renderHeadTags()}
                <Header />
                <PageContent disableNps={true}>
                    <TitleHeader title={h1} className={styles.flyerTitle} />
                    <hr className={styles.dividerWithMargin} />
                    <div className={styles.flyerPageContainer}>
                        {this.state.isLocationUpdated && (
                            <Flyer
                                language={this.props.language}
                                postalCode={this.props.postalCode || ""}
                                storeId={this.state.storeId}
                            />
                        )}
                    </div>
                </PageContent>
                <Footer />
            </>
        );
    }

    private renderHeadTags() {
        const canonicalUrl = routeManager.getCanonicalUrlByKey(this.props.language, "flyer");
        const metaDescription = this.props.intl.formatMessage(messages.metaDescription);

        const title = this.props.intl.formatMessage(messages.title);
        const links = [canonicalUrl && {rel: "canonical", href: canonicalUrl}];
        const metaTags = [{name: "description", content: metaDescription}];

        return <HeadTags title={title} links={links} metaTags={metaTags} />;
    }

    private async getStores() {
        try {
            const providerUrl = this.props.config.dataSources.storeLocationApiUrl;
            const apiStoreLocationProvider = new ApiStoreLocationProvider(providerUrl, this.props.language);
            return await apiStoreLocationProvider.getOnlyBigBoxLocations(this.props.postalCode);
        } catch (error) {
            return [];
        }
    }
}

const mapStateToProps = (state: State) => ({
    config: state.config,
    language: state.intl.language,
    postalCode: state.user.shippingLocation.postalCode,
    routing: state.routing,
});

const mapDispatchToProps = (dispatch) => {
    return {
        flyerActions: bindActionCreators(flyerAction, dispatch),
        locate: (includedStores: boolean) => dispatch(userAction.locate(includedStores)),
    };
};

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(injectIntl(FlyerPage));
