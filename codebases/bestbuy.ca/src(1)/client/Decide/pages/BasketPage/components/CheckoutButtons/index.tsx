import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {MasterpassButton, Cart, PaypalButton} from "@bbyca/ecomm-checkout-components/dist/components";
import {cieUtilities} from "@bbyca/account-components";
import {Button} from "@bbyca/bbyca-components";
import {CheckoutButton} from "@bbyca/ecomm-checkout-components";
import {FormattedMessage} from "react-intl";

import {classname as cx} from "utils/classname";
import messages from "./translations/messages";
import * as style from "./styles.css";

interface CheckoutButtonsProps extends ContinueToCheckoutProps {
    basketId: string;
    totalPurchasePrice: number;
    masterPassConfig: {
        allowedCardTypes: string;
        buttonImageUrl: string;
        checkoutId: string;
        isEnabled: boolean;
        jsLibraryUrl: string;
    };
    paypalOnClick?: () => void;
    visaOnClick?: () => void;
    masterpassOnClick?: () => void;
    showAlternativePaymentOptions: boolean;
    disabled: boolean;
    requireSignIn: boolean;
}

export interface ContinueToCheckoutProps {
    lang: Locale;
    checkoutUrl: string;
    cieServiceUrl: string;
    requireSignIn: boolean;
    preCheck?: (e) => void;
    disabled?: boolean;
}

export type CheckoutButtonsType = CheckoutButtonsProps & InjectedIntlProps;

export const CheckoutButtons: React.FC<CheckoutButtonsType> = ({
    intl,
    checkoutUrl,
    masterPassConfig,
    basketId,
    totalPurchasePrice,
    lang,
    paypalOnClick,
    masterpassOnClick,
    preCheck,
    cieServiceUrl,
    showAlternativePaymentOptions,
    disabled,
    requireSignIn,
}) => (
    <>
        <ContinueToCheckout
            checkoutUrl={checkoutUrl}
            lang={lang}
            cieServiceUrl={cieServiceUrl}
            preCheck={preCheck}
            disabled={disabled}
            requireSignIn={requireSignIn}
        />
        {showAlternativePaymentOptions && (
            <>
                <p className={style.buttonSeparation}>{intl.formatMessage(messages.or)}</p>
                <div
                    className={cx([
                        {
                            [style.checkoutOptionsPanel]: true,
                            [style.disabled]: disabled,
                        },
                    ])}>
                    <div className={cx([style.checkoutOptions])} aria-disabled={disabled}>
                        <div onClickCapture={preCheck}>
                            <PaypalButton
                                isExpress={true}
                                href={`${checkoutUrl}?expressPaypalCheckout=true`}
                                intl={intl}
                                paypalError={false}
                                hasDescription={false}
                                onRegisterPaypal={paypalOnClick}
                            />
                        </div>
                        <div onClickCapture={preCheck}>
                            <MasterpassButton
                                cart={{
                                    id: basketId,
                                    totalPurchasePrice
                                }}
                                checkoutUri={checkoutUrl}
                                masterpassConfig={masterPassConfig}
                                intl={intl}
                                onClicked={masterpassOnClick}
                            />
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
);

export const ContinueToCheckout: React.FC<ContinueToCheckoutProps> = ({
    lang,
    checkoutUrl,
    cieServiceUrl,
    preCheck,
    requireSignIn,
    disabled = false,
}) => {
    let url = checkoutUrl;
    if (requireSignIn) {
        url = cieUtilities.buildSignInUrl(cieServiceUrl, lang, checkoutUrl, "checkout") || "";
    }

    return (
        <div onClickCapture={preCheck}>
            <CheckoutButton>
                <Button
                    className={style.continueToCheckout}
                    href={url}
                    isDisabled={disabled}
                    extraAttrs={{"data-automation": "continue-to-checkout"}}>
                    <span>
                        <FormattedMessage {...messages.continueToCheckout} />
                    </span>
                </Button>
            </CheckoutButton>
        </div>
    );
};

export default injectIntl(CheckoutButtons);
