import * as React from "react";
import {Key} from "@bbyca/apex-components";
import {connect, MapStateToProps, MapDispatchToProps} from "react-redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {mapToValues} from "./utils/helper";
import {Form, Button, Input} from "@bbyca/bbyca-components";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {useState} from "react";
import Header from "components/Header";
import Footer from "components/Footer";

import State from "store";
import {routingActionCreators} from "actions";
import routeManager from "utils/routeManager";
import {RoutingState} from "reducers";

import {MarketplaceSignUpProvider} from "../../providers";
import {marketplaceActionCreator, MarketplaceSellerActionTypes} from "../../actions/marketplaceActions";
import * as styles from "./styles.css";
import BreadcrumbList from "components/BreadcrumbList";
import {BreadcrumbListItem} from "models";
import messages from "./translations/messages";
import SellerOnboardingHeader from "./components/SellerOnboardingHeader";
import CompanyInfo from "./components/CompanyInfo";
import PrimaryContactInfo from "./components/PrimaryContactInfo";
import ProductInfo from "./components/ProductInfo";
import OperationalDetail from "./components/OperationalDetail";
import MarketplaceSellerSignUpConfirmation from "./MarketplaceSignUpConfirmation";
import {LegalPolicies} from "./components/LegalPolicies";
import serializeToSalesForceObjectEntries from "./serializeToSalesforceObject";
import * as Constants from "./constants";

export interface MarketplaceSignUpStateProps {
    salesforceOrgId: string;
    salesforceURL: string;
    routing: RoutingState;
    language: Language;
    environment: string;
}

export interface MarketplaceSignUpDispatchProps {
    pageLoad: () => MarketplaceSellerActionTypes;
    setAltLangHrefs: (altLangHrefs: any) => void;
}

export const MarketplaceSignUpPage: React.FC<MarketplaceSignUpDispatchProps &
    MarketplaceSignUpStateProps &
    InjectedIntlProps> = ({
    intl,
    salesforceOrgId,
    salesforceURL,
    routing,
    language,
    environment,
    pageLoad,
    setAltLangHrefs,
}) => {
    const [displayConfirmation, setDisplayConfirmation] = useState(false);

    React.useEffect(() => {
        pageLoad();
        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "marketplaceSignUp"),
            curLangUrl: routeManager.getCurrLang(routing.locationBeforeTransitions.pathname),
        });
    }, []);

    const breadcrumbItems: BreadcrumbListItem[] = [
        {
            label: intl.formatMessage({...messages.marketplaceSignUpBreadcrumbHome}),
            linkType: "homepage" as Key,
        },
        {
            label: intl.formatMessage({...messages.marketplaceSignUpTitle}),
            linkType: "marketplaceSignUp" as Key,
        },
    ];

    const handleSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        const marketplaceSignUpProvider = new MarketplaceSignUpProvider<{}>(salesforceURL);
        const payload = Object.keys(data).reduce((acc, attr) => mapToValues(data, acc, attr), {});
        await marketplaceSignUpProvider.postSignUp(payload, serializeToSalesForceObjectEntries);
        setDisplayConfirmation(true);
        window.scrollTo(0, 0);
    };

    const handleError = (type: string, data: any) => {
        let errorMsgs = "";
        let numberOfError = 0;
        for (const item in data) {
            if (data[item].error && data[item].errorMsg) {
                errorMsgs =
                    typeof data[item].errorMsg === "object"
                        ? errorMsgs + item + ": " + intl.formatMessage({id: data[item].errorMsg.props.id}) + "|"
                        : errorMsgs + item + ": " + data[item].errorMsg + "|";
                numberOfError++;
            }
        }
        adobeLaunch.customLink("mp seller form error", {eVar: {1: errorMsgs, 66: numberOfError}});
    };

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <BreadcrumbList className={styles.breadcrumb} breadcrumbListItems={breadcrumbItems} />
                <div className={styles.contentContainer}>
                    {displayConfirmation ? (
                        <MarketplaceSellerSignUpConfirmation />
                    ) : (
                        <>
                            <SellerOnboardingHeader />
                            <div className={styles.formContainer}>
                                <Form onSubmit={handleSubmit} onError={handleError}>
                                    <Input
                                        type={"hidden"}
                                        className={styles.hidden}
                                        name={Constants.SF_ORG_ID}
                                        value={salesforceOrgId}
                                    />
                                    <PrimaryContactInfo />
                                    <CompanyInfo />
                                    <OperationalDetail />
                                    <ProductInfo />
                                    <Input type={"hidden"} className={styles.hidden} name="00Nf400000AAd99" value="" />
                                    <Input
                                        type={"hidden"}
                                        className={styles.hidden}
                                        name={Constants.FORM_TYPE}
                                        value="Seller Signup"
                                    />
                                    <Button
                                        extraAttrs={{"data-automation": "submit-button"}}
                                        className={styles.submitButton}
                                        appearance="secondary"
                                        type={"submit"}>
                                        {intl.formatMessage({...messages.marketplaceSignUpFormFieldSubmit})}
                                    </Button>
                                    <LegalPolicies environment={environment} />
                                </Form>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps: MapStateToProps<MarketplaceSignUpStateProps, {}, State> = (state) => {
    return {
        salesforceOrgId: state.config.salesforceFieldIds.salesforceOrgId,
        salesforceURL: state.config.dataSources.salesforceWebToLeadURL,
        routing: state.routing,
        language: state.intl.language,
        environment: state.config.environment,
    };
};

const mapDispatchToProps: MapDispatchToProps<MarketplaceSignUpDispatchProps, {}> = (dispatch) => {
    return {
        pageLoad: () => dispatch(marketplaceActionCreator.marketplaceSellerSignUpPageLoad),
        setAltLangHrefs: (altLangHrefs: any) => dispatch(routingActionCreators.setAltLangHrefs(altLangHrefs)),
    };
};

export default connect<MarketplaceSignUpStateProps, MarketplaceSignUpDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(MarketplaceSignUpPage));
