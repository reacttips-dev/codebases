import { Key, LinkEvent, LinkEventType } from "@bbyca/apex-components";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import { eventTypeToKey } from "@bbyca/apex-components";

import Link from "components/Link";
import MessageBoxComponent, { IconType } from "components/MessageBox";

import * as styles from "./style.css";

interface Props {
    messageIcon: IconType;
    messageTitle: React.ReactNode;
    messageDetails: React.ReactNode;
    event?: LinkEventType;
    ctaText?: React.ReactNode;
    LinkComponent: React.ComponentType;
}

const MessageBox = (props: Props) => {
    const {
        event: messageBoxEvent,
        ctaText: messageBoxCtaText,
        LinkComponent = Link,
        messageDetails,
        messageIcon,
        messageTitle,
    } = props;

    const hasLink = messageBoxEvent && typeof messageBoxCtaText === "string";
    let messageBoxEventProps = null;

    if (hasLink) {
        const hasExternalUrl = !messageBoxEvent.eventType || messageBoxEvent.eventType === "externalUrl";
        messageBoxEventProps = hasExternalUrl ?
            {
                href: new LinkEvent(messageBoxEvent).toHref(),
                targetSelf: true,
                external: true,
            } : {
                params: [messageBoxEvent.seoText, messageBoxEvent.eventId],
                query: messageBoxEvent.query,
                to: eventTypeToKey[messageBoxEvent.eventType] as Key,
            }
            ;
    }

    const messageBoxLinkProps = hasLink ? messageBoxEventProps : null;

    return (
        <MessageBoxComponent
            messageIcon={messageIcon}
            messageTitle={messageTitle}
        >
            <div className={styles.messageDetailsBox}>
                <p className={styles.messageDetails}>{messageDetails}</p>
                {
                    hasLink
                        ?
                        <LinkComponent
                            {...messageBoxLinkProps}
                            className={styles.correctionNoticeLink}
                        >
                            {messageBoxCtaText}
                            <KeyboardArrowRight viewBox={"0 0 20 20"}
                                className={styles.icon}
                                classes={{
                                    root: styles.linkRightArrowIcon,
                                }} />
                        </LinkComponent>
                        :
                        null
                }
            </div>
        </MessageBoxComponent>
    );
};

export default MessageBox;
