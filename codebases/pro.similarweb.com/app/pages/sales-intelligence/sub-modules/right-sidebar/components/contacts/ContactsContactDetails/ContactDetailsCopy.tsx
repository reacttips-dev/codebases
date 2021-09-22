import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledContactsDetailsCopy } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";

type ContactDetailsCopy = {
    onCopy(): void;
};

const ContactsDetailsCopy: React.FC<ContactDetailsCopy> = ({ onCopy }) => {
    const translate = useTranslation();

    return (
        <PlainTooltip tooltipContent={translate("si.sidebar.contacts.contacts_details_info.copy")}>
            <StyledContactsDetailsCopy onClick={onCopy}>
                <SWReactIcons iconName="copy" size={"xs"} />
            </StyledContactsDetailsCopy>
        </PlainTooltip>
    );
};

export default ContactsDetailsCopy;
