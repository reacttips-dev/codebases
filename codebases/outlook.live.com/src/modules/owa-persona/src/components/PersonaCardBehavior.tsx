import { TopicCardMetadata } from '@1js/cortex-topics-types';
import { getPersonaInitialsColor, PersonaSize } from '@fluentui/react/lib/Persona';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lokiClientCorrelationId } from 'owa-people-loki';
import { lazyLogEvent } from 'owa-topic-annotations/lib/lazyFunctions';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import initializeLivePersonaCard from '../actions/initializeLivePersonaCard';
import type ComposeEmailFunction from '../ComposeEmailFunction';
import fetchBrandList from '../services/fetchBrandList';
import personaControlStore from '../store/Store';
import { calculatePersonaSize } from '../utils/calculatePersonaSize';
import { calculatePersonaType, LivePersonaCardPersonaTypes } from '../utils/calculatePersonaType';
import { usePersonaRingBehavior } from './PersonaRingBehavior';

export interface PersonaCardBehaviorInputProps {
    emailAddress: string | undefined;
    name: string | undefined;
    olsPersonaId?: string;
    topicId?: string;
    personaType?: string;
    composeEmailOverride?: ComposeEmailFunction;
    disableHover?: boolean;
    ariaLabel?: string;
    className?: string;
    mailBoxType?: string;
    isUnauthenticatedSender?: boolean;
    locationToOpen?: string;
    clientScenario?: string;
    focusReturnElement?:
        | HTMLElement
        | React.RefObject<HTMLElement>
        | React.MutableRefObject<HTMLElement>;
    aadObjectId?: string;
    displayPersonaHighlightRing?: boolean;
    size?: PersonaSize;
    /**
     * Mounts the hover target around the child without needing a wrapper span.
     *
     * If this is set, the rendered ReactElement of the child _must_ be able to
     * accept a `className` prop, since LPC clones & appends a special
     * hover-target class name . (e.g. it  cannot be a fragment)
     */
    mountWithoutWrapperSpan?: boolean;
    /**
     * If this is set, it disables data-is-focusable on the wrapper element
     */
    disableAccessibilityDefaults?: boolean;
    /**
     * This callback function is used to close the transfer-ownership dialog when we open the persona card
     */
    onCardOpenCallback?: () => void;
    topicMetadata?: TopicCardMetadata & { source?: string };
}

export interface PersonaCardBehaviorProps extends PersonaCardBehaviorInputProps {
    tabIndex?: number;
}

interface PersonaCardBehaviorInternalProps extends PersonaCardBehaviorProps {
    children: React.ReactNode;
}

interface PersonaInfo {
    personaType: string;
    isBrand: boolean;
    isTier3Brand: boolean;
}

const LivePersonaCardBehavior = observer(function LivePersonaCardBehavior({
    composeEmailOverride,
    isUnauthenticatedSender,
    mailBoxType,
    personaType,
    emailAddress,
    clientScenario,
    locationToOpen,
    focusReturnElement,
    tabIndex,
    olsPersonaId,
    topicId,
    name,
    disableHover,
    ariaLabel,
    className,
    children,
    size,
    aadObjectId,
    displayPersonaHighlightRing,
    mountWithoutWrapperSpan,
    disableAccessibilityDefaults,
    onCardOpenCallback,
    topicMetadata,
}: PersonaCardBehaviorInternalProps) {
    const [hasPersonaInsightRing, setHasPersonaInsightRing] = React.useState<boolean>(false);

    React.useEffect(() => {
        initializeLivePersonaCard(composeEmailOverride);
        fetchBrandList();
    }, []);

    const calculatedPersonaType = React.useMemo(
        () => calculatePersonaType(isUnauthenticatedSender, mailBoxType, personaType, emailAddress),
        [
            isUnauthenticatedSender,
            mailBoxType,
            personaType,
            emailAddress,
            personaControlStore.brandListLoadState,
        ]
    );

    const onCardOpen = React.useCallback(() => {
        if (onCardOpenCallback) {
            onCardOpenCallback();
        }
        logInfoOnCardOpen(
            calculatedPersonaType,
            clientScenario,
            locationToOpen,
            topicId,
            topicMetadata
        );
    }, [calculatedPersonaType, clientScenario, locationToOpen, topicId]);

    const onCardClose = React.useCallback(() => {
        if (focusReturnElement instanceof HTMLElement) {
            focusReturnElement.focus();
        } else if (focusReturnElement?.current) {
            focusReturnElement.current.focus();
        }
    }, [focusReturnElement]);

    const onPersonaInsightRingStateChange = React.useCallback(
        (hasPersonaInsightRing: boolean) => {
            setHasPersonaInsightRing(hasPersonaInsightRing);
        },
        [setHasPersonaInsightRing]
    );

    const personaCoinColor = getPersonaInitialsColor({ text: name });

    const PersonaRingBehavior = usePersonaRingBehavior({
        displayPersonaHighlightRing,
        personaSize: size || calculatePersonaSize(),
        identifiers: {
            OlsPersonaId: olsPersonaId,
            TopicId: topicId,
            Smtp: emailAddress,
            PersonaType: calculatedPersonaType.personaType,
        },
        onPersonaInsightRingStateChange,
    });

    if (personaControlStore.isLivePersonaCardInitialized) {
        let LivePersonaCardHoverTargetV2 = (window as any).LivePersonaCardHoverTargetV2;

        const wrappedChildren = displayPersonaHighlightRing ? (
            <PersonaRingBehavior>{children}</PersonaRingBehavior>
        ) : (
            children
        );

        return (
            <LivePersonaCardHoverTargetV2
                tabIndex={tabIndex}
                cardParameters={{
                    disableAccessibilityDefaults: disableAccessibilityDefaults,
                    externalAppSessionCorrelationId: lokiClientCorrelationId,
                    personaInfo: {
                        identifiers: {
                            Smtp: emailAddress,
                            PersonaType: calculatedPersonaType.personaType,
                            OlsPersonaId: olsPersonaId,
                            AadObjectId: aadObjectId,
                            TopicId: topicId,
                        },
                        isUnauthenticatedSender: isUnauthenticatedSender,
                        displayName: name,
                        isTier3Brand: calculatedPersonaType.isTier3Brand,
                        personaCoinColor: personaCoinColor,
                        topicMetadata,
                    },
                    behavior: {
                        disableHover: disableHover,
                        onCardOpen: onCardOpen,
                        onCardClose: onCardClose,
                        locationToOpen: locationToOpen,
                    },
                    clientScenario: clientScenario,
                    ariaLabel: ariaLabel,
                    hasPersonaInsightRing,
                }}>
                {mountWithoutWrapperSpan ? (
                    wrappedChildren
                ) : (
                    <span className={className} aria-label={ariaLabel}>
                        {wrappedChildren}
                    </span>
                )}
            </LivePersonaCardHoverTargetV2>
        );
    } else {
        return <>{children}</>;
    }
});

function logInfoOnCardOpen(
    personaInfo: PersonaInfo,
    clientScenario?: string,
    locationToOpen?: string,
    topicId?: string,
    topicMetadata?: TopicCardMetadata & { source?: string }
) {
    if (isFeatureEnabled('grp-TransferOwnership')) {
        let leaveGroupDialogDiv = document.getElementById('TransferOwnershipGroupDialog');
        if (leaveGroupDialogDiv) {
            ReactDOM.unmountComponentAtNode(leaveGroupDialogDiv);
            document.body.removeChild(leaveGroupDialogDiv);
        }
    }

    if (personaInfo.isBrand) {
        logUsage(
            personaInfo.personaType === LivePersonaCardPersonaTypes.Brand
                ? 'BrandCardDisplayed'
                : 'BrandDetectedButNotDisplayed'
        );
    }

    if (personaInfo.personaType === LivePersonaCardPersonaTypes.Topic) {
        lazyLogEvent.importAndExecute('Cortex.TopicAnnotations.TopicCard.Open', {
            topicId,
            source: topicMetadata.source,
        });
    }

    const scenarioToPrint = clientScenario || 'No Client Scenario';
    const locationToPrint = locationToOpen || 'LPC';
    logUsage('LPCRenderedFromHoverTarget', {
        clientScenario: scenarioToPrint,
        locationToOpen: locationToPrint,
    });
}

export function useLivePersonaCard(props: PersonaCardBehaviorProps): React.ComponentType<{}> {
    return observer(function PersonaCardBehavior({ children }: { children?: React.ReactNode }) {
        if (personaControlStore.isPersonaCardDisabled) {
            return <>{children}</>;
        } else {
            return <LivePersonaCardBehavior {...props}>{children}</LivePersonaCardBehavior>;
        }
    });
}
