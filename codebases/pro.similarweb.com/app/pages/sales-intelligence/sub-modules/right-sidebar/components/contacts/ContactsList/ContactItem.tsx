import React from "react";
import Contact from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsContact/Contact";
import ContactsDetailsInfoMain from "../ContactsDetailsInfo/ContactsDetailsInfoMain";
import ContactDetailsButton from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsContactDetails/ContactDetailsButton";
import ContactsDetailsLinkedinButton from "../ContactsContactDetails/ContactDetailsLinkedinButton";
import Photo from "../ContactstImage/Photo";
import { Contact as ContactType } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { splitPhoneNumbers } from "../../../helpers/contacts";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";
import {
    StyledContactsListItem,
    StyledContactsListItemContact,
    StyledContactsListItemContactDetails,
    StyledContactsListWrapperItem,
} from "./styles";
import { ContactItemContext } from "../../../contexts/ContactItemContext";

type ContactsListItemProps = {
    contact: ContactType;
    fetchContactPrivateData(contactId: string, domain: string): void;
    domain: string;
    contactsQuota: number;
    observerRef?: (node: HTMLInputElement | null) => void;
};

const ContactsListItem: React.FC<ContactsListItemProps> = ({
    contact,
    fetchContactPrivateData,
    domain,
    contactsQuota,
    observerRef,
}) => {
    const {
        fullName,
        jobTitle,
        departments,
        emails = [],
        phoneNumbers = [],
        contactId,
        imageUrl,
        seniority,
        linkedInUrl,
        isPrivateDataUnlocked,
    } = contact;

    const [isWaiting, setWaiting] = React.useState(false);
    const [isOpenDetailsInfo, toggleOpenDetails] = React.useState(false);
    const [isRevealed, setRevealedStatus] = React.useState(isPrivateDataUnlocked);
    const tracking = useContactsTrackingService();

    React.useEffect(() => {
        if (isWaiting && isPrivateDataUnlocked) {
            setWaiting(false);
        }
    }, [isPrivateDataUnlocked]);

    const openContactDetails = () => {
        toggleOpenDetails(true);
        setWaiting(true);
        fetchContactPrivateData(contactId, domain);
    };

    const setUpRevealed = (): void => !isRevealed && setRevealedStatus(true);

    const handleOnClickDetailsInfo = () => {
        if (isWaiting || contactsQuota === 0) {
            return undefined;
        }

        if (isPrivateDataUnlocked && contactsQuota) {
            !isOpenDetailsInfo && tracking.trackExpandContact("Revealed", seniority, jobTitle);
            setUpRevealed();
            return toggleOpenDetails(!isOpenDetailsInfo);
        }

        if (!isPrivateDataUnlocked && contactsQuota) {
            tracking.trackExpandContact("New", seniority, jobTitle);
            return openContactDetails();
        }
    };

    const handleOnClose = (): void => {
        if (!isWaiting) {
            toggleOpenDetails(false);
            setUpRevealed();
        }
    };

    const contextValue = React.useMemo(() => {
        return {
            isRevealed,
            role: jobTitle,
        };
    }, [isRevealed]);

    const { phones, mobiles } = splitPhoneNumbers(phoneNumbers);

    return (
        <ContactItemContext.Provider value={contextValue}>
            <StyledContactsListWrapperItem ref={observerRef}>
                <StyledContactsListItem extend={isOpenDetailsInfo}>
                    <StyledContactsListItemContact>
                        <Photo src={imageUrl} />
                        <Contact
                            unlocked={isPrivateDataUnlocked}
                            name={fullName}
                            departments={departments}
                            position={jobTitle}
                        />
                    </StyledContactsListItemContact>
                    <StyledContactsListItemContactDetails clicked={isOpenDetailsInfo}>
                        <ContactDetailsButton
                            hasEmail={emails.length > 0}
                            hasPhone={phones.length > 0}
                            hasMobile={mobiles.length > 0}
                            unlocked={isPrivateDataUnlocked}
                            loading={isWaiting}
                            onClick={handleOnClickDetailsInfo}
                            contactsQuota={contactsQuota}
                            isClicked={isOpenDetailsInfo}
                        />
                        {linkedInUrl && <ContactsDetailsLinkedinButton url={linkedInUrl} />}
                    </StyledContactsListItemContactDetails>
                </StyledContactsListItem>
                <ContactsDetailsInfoMain
                    loading={isWaiting}
                    isOpen={isOpenDetailsInfo}
                    onClose={handleOnClose}
                    emails={emails}
                    phones={phones}
                    mobiles={mobiles}
                />
            </StyledContactsListWrapperItem>
        </ContactItemContext.Provider>
    );
};

export default ContactsListItem;
