import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import ContactsDetailsCopy from "./ContactDetailsCopy";
import { clipBoard } from "../../../helpers/contacts";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";
import { ContactItemContext } from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactItemContext";
import {
    StyledContactsDetailsItem,
    StyledContactsDetailsEmailIcon,
    StyledContactsDetailsItemValue,
} from "./styles";

export type ContactsDetailsEmailProps = {
    value: string;
    withIcon?: boolean;
};

const ContactDetailsEmail: React.FC<ContactsDetailsEmailProps> = ({ value, withIcon }) => {
    const { isRevealed, role } = React.useContext(ContactItemContext);
    const tracking = useContactsTrackingService();
    const onCopy = () => {
        tracking.trackCopyDetailsContact(isRevealed, "email", role);
        clipBoard(value);
    };
    return (
        <StyledContactsDetailsItem>
            <StyledContactsDetailsEmailIcon>
                {withIcon && <SWReactIcons iconName="email" size="xs" />}
            </StyledContactsDetailsEmailIcon>
            <StyledContactsDetailsItemValue>{value}</StyledContactsDetailsItemValue>
            <ContactsDetailsCopy onCopy={onCopy} />
        </StyledContactsDetailsItem>
    );
};

export default ContactDetailsEmail;
