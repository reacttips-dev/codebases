import { ProModal } from "components/Modals/src/ProModal";
import {
    CustomCategoriesWizardReact,
    ICustomCategoriesWizardReactProps,
} from "components/customCategoriesWizard/custom-categories-wizard-react";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";

interface ICustomCategoriesWizardProps {
    isOpen: boolean;
    onClose: VoidFunction;
    wizardProps: Omit<ICustomCategoriesWizardReactProps, "onClose">;
}
export const CustomCategoriesWizard: React.FC<ICustomCategoriesWizardProps> = ({
    isOpen,
    onClose,
    wizardProps,
}) => {
    if (!isOpen) {
        return null;
    }
    const customStyles = {
        content: {
            padding: 0,
        },
    };
    return (
        <ProModal
            portalClassName="customCategoriesWizardWindow"
            isOpen={true}
            customStyles={customStyles}
            shouldCloseOnOverlayClick={true}
            onCloseClick={onClose}
        >
            <CustomCategoriesWizardReact {...wizardProps} onClose={onClose} />
        </ProModal>
    );
};
// DO NOT USE NG-REACT with this component
SWReactRootComponent(CustomCategoriesWizard, "CustomCategoriesWizard");
