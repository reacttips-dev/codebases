import getHexConsumerIdForUser from '../actions/getHexConsumerIdForUser';
import personaControlStore from '../store/Store';
import getPersonaControlKey from '../utils/getPersonaControlKey';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {
    Persona,
    PersonaCoin,
    PersonaPresence,
    PersonaSize,
    PersonaInitialsColor,
    IPersonaStyles,
    IPersonaProps,
    IPersonaCoinProps,
} from '@fluentui/react/lib/Persona';
import type { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazy/lazyIndex'));
const lazyGetPersonaPhoto = new LazyAction(lazyModule, m => m.getPersonaPhoto);

import styles from './PersonaControl.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export interface PersonaControlProps {
    emailAddress?: string;
    name?: string;
    size?: PersonaSize;
    className?: string;
    showPersonaDetails?: boolean;
    statusText?: string;
    secondaryText?: string;
    showSecondaryText?: boolean;
    showPresence?: boolean;
    presence?: PersonaPresence;
    hexConsumerIdForUser?: string;
    onRenderPrimaryText?: IRenderFunction<IPersonaProps>;
    onRenderInitials?: IRenderFunction<IPersonaProps>;
    onRenderCoin?: IRenderFunction<IPersonaProps>;
    personaId?: string;
    initialsColor?: PersonaInitialsColor | string;
    showUnknownPersonaCoin?: boolean;
    mailboxType?: string;
    styleProps?: Partial<IPersonaStyles>;
    coinProps?: Partial<IPersonaCoinProps>;
    skipLoadingPhoto?: () => boolean;
    imageInitials?: string;
}

export default observer(function PersonaControl(props: PersonaControlProps) {
    props = {
        emailAddress: '',
        name: '',
        size: PersonaSize.regular,
        secondaryText: '',
        showPresence: false,
        mailboxType: '',
        ...props,
    };

    const personaControlKey = getPersonaControlKey(
        props.emailAddress,
        props.personaId,
        props.size,
        props.mailboxType,
        props.name
    );

    React.useEffect(() => {
        fetchPersonaPhoto(props);
    }, [personaControlKey]);

    const viewState = personaControlStore.viewStates.get(personaControlKey);

    if (!viewState) {
        return null;
    }

    const {
        className,
        size,
        name,
        statusText,
        showPersonaDetails,
        secondaryText,
        showSecondaryText,
        presence,
        onRenderPrimaryText,
        onRenderCoin,
        initialsColor,
        onRenderInitials,
        styleProps,
        coinProps,
        showUnknownPersonaCoin,
        imageInitials,
    } = props;

    const photoDisplayProps = viewState.personaBlob?.blobUrl
        ? {
              imageUrl: viewState.personaBlob.blobUrl,
              imageShouldFadeIn: false,
              imageShouldStartVisible: true,
          }
        : {};

    // Only use Persona control if details are given that a PersonaCoin doesn't have
    if (showPersonaDetails || showSecondaryText || statusText) {
        return (
            <Persona
                className={classNames(className, styles.persona)}
                presence={presence || PersonaPresence.none}
                hidePersonaDetails={!showPersonaDetails}
                size={size}
                text={name}
                secondaryText={secondaryText}
                showSecondaryText={showSecondaryText}
                tertiaryText={statusText}
                onRenderPrimaryText={onRenderPrimaryText}
                onRenderCoin={onRenderCoin}
                onRenderInitials={onRenderInitials}
                {...photoDisplayProps}
                initialsColor={initialsColor}
                showUnknownPersonaCoin={showUnknownPersonaCoin}
                styles={styleProps}
                coinProps={coinProps}
                imageInitials={imageInitials}
            />
        );
    }

    // Use simpler PersonaCoin control if only picture / initials are needed
    return (
        <PersonaCoin
            {...coinProps}
            className={classNames(className, styles.persona)}
            presence={presence || PersonaPresence.none}
            size={size}
            text={name}
            onRenderCoin={onRenderCoin}
            onRenderInitials={onRenderInitials}
            {...photoDisplayProps}
            initialsColor={initialsColor}
            showUnknownPersonaCoin={showUnknownPersonaCoin}
            showInitialsUntilImageLoads={true}
            imageInitials={imageInitials}
        />
    );
});

function fetchPersonaPhoto(props: PersonaControlProps) {
    if (props.emailAddress || props.name || props.personaId) {
        lazyGetPersonaPhoto.importAndExecute(
            props.name,
            props.emailAddress,
            props.personaId,
            props.size,
            props.hexConsumerIdForUser || getHexConsumerIdForUser(props.emailAddress),
            props.mailboxType,
            props.skipLoadingPhoto
        );
    }
}
