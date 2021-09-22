import React from "react";
import { ContactsDetailsEmailProps } from "./ContactDetailsEmail";
import { ContactsDetailsPhoneProps } from "./ContactDetailsPhone";
import { PhoneNumber } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { ContactsDetailsLoadingStateProps } from "../ContactsDetailsEmptyState/ContactsDetailsLoadingState";

type ContactsDetailsItemsType = {
    items: Array<string | PhoneNumber>;
    iconName?: string;
    Component: React.FC<
        ContactsDetailsPhoneProps | ContactsDetailsEmailProps | ContactsDetailsLoadingStateProps
    >;
};

const ContactDetailsList: React.FC<ContactsDetailsItemsType> = ({
    items = [],
    iconName,
    Component,
}) => {
    return (
        <>
            {items.map((value, index) => {
                return (
                    <Component
                        key={index}
                        iconName={iconName}
                        value={value}
                        withIcon={index === 0}
                    />
                );
            })}
        </>
    );
};

export default ContactDetailsList;
