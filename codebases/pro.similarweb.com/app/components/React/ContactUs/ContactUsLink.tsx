import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { openContactUsModal } from "services/ModalService";

interface IContactUsLinkProps {
    label: string; // Name of parent component (e.g. "Trial Banner")
    className?: string;
    text?: string;
    onClick?: () => void;
}

const ContactUsLink: React.FunctionComponent<IContactUsLinkProps> = (props) => {
    const { children, className, label, text, onClick } = props;

    return (
        <a
            className={className}
            onClick={() => {
                openContactUsModal(label);
                onClick();
            }}
        >
            {text ? i18nFilter()(text) : children}
        </a>
    );
};

ContactUsLink.defaultProps = {
    onClick: () => undefined,
};

SWReactRootComponent(ContactUsLink, "ContactUsLink");

export default ContactUsLink;
