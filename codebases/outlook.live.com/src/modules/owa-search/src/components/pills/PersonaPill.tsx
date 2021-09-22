import { observer } from 'mobx-react-lite';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import * as React from 'react';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';

import searchBoxPillWellStyles from './SearchBoxPillWell.scss';

export interface PersonaPillProps extends PersonaCardBehaviorProps {
    isSelected: boolean;
    displayText: string;
}

export default observer(function PersonaPill(props: PersonaPillProps) {
    const PersonaCardBehavior = useLivePersonaCard(props);
    const pillDiv = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        if (props.isSelected && pillDiv.current) {
            pillDiv.current.focus();
        }
    });

    return (
        <PersonaCardBehavior>
            <div className={searchBoxPillWellStyles.personaPill} ref={pillDiv} tabIndex={-1}>
                <PersonaControl
                    name={props.name}
                    emailAddress={props.emailAddress}
                    size={PersonaSize.size24}
                    mailboxType={props.mailBoxType}
                />
                <div className={searchBoxPillWellStyles.personaPillNameText}>
                    {props.displayText}
                </div>
            </div>
        </PersonaCardBehavior>
    );
});
