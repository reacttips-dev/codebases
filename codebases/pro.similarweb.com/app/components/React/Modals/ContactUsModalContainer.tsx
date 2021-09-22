import { ContactUsModal, IContactUsModalProps } from "components/React/ContactUs/ContactUsModal";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { connect } from "react-redux";
import LocationService from "../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { closeContactUsModal } from "../../../actions/contactUsModalActions";

export const ContactUsModalContainer: React.FunctionComponent<IContactUsModalProps> = (props) => {
    return <ContactUsModal {...props} />;
};

ContactUsModalContainer.displayName = "ContactUsModalContainer";

const mapStateToProps = ({ contactUsModal }) => {
    const { isOpen, label } = contactUsModal;
    const location = `${LocationService.getCurrentLocation()}/${label}`;

    return {
        isOpen,
        location,
        label,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        onClose: () => {
            dispatch(closeContactUsModal());
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(ContactUsModalContainer),
    "ContactUsModal",
);
