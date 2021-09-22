import * as React from "react";

import StatusColor, {LiveChatStatus} from "components/ContactUs/components/StatusColor";

import * as styles from "./styles.css";

interface ChatStatusProps {
    children: React.ReactChildren | JSX.Element;
    status: LiveChatStatus;
}

const ChatStatus: React.FC<ChatStatusProps> = ({status, children}) => (
    <>
        <StatusColor liveChatStatus={status} />
        <p className={styles.chatStatus}>{children}</p>
    </>
);

export default ChatStatus;
