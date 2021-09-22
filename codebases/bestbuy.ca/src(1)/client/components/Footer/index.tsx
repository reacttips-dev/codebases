import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {GlobalFooter} from "@bbyca/apex-components";
import {bindActionCreators} from "redux";
import {routingActionCreators, RoutingActionCreators} from "actions";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import State from "store";
import {getCmsEnvironment} from "../../utils/environment";

interface StateProps {
    environment?: string;
    newsLetterApiUrl?: string;
    isNewCareersExperienceEnabled?: boolean;
    accountsWebAppUrl: string;
    ordersWebAppUrl: string;
    contentApiUrl: string;
}

interface DispatchProps {
    routingActions: RoutingActionCreators;
}

const Footer = (props: StateProps & DispatchProps & InjectedIntlProps) => (
    <GlobalFooter
        config={{
            accountDashboardUrl: props.accountsWebAppUrl,
            contentApiUrl: props.contentApiUrl,
            ordersWebAppUrl: props.ordersWebAppUrl,
        }}
        locale={props.intl.locale as Locale}
        client={"ecomm-webapp"}
        internalLinkHandler={(path, key) => props.routingActions.push(path)}
        env={getCmsEnvironment(props.environment || "")}
        newsLetterApiUrl={props.newsLetterApiUrl}
        isNewCareersExperienceEnabled={props.isNewCareersExperienceEnabled}
    />
);

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => ({
    environment: state.config.environment,
    newsLetterApiUrl: state.config.dataSources.newsLetterApiUrl,
    isNewCareersExperienceEnabled: state.config.isNewCareersExperienceEnabled,
    accountsWebAppUrl: state.config.appPaths.accounts,
    ordersWebAppUrl: state.config.appPaths.orders,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps, mapDispatchToProps)(injectIntl(Footer));
