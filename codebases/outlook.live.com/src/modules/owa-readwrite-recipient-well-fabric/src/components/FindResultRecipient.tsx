/* tslint:disable:jsx-no-lambda WI:47753 */
import CommonFloatPickerItem from 'owa-readwrite-common-well/lib/components/CommonFloatingPickerItem';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import * as React from 'react';
import { PersonaSize, PersonaInitialsColor } from '@fluentui/react/lib/Persona';
import type { ITheme } from '@fluentui/style-utilities';
import { ControlIcons } from 'owa-control-icons';
import { Icon } from '@fluentui/react/lib/Icon';

import styles from './FindResultRecipient.scss';
import classNames from 'classnames';

export interface FindResultRecipientProps {
    persona: FindRecipientPersonaType;
    itemProps: any;
    theme?: ITheme;
}

const FindResultRecipient = (props: FindResultRecipientProps) => {
    let { itemProps, persona, theme } = props;

    let isImplicitGroupPersona =
        persona.PersonaTypeString &&
        persona.PersonaTypeString == 'ImplicitGroup' &&
        persona.Members &&
        persona.Members.length > 0;

    return (
        <div className={styles.selectedPeopleList}>
            <CommonFloatPickerItem
                key={persona.EmailAddress.EmailAddress}
                pickerItemData={persona}
                isHighlighted={itemProps.suggestionModel.selected}
                personaControl={
                    <RecipientPersonaControl
                        persona={persona}
                        isImplicitGroupPersona={isImplicitGroupPersona}
                    />
                }
                firstLineElement={<FindRecipientFirstLine persona={persona} />}
                secondLineElement={
                    <FindRecipientSecondLine
                        persona={persona}
                        isImplicitGroupPersona={isImplicitGroupPersona}
                    />
                }
                addPickerItemAction={() => {
                    /* no-op*/
                }}
                theme={theme}
            />
        </div>
    );
};

export const FindRecipientFirstLine = ({
    persona,
}: {
    persona: FindRecipientPersonaType;
}): JSX.Element => {
    const emailObj = persona.EmailAddress;
    return (
        <span className={classNames(styles.personaLineOne, styles.personaTextLine)}>
            <span className={styles.personaLineOneText}>{emailObj.Name}</span>
            {emailObj.MailboxType == 'LinkedIn' && (
                <Icon className={styles.linkedInIcon} iconName={ControlIcons.LinkedInLogo} />
            )}
        </span>
    );
};

export const FindRecipientSecondLine = ({
    persona,
    isImplicitGroupPersona,
}: {
    persona: FindRecipientPersonaType;
    isImplicitGroupPersona: boolean;
}): JSX.Element => {
    if (!isImplicitGroupPersona) {
        return (
            <span className={classNames(styles.personaLineTwo, styles.personaTextLine)}>
                {persona.EmailAddress.EmailAddress}
            </span>
        );
    }

    let memberPersonas = persona.Members.map(member => {
        return (
            <div className={styles.memberPersonaImage} key={member.EmailAddress}>
                <PersonaControl
                    key={member.EmailAddress}
                    name={member.Name}
                    emailAddress={member.EmailAddress}
                    size={PersonaSize.size16}
                    showPersonaDetails={false}
                    mailboxType={persona.EmailAddress.MailboxType}
                />
            </div>
        );
    });

    return <>{memberPersonas}</>;
};

export const RecipientPersonaControl = ({
    persona,
    isImplicitGroupPersona,
}: {
    persona: FindRecipientPersonaType;
    isImplicitGroupPersona: boolean;
}): JSX.Element => {
    const implicitGroupName = 'Implicit Group';
    const recipientEmail = persona.EmailAddress.EmailAddress;
    const recipientName = persona.EmailAddress.Name;
    const mailboxType = persona.EmailAddress.MailboxType;

    if (isImplicitGroupPersona) {
        return (
            <PersonaControl
                name={implicitGroupName}
                emailAddress={recipientEmail}
                size={PersonaSize.size32}
                showPersonaDetails={false}
                initialsColor={PersonaInitialsColor.lightBlue}
                mailboxType={mailboxType}
            />
        );
    }

    return (
        <PersonaControl
            name={recipientName}
            emailAddress={recipientEmail}
            size={PersonaSize.size32}
            showPersonaDetails={false}
            mailboxType={mailboxType}
        />
    );
};

export default FindResultRecipient;
