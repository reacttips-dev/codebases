import React from "react";
import ContactDetailsPhone from "../ContactsContactDetails/ContactDetailsPhone";
import ContactDetailsEmail from "../ContactsContactDetails/ContactDetailsEmail";
import ContactDetailsList from "../ContactsContactDetails/ContactDetailsList";
import { PhoneNumber } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { StyledContactsDetailsInfoGroup } from "./styles";

type ContactsDetailsInfoType = {
    emails: string[];
    mobiles: PhoneNumber[];
    phones: PhoneNumber[];
};

const ContactsDetailsInfo: React.FC<ContactsDetailsInfoType> = ({ phones, mobiles, emails }) => {
    return (
        <>
            {(phones.length > 0 || mobiles.length > 0) && (
                <StyledContactsDetailsInfoGroup>
                    <ContactDetailsList
                        iconName="phone"
                        Component={ContactDetailsPhone}
                        items={phones}
                    />
                    <ContactDetailsList
                        iconName="mobile-web"
                        Component={ContactDetailsPhone}
                        items={mobiles}
                    />
                </StyledContactsDetailsInfoGroup>
            )}
            {emails.length > 0 && (
                <StyledContactsDetailsInfoGroup>
                    <ContactDetailsList
                        iconName="email"
                        Component={ContactDetailsEmail}
                        items={emails}
                    />
                </StyledContactsDetailsInfoGroup>
            )}
        </>
    );
};

export default ContactsDetailsInfo;
