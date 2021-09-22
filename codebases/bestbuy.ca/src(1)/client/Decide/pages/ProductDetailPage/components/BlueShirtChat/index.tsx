import * as React from "react";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {FormattedMessage} from "react-intl";
import {Button} from "@bbyca/bbyca-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import {BlueShirtChatEvents, blueShirtChatStateSessionKey} from "models";
import {LiveChatStatus} from "components/ContactUs/components/StatusColor";
import {classIf, classname} from "utils/classname";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import ChatStatus from "./components/ChatStatus";
import {withBrandAssetsConfig, ForwardedBrandChatConfigProps} from "./withBrandAssetsConfig";

export interface BlueShirtChatWindowObj extends Window {
    blueShirtChatState: {
        status: {
            chatLoading: boolean;
            agentOnline: boolean;
        };
        activeChat: string;
        currentChat: string;
    };
}

export interface BlueShirtChatProps extends ForwardedBrandChatConfigProps {
    isChatVisible?: boolean;
}

export const BlueShirtChat: React.FC<BlueShirtChatProps> = ({isChatVisible, chatConfig}) => {
    let onlineChatSubHeading;
    let offlineChatSubHeading;

    if (!isChatVisible || !chatConfig) {
        return null;
    }

    // A state to force agent availability status offline
    const [forceOfflineStatus, setForceOfflineStatus] = React.useState(true);
    const [isAgentOnline, setIsAgentOnline] = React.useState(false);
    const [isChatInSession, setIsChatInSession] = React.useState(false);
    // State to force update when Blue Shirt chat Iframe is loaded.
    const [chatLoading, setChatLoading] = React.useState(false);
    const backgroundImage = chatConfig.backgroundImage;
    const isChatForBrand = chatConfig.chatType === "BRAND_EXPERT_CHAT";
    const shouldDisplayAgentUnavailable = !!isAgentOnline && !forceOfflineStatus;

    if (isChatForBrand) {
        onlineChatSubHeading = (
            <FormattedMessage {...messages.becOnlineChatSubHeading} values={{brandName: chatConfig.brandName}} />
        );
        offlineChatSubHeading = (
            <FormattedMessage {...messages.becOfflineChatSubHeading} values={{brandName: chatConfig.brandName}} />
        );
    } else {
        onlineChatSubHeading = offlineChatSubHeading = <FormattedMessage {...messages.bscSubHeading} />;
    }

    React.useEffect(() => {
        window.addEventListener(
            BlueShirtChatEvents.BLUE_SHIRT_AGENT_CHAT_STATE_CHANGE,
            onBlueShirtChatStateChange as any,
        );
        window.dispatchEvent(new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_SYNC_STATE));

        return () => {
            window.removeEventListener(
                BlueShirtChatEvents.BLUE_SHIRT_AGENT_CHAT_STATE_CHANGE,
                onBlueShirtChatStateChange as any,
            );
        };
    }, []);

    React.useEffect(() => {
        // This will trigger a chat swap if eligible.
        window.dispatchEvent(
            new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_UPDATE_CURRENT_CHAT, {
                detail: chatConfig,
            }),
        );
    }, [chatConfig]);

    const startChat = () => {
        // Do not initiate a new chat when a chat is in session
        if (!isAgentOnline || isChatInSession) {
            return;
        }

        adobeLaunch.pushEventToDataLayer({
            event: "initiate-blue-shirt-chat-click",
        });
        // Launch chat
        window.dispatchEvent(new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_LAUNCH_CHAT));
        setChatLoading(true);
    };

    const onBlueShirtChatStateChange = (event: CustomEvent<any>) => {
        if (event.detail) {
            // Sync session storage to re-initialize chat after page refresh
            window.sessionStorage.setItem(
                blueShirtChatStateSessionKey,
                JSON.stringify({
                    activeChat: event.detail.activeChat,
                }),
            );

            const {currentChat, activeChat, status} = event.detail;
            setIsAgentOnline(status?.agentOnline);
            updateForceAgentOfflineStatus(currentChat?.chatType, activeChat?.chatType);
            setIsChatInSession(!!activeChat?.chatType);
            setChatLoading(!!chatLoading && activeChat?.chatType);
        }
    };

    // We force the agent status to offline when the current chat session is not for the same type of chat.
    // For example, BEC is active then display BSC as offline
    const updateForceAgentOfflineStatus = (currentChatType: string, activeChatType: string): void => {
        // When there is no active chat then do not force agent availability status to offline.
        if (!activeChatType) {
            setForceOfflineStatus(false);
        }

        // When a chat is in session and it for the same type of chat on the PDP then do not force agent availability status to offline.
        if (!!activeChatType && activeChatType === currentChatType) {
            setForceOfflineStatus(false);
        }

        // When a chat is in session and not on the PDP with the same type of chat then force agent availability status to offline.
        if (!!activeChatType && activeChatType !== currentChatType) {
            setForceOfflineStatus(true);
        }
    };

    return (
        <div className={styles.initiator} data-automation="blue-shirt-chat-container">
            <div
                className={classname(
                    styles.blueShirtChatContainer,
                    classIf([styles.chatAvailable], shouldDisplayAgentUnavailable, ""),
                )}
                style={{backgroundImage: `url(${backgroundImage})`}}>
                {isChatForBrand && <img alt="brand-logo" src={chatConfig.logo} className={styles.becLogo} />}

                <div
                    className={classname([
                        styles.chatHeading,
                        classIf(styles.brandExpertChatHeading, !!isChatForBrand),
                    ])}>
                    <FormattedMessage {...messages.chatHeading} />
                </div>

                <div className={styles.chatSubHeading}>
                    {shouldDisplayAgentUnavailable ? onlineChatSubHeading : offlineChatSubHeading}
                </div>

                {shouldDisplayAgentUnavailable && !chatLoading && (
                    <Button
                        onClick={startChat}
                        type="default"
                        className={styles.onlineChatButton}
                        appearance="tertiary"
                        size="small">
                        <FormattedMessage {...messages.onlineChatAvailability} />
                    </Button>
                )}

                {chatLoading ? (
                    <CircularProgress size={24} className={styles.circularProgress} />
                ) : (
                    <>
                        {!shouldDisplayAgentUnavailable && (
                            <div className={classIf(styles.brandOfflineChat, !!chatConfig)}>
                                <ChatStatus status={LiveChatStatus.offline}>
                                    <FormattedMessage {...messages.chatOffline} />
                                </ChatStatus>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default withBrandAssetsConfig(BlueShirtChat);
