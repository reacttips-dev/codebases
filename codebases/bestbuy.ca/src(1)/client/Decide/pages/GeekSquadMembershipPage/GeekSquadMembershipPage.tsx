import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Key} from "@bbyca/apex-components";

import State from "store";
import {BreadcrumbListItem} from "models";
import Header from "components/Header";
import Footer from "components/Footer";
import BreadcrumbList from "components/BreadcrumbList";
import {routingActionCreators, RoutingActionCreators} from "actions";
import routeManager from "utils/routeManager";
import {RoutingState} from "reducers";

import {geekSquadMembershipActionCreators, GeekSquadMembershipActionCreators} from "../../actions/geekSquadMembershipActions";
import * as styles from "./styles.css";
import GeekSquadMembershipForm from "./GeekSquadMembershipForm";
import GeekSquadMembershipConfirmation from "./GeekSquadMembershipConfirmation";
import messages from "./translations/messages";

interface GeekSquadMembershipStateProps {
    salesforceOrgId: string;
    salesforceURL: string;
    leadDetailsId: string;
    promoCodeId: string;
    gsbmLeadRecordTypeId: string;
    routing: RoutingState;
    language: Language;
}

interface GeekSquadMembershipDispatchProps {
    routingActions: RoutingActionCreators;
    gsActions: GeekSquadMembershipActionCreators;
}

const GeekSquadMembershipPage = (
    props: GeekSquadMembershipDispatchProps & GeekSquadMembershipStateProps & InjectedIntlProps,
) => {
    const {
        intl,
        language,
        routing,
        gsActions: {pageLoad},
        routingActions: {setAltLangHrefs},
    } = props;
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const breadcrumbItems: BreadcrumbListItem[] = [
        {
            label: intl.formatMessage(messages.geekSquadMembershipBreadcrumbHome),
            linkType: "homepage" as Key,
        },
        {
            label: intl.formatMessage(messages.geekSquadMembershipTitle),
            linkType: "geekSquadBusinessMembership" as Key,
        },
    ];
    React.useEffect(() => {
        pageLoad();
        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "geekSquadBusinessMembership"),
            curLangUrl: routeManager.getCurrLang(routing.locationBeforeTransitions.pathname),
        });
    }, []);
    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <BreadcrumbList breadcrumbListItems={breadcrumbItems} />
                <div className={styles.contentContainer}>
                    {showConfirmation ? (
                        <GeekSquadMembershipConfirmation intl={props.intl} />
                    ) : (
                        <GeekSquadMembershipForm setShowConfirmation={setShowConfirmation} {...props} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps: (state: State) => GeekSquadMembershipStateProps = (state: State) => ({
    salesforceOrgId: state.config.salesforceFieldIds.salesforceOrgId,
    salesforceURL: state.config.dataSources.salesforceWebToLeadURL,
    leadDetailsId: state.config.salesforceFieldIds.leadDetailsId,
    promoCodeId: state.config.salesforceFieldIds.promoCodeId,
    gsbmLeadRecordTypeId: state.config.salesforceFieldIds.gsbmLeadRecordTypeId,
    routing: state.routing,
    language: state.intl.language,
});

const mapDispatchToProps = (dispatch) => ({
    gsActions: bindActionCreators(geekSquadMembershipActionCreators, dispatch),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<GeekSquadMembershipStateProps, GeekSquadMembershipDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<GeekSquadMembershipStateProps & GeekSquadMembershipDispatchProps>(GeekSquadMembershipPage));
