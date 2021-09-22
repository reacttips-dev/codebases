import * as React from "react";
import {bindActionCreators} from "redux";
import {
    DisplayDefault as ExpandableContainer,
    numbersOnly,
    Input,
    maxLength,
    minLength,
    hasPostalCodeChars,
    isPostalCode,
    required,
    Form,
} from "@bbyca/bbyca-components";
import {MapStateToProps} from "react-redux";
import {FormattedMessage, injectIntl, InjectedIntlProps} from "react-intl";
import {IBrowser as ScreenSize} from "redux-responsive";
import {connect} from "react-redux";
import {GlobalErrorMessage} from "@bbyca/bbyca-components";
import ReCaptcha from "react-google-recaptcha";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {scroller} from "react-scroll";

import Link from "components/Link";
import {classIf, classname} from "utils/classname";
import {ActivationTypes, CellPhonePlanStore, MobileActivationStep, MobileActivationEligibilityCheckStore} from "models";
import {
    CellPhoneCarrierID,
    UpgradeEligibilityActivationTypes,
    CellPhoneUpgradeEligibilityResponse,
    CellPhoneUpgradeEligibilityApiError,
    CarrierError,
    Dispatch,
} from "models";
import {getCellPhonePlan, getScreenSize, getStoreLocations} from "store/selectors";
import {FeatureToggles} from "config";
import {upgradeEligibilityCheckActionCreators, UpgradeEligibilityCheckActionCreators} from "actions";
import {State} from "store";

import {ApiCellPhoneUpgradeEligibilityProvider} from "../../../../providers";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import {getCarrierDisplayName, getCarrierID} from "../../utils/helper";
import {Carrier, SelectableCardsContainer, RenderControllers} from "./";
import MobileActivationLineItem from "Decide/pages/MobileActivationPage/components/MobileActivationLineItem";
import MobileActivationStepsGuide from "Decide/pages/MobileActivationPage/components/MobileActivationStepsGuide";

export interface ContinueButtonHandlerPayload
    extends Partial<CellPhoneUpgradeEligibilityResponse>,
        Partial<CellPhoneUpgradeEligibilityApiError> {
    mobileNumber?: string;
}

export interface OwnProps extends InjectedIntlProps {
    onUserSelection: (id: ActivationTypes) => void;
    selectedCardId: ActivationTypes | string;
    handleContinueClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        continueButtonHandlerPayload?: ContinueButtonHandlerPayload,
    ) => void;
    handleCancelClick: (event: React.MouseEvent<HTMLButtonElement>, activationStepName: MobileActivationStep) => void;
    reCaptchaSitekey: string;
}

export interface StateProps {
    screenSize: ScreenSize;
    features: FeatureToggles;
    baseUrl: string;
    cellphonePlan: CellPhonePlanStore;
    carrierFormFields: MobileActivationEligibilityCheckStore | null;
    storeLocatorUrl?: string;
}

export interface DispatchProps {
    upgradeEligibilityCheckActions: UpgradeEligibilityCheckActionCreators;
}

export declare type MobileActivationTypeProps = OwnProps & StateProps & DispatchProps;

enum UpgradeFormTrackingInputField {
    phoneNumber = "phone number",
    postalCode = "postal code",
}

export const MobileActivationType: React.FC<MobileActivationTypeProps> = ({
    onUserSelection = () => {
        // default
    },
    cellphonePlan,
    carrierFormFields,
    selectedCardId,
    handleCancelClick,
    handleContinueClick,
    intl,
    screenSize,
    features,
    reCaptchaSitekey,
    baseUrl,
    storeLocatorUrl,
    upgradeEligibilityCheckActions,
}) => {
    const [globalErrorPopup, setGlobalErrorPopup] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [isErrorState, setIsErrorState] = React.useState<boolean>(false);
    const [showSpinner, setSpinner] = React.useState<boolean>(false);
    const [enableUpgradeCheck, setEnableUpgradeCheck] = React.useState<boolean>(false);
    const [requiredUpgradeCheckFields, setRequiredUpgradeCheckFields] = React.useState<{
        requiredMobileNumber: boolean;
        requiredPostalCode: boolean;
    }>({
        requiredMobileNumber: false,
        requiredPostalCode: false,
    });

    const reCaptchaRef = React.useRef<ReCaptcha>(null);
    const isUpgradeCheck = selectedCardId === ActivationTypes.Upgrade;
    const isUpgradeCheckToggleEnabled = features.mobileActivationUpgradeCheckEnabled;
    const carrierID: CellPhoneCarrierID | "" = cellphonePlan ? getCarrierID(cellphonePlan.carrierID) : "";
    const carrierDisplayName = getCarrierDisplayName(carrierID);
    const locatorUrl =
        storeLocatorUrl && storeLocatorUrl.replace("{locale}", intl.locale.toLowerCase()).replace("/{locationId}", "");
    const GLOBAL_ERROR_CONTAINER_ID = "global-grror-container";
    // A temporary setup to bypass the eligibility check for the new carriers. Will be removed when support from the
    // carrier is made available.
    const isCarrierEligibleForUpgrade = !!(carrierID && carrierFormFields && carrierFormFields[carrierID]);
    /**
     * Dependency array:
     * We don't add carrierFormFields as a dependency since the useEffect should only run on component mount and carrierId changes.
     * In doing otherwise, when API call fails carrierFormFields in redux store for the carrier does not exists, the the update to the store
     * will return a new "carrierFormFields" object. Due to this and carrierId as the key in "carrierFormFields" does not exists, the effect
     * will always refetch carrier meta information.
     */
    React.useEffect(() => {
        if (!carrierID) {
            return;
        }
        // carrierFormFields with carrier key can be null to support optional eligibility check
        if (!carrierFormFields || !carrierFormFields.hasOwnProperty(carrierID)) {
            upgradeEligibilityCheckActions.fetchCarrierMetadata(carrierID);
        }
    }, [carrierID]);

    React.useEffect(() => {
        if (globalErrorPopup) {
            setGlobalErrorPopup(false);
        }
    }, [isUpgradeCheck]);

    // An effect to add or remove fields for a given carrier.
    React.useEffect(() => {
        if (carrierID && carrierFormFields) {
            // When an API call fails for the carrier metadata, it is allowed to fail silently in the provider and
            // async action is called and continues with the execution flow. It updates the redux store with the
            // default values which updates "carrierFormFields" object. It doesn't seem to unnecessarily retrigger
            // component update, but default is used for a fallback when API is having an issue.
            const fieldsMetadata = carrierFormFields.hasOwnProperty(carrierID)
                ? carrierFormFields[carrierID]
                : carrierFormFields.default;
            // False when carrier does not support eligibility check
            if (fieldsMetadata) {
                const {requiredMobileNumber, requiredPostalCode} = fieldsMetadata;
                setRequiredUpgradeCheckFields({
                    requiredMobileNumber,
                    requiredPostalCode,
                });
            }
        }
    }, [carrierID, carrierFormFields]);

    React.useEffect(() => {
        setEnableUpgradeCheck(isUpgradeCheckToggleEnabled && isUpgradeCheck && isCarrierEligibleForUpgrade);
    }, [selectedCardId, isUpgradeCheckToggleEnabled, isCarrierEligibleForUpgrade]);

    const storeLink = (
        <Link className={styles.storeLocatorLink} external href={locatorUrl}>
            <FormattedMessage {...messages.yourLocalBestBuyStore} />
        </Link>
    );

    const scrollToError = () => {
        scroller.scrollTo(GLOBAL_ERROR_CONTAINER_ID, {
            delay: 100,
            duration: 1000,
            smooth: true,
        });
    };

    const onContinueClick = React.useCallback(
        (e) => {
            if (selectedCardId) {
                trackContinueClick();
                handleContinueClick(e);
            } else {
                setIsErrorState(true);
                trackNoActivationTypeCardSelectedError();
            }
        },
        [handleContinueClick, selectedCardId],
    );

    const onCancelClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            handleCancelClick(e, MobileActivationStep.ActivationType);
        },
        [handleCancelClick],
    );

    const getVisitStoreMessage = React.useCallback(
        () =>
            carrierID !== CellPhoneCarrierID.Rogers && carrierID !== CellPhoneCarrierID.Fido ? (
                <FormattedMessage
                    {...messages.resultNotFoundAlwaysVisitLocalStoreLink}
                    values={{yourLocalBestBuyStore: storeLink}}
                />
            ) : (
                <FormattedMessage
                    {...messages.resultNotFoundVisitLocalStoreLink}
                    values={{yourLocalBestBuyStore: storeLink}}
                />
            ),
        [],
    );

    const validateErrorFieldsType = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>, resultCode?: number) => {
            const errorCodes = [CarrierError.invalidPhone, CarrierError.invalidPostalCode];

            if (!resultCode || errorCodes.indexOf(resultCode) === -1) {
                trackContinueClick();
                handleContinueClick(e, {
                    upgradeEligible: undefined,
                });
                return;
            }

            const isInvalidPhoneError = resultCode === CarrierError.invalidPhone;

            if (isInvalidPhoneError) {
                trackUpgradeInputError(UpgradeFormTrackingInputField.phoneNumber);
                setErrorMessages([
                    intl.formatMessage(messages.upgradeFormGlobalErrorInvalidPhoneNumber, {
                        carrier: carrierDisplayName,
                    }),
                ]);
            } else {
                trackUpgradeInputError(UpgradeFormTrackingInputField.postalCode);
                setErrorMessages([intl.formatMessage(messages.upgradeFormGlobalErrorInvalidPostalCode)]);
            }
            setGlobalErrorPopup(true);
            scrollToError();
        },
        [handleContinueClick, carrierDisplayName],
    );

    const trackUpgradeInputError = React.useCallback((inputField: string) => {
        adobeLaunch.pushEventToDataLayer({
            event: "mobile-activation-input-error",
            payload: {
                inputField,
            },
        });
    }, []);

    const trackContinueClick = React.useCallback(() => {
        adobeLaunch.pushEventToDataLayer({
            event: "mobile-activation-type-continue",
            payload: {
                activationType: selectedCardId,
            },
        });
    }, []);

    const trackNoActivationTypeCardSelectedError = React.useCallback(() => {
        adobeLaunch.pushEventToDataLayer({
            event: "mobile-activation-type-error",
        });
    }, []);

    const onUpgradeFormSubmit = React.useCallback(
        async (status, e, data: {phoneNumber: {value: string}; postalCode?: {value: string}}) => {
            e.preventDefault();
            setSpinner(true);

            if (status === "SUCCESS" && globalErrorPopup) {
                setGlobalErrorPopup(false);
            }

            if (reCaptchaRef.current && baseUrl) {
                const token = (await reCaptchaRef.current.executeAsync()) || "";
                const displayGenericError = () => {
                    setErrorMessages([intl.formatMessage(messages.upgradeFormGlobalErrorGenericMessage)]);
                    setGlobalErrorPopup(true);
                    scrollToError();
                    setSpinner(false);
                };

                try {
                    const provider = new ApiCellPhoneUpgradeEligibilityProvider(baseUrl);
                    const mobileNumber = data.phoneNumber.value;
                    const payload = {
                        mobileNumber,
                        activationType: UpgradeEligibilityActivationTypes.UPG,
                        carrierId: carrierID,
                    };
                    if (data.postalCode && data.postalCode.value) {
                        Object.assign(payload, {postalCode: data.postalCode.value});
                    }
                    const upgradeCheckData = await provider.fetchCellPhoneUpgradeEligibility(payload, token);

                    reCaptchaRef.current.reset();
                    const {error, success} = upgradeCheckData;

                    if (error) {
                        const resultCode = error.resultCode;
                        validateErrorFieldsType(e, resultCode);
                        setSpinner(false);
                        return;
                    } else if (success) {
                        trackContinueClick();
                        handleContinueClick(e, {
                            upgradeEligible: success.upgradeEligible,
                            mobileNumber: data.phoneNumber.value,
                            balance: success.balance,
                        });
                        return;
                    }

                    displayGenericError();
                } catch (error) {
                    displayGenericError();
                }
            }
        },
        [handleContinueClick, globalErrorPopup, selectedCardId, carrierID, baseUrl],
    );

    const renderExpandableForm = () => (
        <ExpandableContainer className={classIf(styles.expandableContainerShown, isUpgradeCheck)} open={isUpgradeCheck}>
            <p className={styles.upgradeCheckTitle}>
                <FormattedMessage {...messages.upgradeFormPhonNumberTitle} />
            </p>
            <p className={styles.requiredText}>
                <FormattedMessage {...messages.requiredText} />
            </p>
            {globalErrorPopup && (
                <div className={styles.globalErrorMessageContainer} id={GLOBAL_ERROR_CONTAINER_ID}>
                    <GlobalErrorMessage
                        message={intl.formatMessage(messages.upgradeFormGlobalErrorMessageTitle)}
                        messages={errorMessages}>
                        {getVisitStoreMessage()}
                    </GlobalErrorMessage>
                </div>
            )}
            {requiredUpgradeCheckFields.requiredMobileNumber && (
                <Input
                    label={intl.formatMessage(messages.upgradeFormPhoneNumber)}
                    maxLength={40}
                    className={styles.mediumInput}
                    name="phoneNumber"
                    type="tel"
                    formatter={"(###) ### ####"}
                    extraAttrs={{"data-automation": "phoneNumber"}}
                    helperTxt={intl.formatMessage(messages.upgradeFormPhoneNumberHelper)}
                    validators={[required, numbersOnly, minLength(10)]}
                    errorMsg={intl.formatMessage(messages.upgradeFormPhoneNumberError)}
                />
            )}
            {requiredUpgradeCheckFields.requiredPostalCode && (
                <Input
                    label={intl.formatMessage(messages.upgradeFormPostalCode)}
                    asyncValidators={[maxLength(6), hasPostalCodeChars]}
                    className={classname([styles.postalCodeUpperCase, styles.mediumInput])}
                    name={"postalCode"}
                    extraAttrs={{"data-automation": "postalCode"}}
                    formatter={"*** ***"}
                    maxLength={7}
                    helperTxt={intl.formatMessage(messages.upgradeFormPostalCodeHelper)}
                    validators={[required, isPostalCode]}
                    errorMsg={intl.formatMessage(messages.upgradeFormPostalCodeError)}
                />
            )}
        </ExpandableContainer>
    );

    const recaptchaLang = intl && intl.locale.toLocaleLowerCase() === "fr-ca" ? "fr-CA" : "en";

    const onError = (type: string, data: {phoneNumber?: {error: boolean}; postalCode?: {error: boolean}}) => {
        if (type !== "ERROR" || !data) {
            return;
        }

        if (data.phoneNumber && data.phoneNumber.error) {
            trackUpgradeInputError(UpgradeFormTrackingInputField.phoneNumber);
        }

        if (data.postalCode && data.postalCode.error) {
            trackUpgradeInputError(UpgradeFormTrackingInputField.postalCode);
        }
    };

    const renderUpgradeCheckFlow = () => (
        <Form onSubmit={onUpgradeFormSubmit} scrollToErrors={false} onError={onError}>
            <SelectableCardsContainer
                screenSize={screenSize}
                enableUpgradeCheck={enableUpgradeCheck}
                isErrorState={isErrorState}
                carrierID={carrierID}
                setIsErrorState={setIsErrorState}
                onUserSelection={onUserSelection}
                selectedCardId={selectedCardId}>
                {renderExpandableForm()}
            </SelectableCardsContainer>
            <div className={styles.recaptcha}>
                <ReCaptcha ref={reCaptchaRef} sitekey={reCaptchaSitekey} size="invisible" hl={recaptchaLang} />
            </div>
            {isUpgradeCheck ? (
                <RenderControllers
                    onCancelClick={onCancelClick}
                    isErrorState={isErrorState}
                    showSpinner={showSpinner}
                />
            ) : (
                <RenderControllers
                    onCancelClick={onCancelClick}
                    onContinueClick={onContinueClick}
                    isErrorState={isErrorState}
                    showSpinner={showSpinner}
                />
            )}
        </Form>
    );

    const renderDefaultFlow = () => (
        <>
            <SelectableCardsContainer
                screenSize={screenSize}
                enableUpgradeCheck={enableUpgradeCheck}
                isErrorState={isErrorState}
                carrierID={carrierID}
                setIsErrorState={setIsErrorState}
                onUserSelection={onUserSelection}
                selectedCardId={selectedCardId}></SelectableCardsContainer>
            <RenderControllers
                onCancelClick={onCancelClick}
                onContinueClick={onContinueClick}
                isErrorState={isErrorState}
                showSpinner={showSpinner}
            />
        </>
    );

    return (
        <div className={styles.mobileActivationType} data-automation="mobile-activation-type-container">
            <h1 className={styles.title}>
                <FormattedMessage {...messages.getStarted} values={{carrier: <Carrier carrierID={carrierID} />}} />
            </h1>
            <MobileActivationStepsGuide />
            <MobileActivationLineItem />
            <h2 className={styles.activationQuestion}>
                <FormattedMessage {...messages.activationTypeQuestion} />
            </h2>
            {enableUpgradeCheck ? renderUpgradeCheckFlow() : renderDefaultFlow()}
        </div>
    );
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => ({
    features: state.config.features,
    screenSize: getScreenSize(state),
    baseUrl: state.config.dataSources.cellPhoneUpgradeEligibilityUrl,
    cellphonePlan: getCellPhonePlan(state),
    carrierFormFields: state.mobileActivationEligibilityCheck.carrierFormFields,
    language: state.intl.language,
    storeLocations: getStoreLocations(state),
    storeLocatorUrl: state.config.dataSources && state.config.dataSources.storeLocatorUrl,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    upgradeEligibilityCheckActions: bindActionCreators(upgradeEligibilityCheckActionCreators, dispatch),
});

export default connect<StateProps, {}, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(MobileActivationType));
