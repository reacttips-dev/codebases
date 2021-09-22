import React from "react";
import { StyledContactsDetailsButton } from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsContactDetails/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import useContactsDetailsTooltipConfig from "../../../hooks/useContactsDetailsTooltipConfig";

type ContactsDetailsButtonProps = {
    loading: boolean;
    onClick(): void;
    unlocked: boolean;
    contactsQuota: number;
    isClicked: boolean;
    hasPhone: boolean;
    hasMobile: boolean;
    hasEmail: boolean;
};

const ContactDetailsButton: React.FC<ContactsDetailsButtonProps> = ({
    onClick,
    isClicked,
    unlocked,
    contactsQuota,
    loading,
    hasPhone,
    hasEmail,
    hasMobile,
}) => {
    const tooltipConfig = useContactsDetailsTooltipConfig(unlocked, contactsQuota, isClicked);
    return (
        <PlainTooltip {...tooltipConfig}>
            <StyledContactsDetailsButton
                hasPhone={hasPhone}
                hasEmail={hasEmail}
                hasMobile={hasMobile}
                onClick={onClick}
                loading={loading}
            >
                <SWReactIcons className="mobile-web" size="xs" iconName="mobile-web" />
                <SWReactIcons className="phone" size="xs" iconName="phone" />
                <SWReactIcons className="email" size="xs" iconName="email" />
            </StyledContactsDetailsButton>
        </PlainTooltip>
    );
};

export default ContactDetailsButton;
