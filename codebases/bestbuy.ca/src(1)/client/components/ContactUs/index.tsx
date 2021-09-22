import * as React from "react";
import {useState, useEffect} from "react";
import * as styles from "./styles.css";
import {FormattedMessage, injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";
import LiveChat from "./components/LiveChat";
import CallUs from "./components/CallUs";
import {State} from "store";
import {LiveAgent} from "@bbyca/ecomm-communications-components";
import * as liveAgentIframe from "@bbyca/ecomm-communications-components/dist/react/components/LiveAgent/static/LiveAgent.html";
import {LiveAgentConfig} from "config";
import {chatEvents} from "@bbyca/ecomm-communications-components/dist/react/components/LiveAgent/LiveAgent";
import {connect} from "react-redux";
import {FeatureToggles} from "../../../config";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import EmailUs from "./components/EmailUs";
import AgentOffline from "./components/AgentOffline";
import {getAdobeVisitorId} from "utils/analytics/adobeCookie";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";
import TextBlock from "components/TextBlock";
import {classname} from "utils/classname";

interface StateProps {
    className?: string;
    liveAgent: LiveAgentConfig;
    language: Language;
    features: FeatureToggles;
}

export const ContactUs = (props: StateProps & InjectedIntlProps) => {
    let chatRef;

    const [chatEnabled, setChatEnabled] = useState(false);
    const [chatAvailable, setChatAvailable] = useState(false);
    const [chatOnline, setChatOnline] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    const startChat = () => {
        if (chatRef && chatEnabled) {
            adobeLaunch.customLink("Help Centre CTA: Chat");
            setChatLoading(true);
            chatRef.startChat();
        }
    };

    useEffect(() => {
        window.addEventListener(chatEvents.LIVE_AGENT_IFRAME_LOADED, onChatOnline);

        return () => window.removeEventListener(chatEvents.LIVE_AGENT_IFRAME_LOADED, onChatOnline);
    }, []);

    const onChatOnline = () => {
        setChatOnline(true);
    };

    const onChatReady = () => {
        setChatAvailable(true);
        setChatEnabled(true);
    };

    const onChatEnd = () => {
        setChatAvailable(true);
        setChatEnabled(true);
    };

    const onChatUnavailable = () => {
        setChatAvailable(false);
        setChatEnabled(false);
    };

    const onChatStart = () => {
        setChatLoading(false);
        setChatAvailable(true);
        setChatEnabled(false);
    };

    const liveChat = () => {
        if (props.features.helpPageLiveChat) {
            return chatAvailable ? <LiveChat startChat={startChat} isChatLoading={chatLoading} /> : <AgentOffline />;
        }
    };

    return (
        <TextBlock className={classname([styles.contactUs, props.className])}>
            <SectionTitle className={styles.sectionTitle} appearance={TitleAppearance.d1}>
                <h2>
                    <FormattedMessage {...messages.callToActionHeading} />
                </h2>
            </SectionTitle>
            <p>
                <FormattedMessage {...messages.callToAction} />
            </p>
            <div className={styles.contactUsSections}>
                <div className={styles.contactBlock}>
                    <CallUs />
                </div>
                <div className={styles.contactBlock}>
                    <EmailUs />
                </div>
                <div className={styles.contactBlock}>{liveChat()}</div>
            </div>
            <LiveAgent
                iframeSrc={liveAgentIframe}
                ref={(ref) => (chatRef = ref)}
                locale={props.language}
                config={props.liveAgent}
                onChatReady={onChatReady}
                onChatEnd={onChatEnd}
                onChatUnavailable={onChatUnavailable}
                onChatStart={onChatStart}
                adobeVisitorID={getAdobeVisitorId()}
            />
        </TextBlock>
    );
};

function mapStateToProps(state: State) {
    return {
        liveAgent: state.config.liveAgent,
        features: state.config.features,
        language: state.intl.language,
    };
}

export default connect<StateProps>(mapStateToProps)(injectIntl(ContactUs));
