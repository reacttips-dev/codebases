import * as React from 'react';
import { observer } from 'mobx-react-lite';
import personaControlStore from '../store/Store';
import type { PersonaSize } from '@fluentui/react/lib/Persona';
import type { IStyle } from '@fluentui/style-utilities';
import { isFeatureEnabled } from 'owa-feature-flags';

// Keep in sync in interface of the exported component of LPC
interface LPCPersonaRingBehaviorProps {
    personaSize: PersonaSize;
    styles?: {
        root?: IStyle;
        ringContainer?: IStyle;
    };
    identifiers: {
        HostAppPersonaId?: string;
        OlsPersonaId?: string;
        LocationId?: string;
        AadObjectId?: string;
        SatoriId?: string;
        Smtp?: string;
        PersonaType: string;
        PermanentEntryId?: string;
        DisplayName?: string;
        TopicId?: string;
    };
    onPersonaInsightRingStateChange?: (displayRing: boolean) => void;
    children?: React.ReactNode;
}

interface PersonaRingBehaviorProps extends LPCPersonaRingBehaviorProps {
    displayPersonaHighlightRing?: boolean;
}

const PersonaRingBehavior = observer(function PersonaRingBehaviorWrapper({
    personaSize,
    identifiers,
    styles,
    children,
    onPersonaInsightRingStateChange,
}: PersonaRingBehaviorProps) {
    const personaTypeIsUser =
        identifiers.PersonaType === 'User' || identifiers.PersonaType === 'NotResolved';
    const PersonaInsightRing = (window as any)
        .PersonaInsightRing as React.ComponentType<LPCPersonaRingBehaviorProps>;

    if (
        !PersonaInsightRing ||
        !personaControlStore.isLivePersonaCardInitialized ||
        !personaTypeIsUser
    ) {
        return <>{children}</>;
    }

    return (
        <PersonaInsightRing
            identifiers={identifiers}
            styles={styles}
            personaSize={personaSize}
            onPersonaInsightRingStateChange={onPersonaInsightRingStateChange}>
            {children}
        </PersonaInsightRing>
    );
});

export function usePersonaRingBehavior(props: PersonaRingBehaviorProps): React.ComponentType<{}> {
    return observer(({ children }: { children?: React.ReactNode }) => {
        const personaRingFeatureEnabled = isFeatureEnabled('lpc-isPersonaInsightRingEnabled');

        if (personaRingFeatureEnabled && props.displayPersonaHighlightRing) {
            return <PersonaRingBehavior {...props}>{children}</PersonaRingBehavior>;
        } else {
            return <>{children}</>;
        }
    });
}
