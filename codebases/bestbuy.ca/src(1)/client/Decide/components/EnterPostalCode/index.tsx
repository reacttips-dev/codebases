import {Button, Form, Input, DeliveryIcon} from "@bbyca/bbyca-components";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {FormattedMessage} from "react-intl";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

import * as styles from "./styles.css";
import messages from "./translations/messages";

export interface EnterPostalCodeProps {
    changePostalCode: (postalCode: string) => void;
    postalCode?: string;
    basic?: boolean;
    error?: boolean;
    validateCompletePostalCode?: boolean;
    onError?: (type: string, data: any) => void;
    handleSyncChange?: (id: string, val: string, error: boolean) => void;
    handleAsyncChange?: (id: string, val: string, error: boolean) => void;
    scrollToErrors?: boolean;
}

export interface EnterPostalCodeState {
    postalCode: string;
}

const hasPostalCodeChars = (val: string): boolean => {
    const re = new RegExp("^([0-9A-Za-z\\s]*)$");
    return re.test(String(val));
};

export const EnterPostalCodeMessaging = () => (
    <>
        <div className={styles.epcHeader}>
            <div className={styles.imgCol}>
                <DeliveryIcon className={styles.deliveryIcon} />
            </div>
            <div className={styles.textCol}>
                <h2>
                    <FormattedMessage {...messages.deliveryText} />
                </h2>
            </div>
        </div>
        <div className={styles.epcHeaderRow}>
            <FormattedMessage {...messages.estimatesText} />
        </div>
        <div className={styles.epcHeaderRow}>
            <FormattedMessage {...messages.changeDestinationText} />
        </div>
    </>
);

EnterPostalCodeMessaging.displayName = "EnterPostalCodeMessaging";

const MIN_POSTAL_CODE_LENGTH = 3;

export const EnterPostalCode: React.FC<EnterPostalCodeProps & InjectedIntlProps> = ({
    changePostalCode,
    postalCode = "",
    basic = false,
    error = false,
    validateCompletePostalCode,
    onError,
    handleSyncChange,
    handleAsyncChange,
    scrollToErrors,
    intl,
}) => {
    const handleSubmit = (type: string, e, data) => {
        e.preventDefault();
        changePostalCode(data.postalCode.value);

        adobeLaunch.pushEventToDataLayer({
            event: "change-postal-code",
            payload: {
                postalCode: data.postalCode.value,
            },
        });

    };

    const validatePostalCode = (val: string): boolean => {
        if (val.length === MIN_POSTAL_CODE_LENGTH && !validateCompletePostalCode) {
            return /^[A-Za-z]\d[A-Za-z][ ]?$/.test(val);
        } else {
            return /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(val);
        }
    };

    return (
        <div className={styles.updatePostalCode} data-automation="enter-postal-code">
            {!basic && <EnterPostalCodeMessaging />}
            <Form onSubmit={handleSubmit} onError={onError} scrollToErrors={scrollToErrors}>
                <div className={styles.epcInputContainer}>
                    <Input
                        asyncValidators={[hasPostalCodeChars]}
                        className={styles.upperCase}
                        error={error}
                        errorMsg={intl.formatMessage(messages.invalidPostalCodeText)}
                        formatter={"*** ***"}
                        name={"postalCode"}
                        validators={[validatePostalCode]}
                        value={postalCode}
                        handleSyncChange={handleAsyncChange}
                        handleAsyncChange={handleSyncChange}
                        extraAttrs={{"data-automation": "enter-postal-code-input"}}
                    />
                    <Button
                        type={"submit"}
                        appearance="tertiary"
                        className={styles.zipCodeButton}
                        extraAttrs={{"data-automation": "enter-postal-code-button"}}>
                        <FormattedMessage {...messages.updateBtnLabel} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default injectIntl(EnterPostalCode);
