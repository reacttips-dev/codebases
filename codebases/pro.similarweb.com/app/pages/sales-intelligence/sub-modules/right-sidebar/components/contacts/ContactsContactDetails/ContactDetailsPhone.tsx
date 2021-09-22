import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import ContactsDetailsCopy from "./ContactDetailsCopy";
import {
    clipBoard,
    concatContactsPhone,
} from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/contacts";
import { PhoneNumber } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";
import { ContactItemContext } from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactItemContext";
import {
    StyledContactsDetailsItem,
    StyledContactsDetailsPhoneIcon,
    StyledContactsDetailsItemValue,
} from "./styles";

export type ContactsDetailsPhoneProps = {
    value: PhoneNumber;
    withIcon?: boolean;
    iconName: string;
};

const ContactDetailsPhone: React.FC<ContactsDetailsPhoneProps> = ({
    value,
    withIcon,
    iconName,
}) => {
    const { isRevealed, role } = React.useContext(ContactItemContext);
    const { number, type } = value;
    const phone = concatContactsPhone(number, type);
    const tracking = useContactsTrackingService();
    const phoneType = iconName === "mobile-web" ? "mobile_phone" : "office_phone";

    const onCopy = () => {
        tracking.trackCopyDetailsContact(isRevealed, phoneType, role);
        clipBoard(number);
    };
    return (
        <StyledContactsDetailsItem>
            <StyledContactsDetailsPhoneIcon>
                {withIcon && <SWReactIcons iconName={iconName} size="xs" />}
            </StyledContactsDetailsPhoneIcon>
            <StyledContactsDetailsItemValue>{phone}</StyledContactsDetailsItemValue>
            <ContactsDetailsCopy onCopy={onCopy} />
        </StyledContactsDetailsItem>
    );
};

export default ContactDetailsPhone;
