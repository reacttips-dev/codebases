import { GlobalInfoMessage, GlobalErrorMessage } from "@bbyca/bbyca-components";
import * as React from "react";
import * as styles from "./style.css";

export enum IconType {
    NotAvailable,
    Warning,
    TimeOutCart,
    Feedback,
    Info,
}

export enum MessageStateStyle {
    custom,
    error,
    info,
    success,
    warning,
    feedback,
}

interface Props {
    messageIcon?: IconType;
    messageTitle: React.ReactNode;
    messageDetails?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

const MessageBox = (props: Props) => {

    const {
        messageTitle,
        messageIcon,
        children,
        messageDetails,
        className,
        ...others
    } = props;

    let Comp;
    let messageType;

    /**
     * Map old icons to new icons of rebranding
     */
    switch (messageIcon) {
        case IconType.Feedback:
        case IconType.TimeOutCart:
            messageType = "info";
            break;
        case IconType.NotAvailable:
        case IconType.Warning:
            messageType = "error";
            break;
        default:
            messageType = "info";
    }

    if (messageType === "info") {
        Comp = GlobalInfoMessage;
    } else {
        Comp = GlobalErrorMessage;
    }

    return (
        <div className={`${styles[className] || ""} ${styles.messageBoxRebranding}`}>
            <Comp
                {...others}
                message={messageTitle}
            >
                <div className={styles.messageDetailsWrapper}>
                    {messageDetails}
                    {children}
                </div>
            </Comp>
        </div>
    );
};

export default MessageBox;
