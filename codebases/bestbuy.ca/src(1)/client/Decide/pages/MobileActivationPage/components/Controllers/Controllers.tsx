import * as React from "react";
import {Button} from "@bbyca/bbyca-components";

import * as styles from "./styles.css";

interface ButtonProps {
    handler: React.MouseEventHandler<HTMLButtonElement>;
    label: React.ReactNode | string;
    dataAutomation?: string;
}

interface ContinueButtonProps
    extends Pick<ButtonProps, "label" | "dataAutomation">,
        Partial<Pick<ButtonProps, "handler">> {}

type CancelButtonProps = ButtonProps;

export interface ControllersProps {
    dataAutomation?: string;
    continueButton?: ContinueButtonProps;
    cancelButton?: CancelButtonProps;
}

const Controllers: React.FC<ControllersProps> = ({
    continueButton,
    cancelButton,
    dataAutomation = "controllers-container",
}) => {
    if (!continueButton && !cancelButton) {
        return null;
    }

    // Please note: Continue button will render even if there is no handler to handle form submission
    return (
        <div className={styles.stepsControllers} data-automation={dataAutomation}>
            {continueButton && (
                <Button
                    extraAttrs={
                        continueButton.dataAutomation
                            ? {"data-automation": `${continueButton.dataAutomation}`}
                            : undefined
                    }
                    className={styles.continueButton}
                    appearance="secondary"
                    type={"submit"}
                    onClick={continueButton.handler}>
                    {continueButton.label}
                </Button>
            )}
            {cancelButton && (
                <Button
                    extraAttrs={
                        cancelButton.dataAutomation ? {"data-automation": `${cancelButton.dataAutomation}`} : undefined
                    }
                    className={styles.cancelButton}
                    appearance="transparent"
                    type={"submit"}
                    onClick={cancelButton.handler}>
                    {cancelButton.label}
                </Button>
            )}
        </div>
    );
};

export default Controllers;
