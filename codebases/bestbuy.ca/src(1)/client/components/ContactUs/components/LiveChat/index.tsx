import * as React from "react";
import messages from "./translations/messages";
import { FormattedMessage } from "react-intl";
import { ContactBlock } from "../";
import * as styles from "./styles.css";
import { TextBubble } from "@bbyca/bbyca-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatusColor, { LiveChatStatus } from "../StatusColor";

export interface Props {
  isChatLoading: boolean;
  startChat: () => void;
}

export const LiveChat = (props: Props) => (

    <ContactBlock className={styles.enabledComponent}
                  onClick={props.startChat} >
      <TextBubble className={styles.textBubbleLogo} />
      <h3 className={styles.liveChat}>
          <FormattedMessage {...messages.chatHeading} />
      </h3>
      <p>
        <FormattedMessage {...messages.chatAvailability} />
      </p>
      {props.isChatLoading ? <CircularProgress size={24} style={{ padding: "7px" }} /> :
        (
        <>
          <StatusColor liveChatStatus={LiveChatStatus.online} />
          <p className={styles.chatStatus}>
          <FormattedMessage {...messages.chatOnline}/>
          </p>
        </>
        )}
    </ContactBlock>
);

export default LiveChat;
