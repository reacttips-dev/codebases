import * as React from "react";
import {connect} from "react-redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Key} from "@bbyca/apex-components";
import {bindActionCreators} from "redux";

import State from "store";
import {BreadcrumbListItem} from "models";
import Header from "components/Header";
import Footer from "components/Footer";
import BreadcrumbList from "components/BreadcrumbList";
import {inHomeConsultationActionCreators, InHomeConsultationActionCreators} from "actions/inHomeConsultationActions";
import {routingActionCreators, RoutingActionCreators} from "actions";
import routeManager from "utils/routeManager";
import {RoutingState} from "reducers";

import * as styles from "./styles.css";
import InHomeConsultationSignUpForm from "./InHomeConsultationSignUpForm";
import InHomeConsultationSignUpConfirmation from "./InHomeConsultationSignUpConfirmation";
import messages from "./translations/messages";

interface InHomeConsultationSignUpStateProps {
    salesforceOrgId: string;
    salesforceURL: string;
    termsAndConditionsURL: string;
    privacyPolicyURL: string;
    routing: RoutingState;
    language: Language;
}

interface InHomeConsultationSignUpDispatchProps {
    routingActions: RoutingActionCreators;
    ihcActions: InHomeConsultationActionCreators;
}

const InHomeConsultationSignUpPage = (
    props: InHomeConsultationSignUpDispatchProps & InHomeConsultationSignUpStateProps & InjectedIntlProps,
) => {
    const {
        intl,
        language,
        routing,
        ihcActions: {pageLoad},
        routingActions: {setAltLangHrefs},
    } = props;
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const breadcrumbItems: BreadcrumbListItem[] = [
        {
            label: intl.formatMessage(messages.inHomeConsultationSignUpBreadcrumbHome),
            linkType: "homepage" as Key,
        },
        {
            label: intl.formatMessage(messages.inHomeConsultationSignUpTitle),
            linkType: "inHomeConsultationSignUp" as Key,
        },
    ];
    React.useEffect(() => {
        pageLoad();
        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "inHomeConsultationSignUp"),
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
                        <InHomeConsultationSignUpConfirmation intl={props.intl} />
                    ) : (
                        <InHomeConsultationSignUpForm setShowConfirmation={setShowConfirmation} {...props} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps: (state: State) => InHomeConsultationSignUpStateProps = (state: State) => ({
    salesforceOrgId: state.config.salesforceFieldIds.salesforceOrgId,
    salesforceURL: state.config.dataSources.salesforceWebToLeadURL,
    privacyPolicyURL:
        state.config.dataSources.inHomeAdvisorPrivacyPolicyUrl &&
        state.config.dataSources.inHomeAdvisorPrivacyPolicyUrl[state.intl.language],
    termsAndConditionsURL:
        state.config.dataSources.inHomeAdvisorTermsAndConditionsUrl &&
        state.config.dataSources.inHomeAdvisorTermsAndConditionsUrl[state.intl.language],
    routing: state.routing,
    language: state.intl.language,
});

const mapDispatchToProps = (dispatch) => ({
    ihcActions: bindActionCreators(inHomeConsultationActionCreators, dispatch),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<InHomeConsultationSignUpStateProps, InHomeConsultationSignUpDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<InHomeConsultationSignUpStateProps & InHomeConsultationSignUpDispatchProps>(InHomeConsultationSignUpPage));
