import * as React from 'react';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import PersonaControl from '../PersonaControl';
import type { PrivateDistributionListMember } from 'owa-persona-models';

import styles from './MultiPersonaControl.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface Props {
    personas: PrivateDistributionListMember[];
    isSearchPill: boolean; // true if the control is displayed from Search Box
}

export default function multiPersonaControl(props: Props): JSX.Element {
    if (props.personas.length === 0) {
        return null;
    }

    const personaSize = props.isSearchPill ? PersonaSize.size24 : PersonaSize.size48;
    const personaMinimizedSize = props.isSearchPill ? PersonaSize.size16 : PersonaSize.size24;
    const personaSizeStyle = props.isSearchPill ? styles.sizeSmall : styles.sizeBig;

    if (props.personas.length === 1) {
        return (
            <PersonaControl
                name={props.personas[0].name}
                emailAddress={props.personas[0].emailAddress}
                size={personaSize}
                mailboxType={''}
            />
        );
    }

    if (props.personas.length === 2 || props.isSearchPill) {
        const personaLeft = props.personas[0];
        const personaRight = props.personas[1];

        return (
            <div className={classNames(styles.multiPersonContainer, personaSizeStyle)}>
                <PersonaControl
                    name={personaLeft.name}
                    emailAddress={personaLeft.emailAddress}
                    size={personaSize}
                    className={styles.leftPersona}
                    mailboxType={''}
                />
                <PersonaControl
                    name={personaRight.name}
                    emailAddress={personaRight.emailAddress}
                    size={personaSize}
                    className={classNames(styles.leftPersona, styles.leftDivider)}
                    mailboxType={''}
                />
            </div>
        );
    }

    // 3 or more personas -> show only first 3
    const personaLeft = props.personas[0];
    const personaRightTop = props.personas[1];
    const personaRightBottom = props.personas[2];

    return (
        <div className={classNames(styles.multiPersonContainer, personaSizeStyle)}>
            <PersonaControl
                name={personaLeft.name}
                emailAddress={personaLeft.emailAddress}
                size={personaSize}
                className={styles.leftPersona}
            />
            <div className={styles.rightContainer}>
                <PersonaControl
                    name={personaRightTop.name}
                    emailAddress={personaRightTop.emailAddress}
                    size={personaMinimizedSize}
                    className={styles.topRightPersona}
                />
                <PersonaControl
                    name={personaRightBottom.name}
                    emailAddress={personaRightBottom.emailAddress}
                    size={personaMinimizedSize}
                    className={styles.bottomRightPersona}
                />
            </div>
        </div>
    );
}
