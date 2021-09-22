import * as React from "react";
import * as styles from "./styles.css";

export enum LiveChatStatus {
    busy = "busy",
    online = "online",
    offline = "offline"
}

export interface Props {
    liveChatStatus: LiveChatStatus;
}

export const StatusColor = (props: Props) => {
    return <span className={`${styles.liveAgentStatus} ${styles[props.liveChatStatus]}`} />;
};

export default StatusColor;
