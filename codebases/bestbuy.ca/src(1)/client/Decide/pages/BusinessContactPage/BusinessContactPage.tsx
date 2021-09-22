import * as React from "react";
import State from "store";
import BreadcrumbList from "components/BreadcrumbList";
import routeManager from "utils/routeManager";
import BusinessContactForm from "./BusinessContactForm";
import BusinessContactConfirmation from "./BusinessContactConfirmation";
import CallUsCard from "./components/CallUsCard";
import messages from "./translations/messages";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import * as styles from "./style.css";
import {Key} from "@bbyca/apex-components";
import {BreadcrumbListItem} from "models";
import {routingActionCreators, RoutingActionCreators} from "actions";
import {RoutingState} from "reducers";
import {Dispatch} from "models";
import {businessContactActionCreators, BusinessContactActionCreators} from "../../actions/businessContactActions";
import {SingleColumn, GlobalStyles} from "pages/PageLayouts";
import SectionTitle from "components/SectionTitle";

export interface BusinessContactStateProps {
    salesforceOrgId: string;
    webToLeadUrl: string;
    webToCaseUrl: string;
    bbyBusinessUrl: string;
    bbyBusinessWorkFromHomeUrl: string;
    leadDetailsId: string;
    methodOfContactId: string;
    localeId: string;
    webFirstNameId: string;
    webLastNameId: string;
    webLanguageId: string;
    bbyBusinessLeadRecordTypeId: string;
    bbyBusinessCaseRecordTypeId: string;
    caseReferenceNumberId: string;
    caseReferenceTypeId: string;
    routing: RoutingState;
    language: Language;
}

export interface BusinessContactDispatchProps {
    routingActions: RoutingActionCreators;
    businessContactActions: BusinessContactActionCreators;
}

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <SingleColumn.Main>
            <div className={`${contextStyles.browserSizeLayout} ${styles.backdrop}`}>
                <div className={styles.siteLayoutPadding}>{children}</div>
            </div>
        </SingleColumn.Main>
    );
};

export const BusinessContactPage = (props: BusinessContactDispatchProps & BusinessContactStateProps & InjectedIntlProps) => {
    const {
        intl,
        language,
        routing,
        bbyBusinessUrl,
        bbyBusinessWorkFromHomeUrl,
        businessContactActions: {pageLoad},
        routingActions: {setAltLangHrefs},
    } = props;
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const breadcrumbItems: BreadcrumbListItem[] = [
        {
            label: intl.formatMessage(messages.businessContactBreadcrumbHome),
            linkType: "homepage" as Key,
        },
        {
            label: intl.formatMessage(messages.businessContactTitle),
            linkType: "bbyBusiness" as Key,
        },
    ];
    React.useEffect(() => {
        pageLoad();
        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "bbyBusiness"),
            curLangUrl: routeManager.getCurrLang(routing.locationBeforeTransitions.pathname),
        });
    }, []);
    return (
        <SingleColumn.Container>
            <SingleColumn.Header>
                <BreadcrumbList breadcrumbListItems={breadcrumbItems} />
            </SingleColumn.Header>
            <Layout>
                {showConfirmation ? (
                    <BusinessContactConfirmation
                        intl={props.intl}
                        bbyBusinessUrl={bbyBusinessUrl}
                        bbyBusinessWorkFromHomeUrl={bbyBusinessWorkFromHomeUrl}
                    />
                ) : (
                    <>
                        <SectionTitle className={styles.title}>
                            <h1>{intl.formatMessage(messages.businessContactTitle)}</h1>
                        </SectionTitle>
                        <p className={styles.description}>{intl.formatMessage(messages.businessContactDescription)}</p>
                        <p className={styles.description}><span className={styles.bold}>{intl.formatMessage(messages.businessContactNoteLabel)}</span>{intl.formatMessage(messages.businessContactNote)}</p>
                        <CallUsCard className={styles.formSpacing} intl={props.intl} />
                        <p className={styles.requiredText}>{intl.formatMessage(messages.businessContactRequiredText)}</p>
                        <BusinessContactForm setShowConfirmation={setShowConfirmation} {...props} />
                    </>
                )}
            </Layout>
        </SingleColumn.Container>
    );
};

const mapStateToProps = (state: State): BusinessContactStateProps => ({
    salesforceOrgId: state.config.salesforceFieldIds.salesforceOrgId,
    webToLeadUrl: state.config.dataSources.salesforceWebToLeadURL,
    leadDetailsId: state.config.salesforceFieldIds.leadDetailsId,
    methodOfContactId: state.config.salesforceFieldIds.methodOfContactId,
    bbyBusinessLeadRecordTypeId: state.config.salesforceFieldIds.bbyBusinessLeadRecordTypeId,
    bbyBusinessCaseRecordTypeId: state.config.salesforceFieldIds.bbyBusinessCaseRecordTypeId,
    bbyBusinessUrl: state.config.staticUrls.bbyBusinessUrl[state.intl.language],
    bbyBusinessWorkFromHomeUrl: state.config.staticUrls.bbyBusinessWorkFromHomeUrl[state.intl.language],
    webToCaseUrl: state.config.dataSources.salesforceWebToCaseUrl,
    webFirstNameId: state.config.salesforceFieldIds.webFirstNameId,
    webLastNameId: state.config.salesforceFieldIds.webLastNameId,
    webLanguageId: state.config.salesforceFieldIds.webLanguageId,
    caseReferenceNumberId: state.config.salesforceFieldIds.caseReferenceNumberId,
    caseReferenceTypeId: state.config.salesforceFieldIds.caseReferenceTypeId,
    localeId: state.config.salesforceFieldIds.localeId,
    routing: state.routing,
    language: state.intl.language,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    businessContactActions: bindActionCreators(businessContactActionCreators, dispatch),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<BusinessContactStateProps, BusinessContactDispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<BusinessContactStateProps & BusinessContactDispatchProps>(BusinessContactPage));
