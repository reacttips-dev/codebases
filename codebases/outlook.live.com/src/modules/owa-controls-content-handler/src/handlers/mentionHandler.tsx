import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';

export const MENTION_HANDLER_NAME = 'mentionHandler';
const MENTION_HANDLER_SELECTOR = 'a[id^=OWAAM]';
const MAILTO_PREFIX = 'mailto:';

import styles from './MentionReadStyles.scss';

function LPCComposeRecipientWrapper(
    props: PersonaCardBehaviorProps & { children?: React.ReactNode }
) {
    const PersonaCardBehavior = useLivePersonaCard(props);

    return (
        <PersonaCardBehavior>
            <span>{props.children}</span>
        </PersonaCardBehavior>
    );
}

export class AtMentionHandler implements ContentHandler {
    public readonly cssSelector = MENTION_HANDLER_SELECTOR;
    public readonly keywords = null;
    private storeElements: {
        originElement: HTMLElement;
        lpcElement: HTMLElement;
    }[];

    constructor() {
        this.storeElements = [];
    }

    public readonly handler = (element: HTMLElement) => {
        const anchorElement = element as HTMLAnchorElement;
        const newSpanElement = element.ownerDocument.createElement('span');
        const mentionEmail = anchorElement.href.replace(MAILTO_PREFIX, '');
        const userEmail = getUserConfiguration().SessionSettings.UserEmailAddress;

        if (userEmail && MAILTO_PREFIX + userEmail == anchorElement.href) {
            element.className = styles.mentionsMeRead;
        } else {
            element.className = styles.mentionsRead;
        }

        let LPCComponent = (
            <LPCComposeRecipientWrapper
                emailAddress={mentionEmail}
                name={undefined}
                clientScenario="AtMention">
                <span className={element.className}>{element.textContent}</span>
            </LPCComposeRecipientWrapper>
        );

        element.parentElement.replaceChild(newSpanElement, element);
        ReactDOM.render(LPCComponent, newSpanElement);

        this.storeElements.push({
            originElement: element,
            lpcElement: newSpanElement,
        });
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.storeElements.forEach(storeElement => {
            const { lpcElement, originElement } = storeElement;
            if (lpcElement) {
                ReactDOM.unmountComponentAtNode(lpcElement);
                lpcElement.parentNode?.replaceChild?.(originElement, lpcElement);
            }
        });
        this.storeElements = [];
    };
}

let mentionHandler = new AtMentionHandler();

export default mentionHandler;
