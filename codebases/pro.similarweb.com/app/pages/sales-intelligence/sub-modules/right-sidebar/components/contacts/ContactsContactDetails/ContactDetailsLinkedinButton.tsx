import React from "react";
import { StyledLinkedin } from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsContactDetails/styles";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";

type ContactDetailsLinkedinButtonProps = {
    url: string;
};

const ContactsDetailsLinkedinButton: React.FC<ContactDetailsLinkedinButtonProps> = ({ url }) => {
    const translation = useTranslation();

    return (
        <PlainTooltip tooltipContent={translation("si.sidebar.contacts.btn.linkedin.tooltip")}>
            <StyledLinkedin>
                <a href={url} rel="noreferrer" target="_blank">
                    <SWReactIcons size="xs" iconName="social-linkedin" />
                </a>
            </StyledLinkedin>
        </PlainTooltip>
    );
};

export default ContactsDetailsLinkedinButton;
