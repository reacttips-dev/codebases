import * as React from "react";
import * as styles from "./styles.css";
import ContactBlock from "../ContactBlock";
import { TextBubble } from "@bbyca/bbyca-components";
import StatusColor, { LiveChatStatus } from "../StatusColor";
import messages from "./translations/messages";
import { FormattedMessage } from "react-intl";

export const AgentOffline = () => (
    <ContactBlock className={styles.disabledComponent}>
        <TextBubble className={`${styles.textBubbleLogo} ${styles.logo}`} />
        <h3>
          <FormattedMessage {...messages.chatHeading} />
        </h3>
        <p>
          <FormattedMessage {...messages.chatAvailability} />
        </p>
        <StatusColor liveChatStatus={LiveChatStatus.offline} />
        <p className={styles.chatStatus}>
            <FormattedMessage {...messages.chatOffline}/>
        </p>
    </ContactBlock>
);

export default AgentOffline;
