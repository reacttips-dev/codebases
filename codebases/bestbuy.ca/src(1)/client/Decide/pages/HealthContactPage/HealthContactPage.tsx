import * as React from "react";
import State from "store";
import BreadcrumbList from "components/BreadcrumbList";
import routeManager from "utils/routeManager";
import * as styles from "./style.css";
import HealthContactForm from "./HealthContactForm";
import HealthContactConfirmation from "./HealthContactConfirmation";
import messages from "./translations/messages";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Key} from "@bbyca/apex-components";
import {BreadcrumbListItem} from "models";
import {routingActionCreators, RoutingActionCreators} from "actions";
import {RoutingState} from "reducers";
import {Dispatch} from "models";
import {healthContactActionCreators, HealthContactActionCreators} from "../../actions/healthContactActions";
import {SingleColumn, GlobalStyles} from "pages/PageLayouts";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";

export interface HealthContactStateProps {
    salesforceOrgId: string;
    salesforceUrl: string;
    bbyHealthUrl: string;
    assuredLivingUrl: string;
    bbyHealthBlogUrl: string;
    leadDetailsId: string;
    methodOfContactId: string;
    helpOptionId: string;
    localeId: string;
    bbyHealthLeadRecordTypeId: string;
    routing: RoutingState;
    language: Language;
}

export interface HealthContactDispatchProps {
    routingActions: RoutingActionCreators;
    healthContactActions: HealthContactActionCreators;
}

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <SingleColumn.Main>
            <div className={`${contextStyles.browserSizeLayout} ${styles.backdrop}`}>
                <div className={contextStyles.siteSizeLayout}>{children}</div>
            </div>
        </SingleColumn.Main>
    );
};

export const HealthContactPage = (props: HealthContactDispatchProps & HealthContactStateProps & InjectedIntlProps) => {
    const {
        intl,
        language,
        routing,
        bbyHealthUrl,
        assuredLivingUrl,
        bbyHealthBlogUrl,
        healthContactActions: {pageLoad},
        routingActions: {setAltLangHrefs},
    } = props;
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const breadcrumbItems: BreadcrumbListItem[] = [
        {
            label: intl.formatMessage(messages.healthContactBreadcrumbHome),
            linkType: "homepage" as Key,
        },
        {
            label: intl.formatMessage(messages.healthContactTitle),
            linkType: "bbyHealth" as Key,
        },
    ];
    React.useEffect(() => {
        pageLoad();
        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "bbyHealth"),
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
                    <HealthContactConfirmation
                        intl={props.intl}
                        bbyHealthUrl={bbyHealthUrl}
                        assuredLivingUrl={assuredLivingUrl}
                        bbyHealthBlogUrl={bbyHealthBlogUrl}
                    />
                ) : (
                    <>
                        <SectionTitle appearance={TitleAppearance.d1} className={styles.sectionTitle}>
                            <h1>{intl.formatMessage(messages.healthContactTitle)}</h1>
                        </SectionTitle>
                        <p className={styles.description}>{intl.formatMessage(messages.healthContactDescription)}</p>
                        <p className={styles.requiredText}>{intl.formatMessage(messages.healthContactRequiredText)}</p>
                        <HealthContactForm setShowConfirmation={setShowConfirmation} {...props} />
                        <p className={styles.formFooter}>{intl.formatMessage(messages.healthContactInfo)}</p>
                    </>
                )}
            </Layout>
        </SingleColumn.Container>
    );
};

const mapStateToProps = (state: State): HealthContactStateProps => ({
    salesforceOrgId: state.config.salesforceFieldIds.salesforceOrgId,
    salesforceUrl: state.config.dataSources.salesforceWebToLeadURL,
    leadDetailsId: state.config.salesforceFieldIds.leadDetailsId,
    methodOfContactId: state.config.salesforceFieldIds.methodOfContactId,
    helpOptionId: state.config.salesforceFieldIds.helpOptionId,
    bbyHealthLeadRecordTypeId: state.config.salesforceFieldIds.bbyHealthLeadRecordTypeId,
    bbyHealthUrl: state.config.staticUrls.bbyHealthUrl[state.intl.language],
    assuredLivingUrl: state.config.staticUrls.assuredLivingUrl[state.intl.language],
    bbyHealthBlogUrl: state.config.staticUrls.bbyHealthBlogUrl[state.intl.language],
    localeId: state.config.salesforceFieldIds.localeId,
    routing: state.routing,
    language: state.intl.language,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    healthContactActions: bindActionCreators(healthContactActionCreators, dispatch),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect<HealthContactStateProps, HealthContactDispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<HealthContactStateProps & HealthContactDispatchProps>(HealthContactPage));
