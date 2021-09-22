import * as React from "react";
import {connect} from "react-redux";
import {InjectedIntlProps, injectIntl, FormattedMessage} from "react-intl";
import {bindActionCreators} from "redux";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

import State from "store";
import {ApiLocationProvider} from "providers";
import {
    errorActionCreators,
    ErrorActionCreators,
    storesStatusActionCreators as storesLocationActionCreators,
    StoresStatusActionCreators as StoresLocationActionCreators,
} from "actions";
import {RoutingState} from "reducers";
import {Dispatch, StoreLocationById, ActivationTypes} from "models";
import Link from "components/Link";
import {getStoreLocations} from "store/selectors/storeStatusSelectors";

import CustomerDetailsForm from "./CustomerDetailsForm";
import messages from "./translations/messages";
import {InquiryContact, MobileActivationInquiryConfirmation} from "../../MobileActivationInquiryConfirmation";
import * as styles from "./styles.css";
import MobileActivationLineItem from "Decide/pages/MobileActivationPage/components/MobileActivationLineItem";
import MobileActivationStepsGuide from "Decide/pages/MobileActivationPage/components/MobileActivationStepsGuide";

export interface CustomerDetailsProps extends InjectedIntlProps {
    handleCancelClick: () => void;
    activationType: ActivationTypes;
    environment: string;
    routing: RoutingState;
    salesforceOrgId: string;
    inquiryTypeId: string;
    language: Language;
    locationApiUrl: string;
    storeLocatorUrl: string;
    mobileLeadRecordTypeId: string;
    salesforceUrl: string;
    storeId: string;
    storeLocations: StoreLocationById;
    confirmation: boolean;
    setShowConfirmation: (boolean: boolean) => void;
}

export interface CustomerDetailsDispatchProps {
    errorActions: ErrorActionCreators;
    storesLocationActions: StoresLocationActionCreators;
}

export const CustomerDetails: React.FC<CustomerDetailsProps & CustomerDetailsDispatchProps> = ({
    handleCancelClick = () => {
        // default
    },
    activationType,
    environment,
    errorActions,
    intl,
    inquiryTypeId,
    language,
    locationApiUrl,
    storeLocatorUrl,
    mobileLeadRecordTypeId,
    routing,
    salesforceOrgId,
    salesforceUrl,
    confirmation,
    setShowConfirmation,
    storeId,
    storeLocations,
    storesLocationActions: {getStoresStatus},
}) => {
    const [inquiryContact, setInquiryContact] = React.useState<InquiryContact>({firstName: "", phone: "", email: ""});
    const [geoLocatedRegion, setGeoLocatedRegion] = React.useState("");
    const [previousUrl, setPreviousUrl] = React.useState("");

    const helpTopicIds = getHelpTopicsId(environment);
    const locatorUrl = storeLocatorUrl.replace("{locale}", intl.locale.toLowerCase()).replace("/{locationId}", "");

    const locationProvider = React.useMemo(() => new ApiLocationProvider(locationApiUrl, intl.locale), [
        locationApiUrl,
        intl.locale,
    ]);

    React.useEffect(() => {
        getStoresStatus();
    }, []);

    React.useEffect(() => {
        (async () => {
            try {
                const {regionCode = ""} = await locationProvider.locate(false);
                setGeoLocatedRegion(regionCode);
            } catch (error) {
                setGeoLocatedRegion("");
            }
        })();
    }, [locationProvider]);

    React.useEffect(() => {
        const previousPathname =
            routing.previousLocationBeforeTransitions && routing.previousLocationBeforeTransitions.pathname;
        if (window && window.location && previousPathname) {
            const url = `${window.location.origin}${previousPathname}`;
            setPreviousUrl(url);
        }
    }, [routing]);

    const storeHours = (
        <Link href={locatorUrl} external>
            <FormattedMessage {...messages.storeHours} />
        </Link>
    );

    const oneHour = (
        <b>
            <FormattedMessage {...messages.oneHour} />
        </b>
    );

    const onSubmit = (data: InquiryContact) => {
        setInquiryContact(data);
        setShowConfirmation(true);
    };

    const renderCellphonePlanInquiryDetails = () => (
        <>
            <h1 className={styles.title}>
                <FormattedMessage {...messages.title} />
            </h1>
            <div className={styles.descriptionContainer}>
                <MobileActivationStepsGuide />
                <div className={styles.helpContainer}>
                    <Link
                        chevronType="right"
                        to="help"
                        params={[...helpTopicIds.mobileActivation]}
                        extraAttrs={{"data-automation": "help-link", "target": "_blank"}}
                        className={styles.helpLink}>
                        <FormattedMessage {...messages.learnHowItWorks} />
                    </Link>
                </div>
                <MobileActivationLineItem />
                <p className={styles.requiredText}>
                    <FormattedMessage {...messages.requiredText} />
                </p>
            </div>
        </>
    );

    const renderStoreHours = () => (
        <p className={styles.storeHours}>
            <FormattedMessage {...messages.storeHoursParagraph} values={{storeHours}}/>
        </p>
    );

    const renderDisclaimer = () => (
        <div className={styles.disclaimer}>
            <FormattedMessage {...messages.disclaimer} />
        </div>
    );

    const renderLegalPolicies = () => (
        <div className={styles.linksContainer}>
            <FormattedMessage {...messages.continue} />
            <Link
                to="help"
                params={[...helpTopicIds.termsConditions]}
                targetSelf={false}
                extraAttrs={{"data-automation": "help-link"}}>
                <FormattedMessage {...messages.terms} />
            </Link>
            <FormattedMessage {...messages.seperator} />
            <Link
                to="help"
                params={[...helpTopicIds.privacy]}
                targetSelf={false}
                extraAttrs={{"data-automation": "help-link"}}>
                <FormattedMessage {...messages.privacy} />
            </Link>
        </div>
    );

    return (
        <>
            {confirmation ? (
                <MobileActivationInquiryConfirmation
                    inquiryContact={inquiryContact}
                    storeLocatorUrl={locatorUrl}
                    intl={intl}
                />
            ) : (
                <div className={styles.customerDetailsContainer}>
                    {renderCellphonePlanInquiryDetails()}

                    <CustomerDetailsForm
                        activationType={activationType}
                        intl={intl}
                        salesforceOrgId={salesforceOrgId}
                        mobileLeadRecordTypeId={mobileLeadRecordTypeId}
                        previousUrl={previousUrl}
                        geoLocatedRegion={geoLocatedRegion}
                        language={language}
                        storeLocations={storeLocations}
                        inquiryTypeId={inquiryTypeId}
                        storeId={storeId}
                        salesforceUrl={salesforceUrl}
                        onSubmit={onSubmit}
                        errorActions={errorActions}
                        handleCancelClick={handleCancelClick}
                    />

                    {renderStoreHours()}
                    {renderDisclaimer()}
                    {renderLegalPolicies()}
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state: State) => ({
    routing: state.routing,
    language: state.intl.language,
    storeLocations: getStoreLocations(state),
    environment: state.config.environment,
    salesforceOrgId: state.config.salesforceFieldIds && state.config.salesforceFieldIds.salesforceOrgId,
    salesforceUrl: state.config.dataSources && state.config.dataSources.salesforceWebToLeadURL,
    inquiryTypeId: state.config.salesforceFieldIds && state.config.salesforceFieldIds.inquiryTypeId,
    storeId: state.config.salesforceFieldIds && state.config.salesforceFieldIds.storeId,
    mobileLeadRecordTypeId: state.config.salesforceFieldIds && state.config.salesforceFieldIds.mobileLeadRecordTypeId,
    storeLocatorUrl: state.config.dataSources && state.config.dataSources.storeLocatorUrl,
    locationApiUrl: state.config.dataSources && state.config.dataSources.locationApiUrl,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorActions: bindActionCreators(errorActionCreators, dispatch),
    storesLocationActions: bindActionCreators(storesLocationActionCreators, dispatch),
});

export default connect<CustomerDetailsProps, CustomerDetailsDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<CustomerDetailsProps & CustomerDetailsDispatchProps>(CustomerDetails));
