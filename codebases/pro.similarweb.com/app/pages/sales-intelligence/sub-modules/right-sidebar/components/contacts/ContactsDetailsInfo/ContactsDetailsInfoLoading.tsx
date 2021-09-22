import React from "react";
import ContactDetailsList from "../ContactsContactDetails/ContactDetailsList";
import {
    FAKE_CONTACTS_DETAILS_EMAILS,
    FAKE_CONTACTS_DETAILS_PHONE,
    FAKE_CONTACTS_MOBILE_PHONE,
} from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import ContactsDetailsLoadingState from "../ContactsDetailsEmptyState/ContactsDetailsLoadingState";
import { PhoneNumber } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { StyledContactsDetailsInfoGroup, StyledContactsDetailsLoadingGroup } from "./styles";

type ContactsDetailsInfoLoadingType = {
    emails: string[];
    mobiles: PhoneNumber[];
    phones: PhoneNumber[];
};

const ContactsDetailsInfoLoading: React.FC<ContactsDetailsInfoLoadingType> = ({
    emails,
    mobiles,
    phones,
}) => {
    const renderPhones = () => {
        if (mobiles.length > 0 || phones.length > 0) {
            const fakeMobiles = mobiles.length > 0 ? FAKE_CONTACTS_MOBILE_PHONE : [];
            const fakePhones = phones.length > 0 ? FAKE_CONTACTS_DETAILS_PHONE : [];

            return (
                <StyledContactsDetailsInfoGroup>
                    <ContactDetailsList
                        Component={ContactsDetailsLoadingState}
                        items={fakePhones}
                        iconName="phone"
                    />
                    <ContactDetailsList
                        Component={ContactsDetailsLoadingState}
                        items={fakeMobiles}
                        iconName="mobile-web"
                    />
                </StyledContactsDetailsInfoGroup>
            );
        }
    };

    const renderEmails = () => {
        if (emails.length > 0) {
            return (
                <StyledContactsDetailsInfoGroup>
                    <ContactDetailsList
                        Component={ContactsDetailsLoadingState}
                        items={FAKE_CONTACTS_DETAILS_EMAILS}
                        iconName="email"
                    />
                </StyledContactsDetailsInfoGroup>
            );
        }
    };

    return (
        <>
            <StyledContactsDetailsLoadingGroup>
                {renderPhones()}
                {renderEmails()}
            </StyledContactsDetailsLoadingGroup>
        </>
    );
};

export default ContactsDetailsInfoLoading;
