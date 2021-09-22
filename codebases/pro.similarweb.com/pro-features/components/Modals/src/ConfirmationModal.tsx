import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import { ButtonGroup } from "../../ButtonsGroup/src/ButtonsGroup";
import { ProModal } from "../src/ProModal";

export interface IConfirmationModalProps {
    isOpen: boolean;
    onCloseClick: () => void;
    onCancelClick: () => void;
    onApproveClick: () => void;
    cancelButtonText: string;
    approveButtonText: string;
    approveButtonIsLoading?: boolean;
    approveButtonIsDisabled?: boolean;
    extraComponent?: React.ReactNode;
}

export const ConfirmationModal: StatelessComponent<IConfirmationModalProps> = ({
    isOpen,
    onCloseClick,
    onApproveClick,
    approveButtonText,
    approveButtonIsLoading = false,
    approveButtonIsDisabled = false,
    onCancelClick,
    cancelButtonText,
    children,
}) => {
    const moreProps: any = {
        customStyles: {
            content: {
                boxSizing: "content-box",
                width: "518px",
            },
        },
    };
    return (
        <div>
            <ProModal isOpen={isOpen} onCloseClick={onCloseClick} {...moreProps}>
                <div>
                    {children}
                    <ButtonGroup>
                        <Button
                            type="flatWarning"
                            onClick={onApproveClick}
                            isLoading={approveButtonIsLoading}
                            isDisabled={approveButtonIsDisabled}
                        >
                            <ButtonLabel>{approveButtonText}</ButtonLabel>
                        </Button>
                        <Button type="flat" onClick={onCancelClick}>
                            <ButtonLabel>{cancelButtonText}</ButtonLabel>
                        </Button>
                    </ButtonGroup>
                </div>
            </ProModal>
        </div>
    );
};
ConfirmationModal.displayName = "ConfirmationModal";
