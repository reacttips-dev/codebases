import * as React from "react";

import {FormattedMessage} from "react-intl";
import {LoadingSpinner} from "@bbyca/bbyca-components";

import * as styles from "./styles.css";
import messages from "./translations/messages";
import {Controllers} from "../Controllers";

interface RenderControllersProps {
    onCancelClick: React.MouseEventHandler<HTMLButtonElement>;
    onContinueClick?: React.MouseEventHandler<HTMLButtonElement>;
    isErrorState: boolean;
    showSpinner: boolean;
}

export const RenderControllers: React.FC<RenderControllersProps> = ({
    onCancelClick,
    onContinueClick,
    isErrorState,
    showSpinner,
}) => (
    <>
        {isErrorState && (
            <p className={styles.errorMessage} data-automation="mobile-activation-type-error">
                <FormattedMessage {...messages.activationTypeEmpty} />
            </p>
        )}
        <Controllers
            dataAutomation={"mobile-activation-type-controllers"}
            continueButton={{
                handler: onContinueClick,
                label: showSpinner ? (
                    <LoadingSpinner isLight width={"28px"} />
                ) : (
                    <FormattedMessage {...messages.continueButton} />
                ),
                dataAutomation: "mobile-activation-type-continue-to-customer-details",
            }}
            cancelButton={{
                handler: onCancelClick,
                label: <FormattedMessage {...messages.cancelLink} />,
                dataAutomation: "cancel-activation",
            }}
        />
    </>
);
