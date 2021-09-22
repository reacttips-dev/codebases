import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

import State from "store";
import Header from "components/Header";
import Footer from "components/Footer";
import {DetailedProduct, Dispatch, MobileActivationStep} from "models";
import {routingActionCreators, RoutingActionCreators} from "actions";
import routeManager from "utils/routeManager";
import {RoutingState} from "reducers";
import {ActivationTypes} from "models";

import {productActionCreators, ProductActionCreators} from "../../actions";
import * as styles from "./styles.css";
import {CustomerDetails, ActivationProgressHeader, MobileActivationType} from "./components";
import {ContinueButtonHandlerPayload} from "./components/MobileActivationType";
import {EligibilityResult} from "../MobileActivationPage/components/EligibilityResult";
import {getProductData} from "Decide/store/selectors";

export interface RouteParams {
    seoName: string;
    sku: string;
}

export interface MobileActivationPageStateProps {
    routing: RoutingState;
    language: Language;
    reCaptchaSitekey: string;
    product: DetailedProduct;
}

export interface MobileActivationPageDispatchProps {
    routingActions: RoutingActionCreators;
    productActions: ProductActionCreators;
}

export type MobileActivationPageProps = MobileActivationPageStateProps &
    MobileActivationPageDispatchProps &
    InjectedIntlProps;

export const MobileActivationPage: React.FC<MobileActivationPageProps> = ({
    language,
    routing,
    routingActions: {push, setAltLangHrefs},
    productActions,
    reCaptchaSitekey,
    product,
}) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [activationType, setActivationType] = React.useState<ActivationTypes | string>("");
    const [activationStep, setActivationStep] = React.useState(1);
    const [productSku, setProductSku] = React.useState("");
    const [eligibilityResult, setEligibilityResult] = React.useState<{
        isUpgradeEligible?: boolean;
        mobileNumber?: string;
        balance?: number | null;
    }>();
    const [showEligibilityResult, setShowEligibilityResult] = React.useState(false);
    const [hideActivationStepIndicator, setHideActivationStepIndicator] = React.useState(false);

    React.useEffect(() => {
        const pathName = routing.locationBeforeTransitions ? routing.locationBeforeTransitions.pathname : "";
        /**
         * the SKU below is correct when u load the page , if you switch to another language it returns a wrong string (seoName),
         * we will fix that in a seperate ticket, and we will add skuFromUrl to handle that case for now
         */
        const {sku = "", seoName = ""} = routeManager.getParams(language, pathName);
        const skuFromUrl = pathName
            .split("/")
            .filter(Boolean)
            .find((item) => !item.includes("-"));

        if (skuFromUrl) {
            setProductSku(skuFromUrl);
        }

        setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(language, "cellphonePlanInquiry", sku, seoName),
            curLangUrl: routeManager.getCurrLang(pathName),
        });

        productActions.trackMobileActivationPageView();
    }, [language]);

    React.useEffect( () => {
        if (productSku) {
            if (product?.sku === productSku) {
                productActions.fetchCellPhonePlan(productSku);
            } else {
                productActions.getProduct(productSku)
                    .then(() => productActions.fetchCellPhonePlan(productSku));
            }
        }
    }, [productSku]);

    const onUserSelection = (selection: ActivationTypes) => {
        if (selection) {
            setActivationType(selection);
        }
    };

    const gotoNextActivationStep = React.useCallback(() => {
        setActivationStep(activationStep + 1);
    }, [activationStep]);

    const handleCancelClick = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>, activationStepName: MobileActivationStep) => {
            const {locationBeforeTransitions, previousLocationBeforeTransitions} = routing;
            const currentPathName = locationBeforeTransitions ? locationBeforeTransitions.pathname : "";
            const {seoName = ""} = routeManager.getParams(language, currentPathName);

            const pathName = previousLocationBeforeTransitions
                ? previousLocationBeforeTransitions.pathname
                : routeManager.getPathByKey(language, "product", seoName, productSku);

            push(pathName);
            if (activationStepName) {
                adobeLaunch.pushEventToDataLayer({
                    event: "mobile-activation-cancel",
                    payload: {
                        activationStepName,
                    },
                });
            }
        },
        [routing, language, routeManager],
    );

    const handleContinueClick = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>, payload?: ContinueButtonHandlerPayload) => {
            if (!payload && activationType) {
                setShowEligibilityResult(false);
                gotoNextActivationStep();
            } else if (payload && activationType === ActivationTypes.Upgrade) {
                const {upgradeEligible, mobileNumber, balance} = payload;

                if (upgradeEligible === undefined) {
                    setActivationType(ActivationTypes.InStoreEligible);
                } else if (upgradeEligible === false) {
                    setHideActivationStepIndicator(true);
                } else {
                    setHideActivationStepIndicator(false);
                }

                setEligibilityResult({
                    isUpgradeEligible: upgradeEligible,
                    mobileNumber,
                    balance,
                });

                setShowEligibilityResult(true);
            }
        },
        [activationType],
    );

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                {!showConfirmation && (
                    <ActivationProgressHeader
                        currentStep={activationStep}
                        hideStepIndicator={hideActivationStepIndicator}
                    />
                )}
                <div className={styles.contentContainer}>
                    {activationStep === 1 &&
                        (showEligibilityResult && eligibilityResult ? (
                            <EligibilityResult
                                isUpgradeEligible={eligibilityResult.isUpgradeEligible}
                                mobileNumber={eligibilityResult.mobileNumber}
                                balance={eligibilityResult.balance}
                                handleCancelClick={handleCancelClick}
                                handleContinueClick={handleContinueClick}
                            />
                        ) : (
                            <MobileActivationType
                                onUserSelection={onUserSelection}
                                selectedCardId={activationType}
                                handleCancelClick={handleCancelClick}
                                handleContinueClick={handleContinueClick}
                                reCaptchaSitekey={reCaptchaSitekey}
                            />
                        ))}

                    {activationStep === 2 && (
                        <CustomerDetails
                            activationType={activationType}
                            confirmation={showConfirmation}
                            setShowConfirmation={setShowConfirmation}
                            handleCancelClick={handleCancelClick}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const mapStateToProps = (state: State): MobileActivationPageStateProps => ({
    routing: state.routing,
    language: state.intl.language,
    reCaptchaSitekey: state.config.reCaptchaSitekey,
    product: getProductData(state)
});

const mapDispatchToProps = (dispatch: Dispatch): MobileActivationPageDispatchProps => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch),
    productActions: bindActionCreators(productActionCreators, dispatch),
});

export default connect<MobileActivationPageStateProps, MobileActivationPageDispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<MobileActivationPageStateProps & MobileActivationPageDispatchProps>(MobileActivationPage));
