import React from "react";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PhoneNumber } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import ContactsDetailsInfoLoading from "./ContactsDetailsInfoLoading";
import ContactsDetailsInfo from "./ContactsDetailsInfo";
import {
    StyledContactsDetailsInfo,
    StyledContactsDetailsInfoContent,
    StyledContactsDetailsInfoHeader,
    StyledContactsDetailsInfoTitle,
    StyledWrapperContactsDetailsInfo,
} from "../ContactsContactDetails/styles";

type ContactDetailsInfoProps = {
    isOpen: boolean;
    onClose(): void;
    emails: string[];
    mobiles: PhoneNumber[];
    phones: PhoneNumber[];
    loading: boolean;
};

const ContactsDetailsInfoMain: React.FC<ContactDetailsInfoProps> = (props) => {
    const translate = useTranslation();
    const { isOpen, onClose, emails, mobiles, phones, loading } = props;

    const renderDetailsInfo = () => {
        if (loading) {
            return <ContactsDetailsInfoLoading phones={phones} mobiles={mobiles} emails={emails} />;
        }
        return <ContactsDetailsInfo phones={phones} mobiles={mobiles} emails={emails} />;
    };

    return (
        <StyledContactsDetailsInfo>
            <Collapsible isActive={isOpen}>
                <StyledWrapperContactsDetailsInfo>
                    <StyledContactsDetailsInfoHeader>
                        <StyledContactsDetailsInfoTitle>
                            {translate("si.sidebar.contacts.contacts_details_info.title")}
                        </StyledContactsDetailsInfoTitle>
                        <PlainTooltip tooltipContent={translate("Close")}>
                            <div>
                                <IconButton
                                    type="flat"
                                    iconSize="sm"
                                    iconName="chev-up"
                                    onClick={onClose}
                                />
                            </div>
                        </PlainTooltip>
                    </StyledContactsDetailsInfoHeader>
                    <StyledContactsDetailsInfoContent>
                        {renderDetailsInfo()}
                    </StyledContactsDetailsInfoContent>
                </StyledWrapperContactsDetailsInfo>
            </Collapsible>
        </StyledContactsDetailsInfo>
    );
};

export default ContactsDetailsInfoMain;
