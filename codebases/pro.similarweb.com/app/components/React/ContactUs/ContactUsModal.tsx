import * as React from "react";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import ContactUsInline from "./ContactUsInline";

const proModalStyles: IProModalCustomStyles = {
    overlay: {
        zIndex: 2079,
    },
    content: {
        width: "550px",
        padding: 0,
        border: 0,
    },
};

export interface IContactUsModalProps {
    isOpen: boolean;
    location: string;
    label: string;
    onClose: () => void;
}

export const ContactUsModal: React.FunctionComponent<IContactUsModalProps> = (props) => {
    const { isOpen, location, label, onClose } = props;
    return (
        <ProModal isOpen={isOpen} onCloseClick={onClose} customStyles={proModalStyles}>
            <ContactUsInline location={location} label={label} onClose={onClose} />
        </ProModal>
    );
};
