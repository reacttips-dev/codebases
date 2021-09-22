import { Button, ButtonType } from "@similarweb/ui-components/dist/button";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { openContactUsModal } from "services/ModalService";

interface IContactUsButtonProps {
    label: string; // Name of parent component (e.g. "Trial Banner")
    className?: string;
    text?: string;
    buttonType?: ButtonType;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const ContactUsButton: React.FunctionComponent<IContactUsButtonProps> = (props) => {
    const { className, text, label, buttonType, style, children, onClick } = props;

    return (
        <Button
            className={className}
            type={(buttonType as ButtonType) || "upsell"}
            style={{
                lineHeight: "normal",
                ...style,
            }}
            onClick={() => {
                openContactUsModal(label);
                onClick();
            }}
        >
            {text ? i18nFilter()(text) : children}
        </Button>
    );
};

ContactUsButton.defaultProps = {
    onClick: () => undefined,
};

SWReactRootComponent(ContactUsButton, "ContactUsButton");

export default ContactUsButton;
