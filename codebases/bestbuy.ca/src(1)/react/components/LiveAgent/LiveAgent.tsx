import * as React from "react";
import * as avatarImg from "./static/BBY_Avatar.png";
import * as styles from "./styles.css";
export var chatDispatch;
(function (chatDispatch) {
    chatDispatch["INIT_CHAT"] = "INIT_CHAT";
    chatDispatch["LAUNCH_CHAT"] = "LAUNCH_CHAT";
})(chatDispatch || (chatDispatch = {}));
export var chatEvents;
(function (chatEvents) {
    chatEvents["LIVE_AGENT_CHAT_STARTED"] = "LIVE_AGENT_CHAT_STARTED";
    chatEvents["LIVE_AGENT_CHAT_ENDED"] = "LIVE_AGENT_CHAT_ENDED";
    chatEvents["LIVE_AGENT_IFRAME_LOADED"] = "LIVE_AGENT_IFRAME_LOADED";
    chatEvents["LIVE_AGENT_MAXIMIZED"] = "LIVE_AGENT_MAXIMIZED";
    chatEvents["LIVE_AGENT_MINIMIZED"] = "LIVE_AGENT_MINIMIZED";
    chatEvents["LIVE_AGENT_AVAILABLE"] = "LIVE_AGENT_AVAILABLE";
    chatEvents["LIVE_AGENT_UNAVAILABLE"] = "LIVE_AGENT_UNAVAILABLE";
})(chatEvents || (chatEvents = {}));
export default class LiveAgent extends React.Component {
    constructor(props, state) {
        super(props);
        this.startChat = () => this.postMessageToIframe(chatDispatch.LAUNCH_CHAT);
        this.handleChatStart = (e) => {
            if (this.props.onChatStart) {
                this.props.onChatStart();
            }
            this.setState({
                active: true,
                isDesktop: e.detail && e.detail.device === "DESKTOP",
            });
        };
        this.handleAgentAvaileble = () => {
            if (this.props.onChatReady) {
                this.props.onChatReady();
            }
        };
        this.handleAgentUnavaileble = () => {
            if (this.props.onChatUnavailable) {
                this.props.onChatUnavailable();
            }
        };
        this.handleChatEnd = () => {
            if (this.props.onChatEnd) {
                this.props.onChatEnd();
            }
            this.setState({ active: false });
        };
        this.handleChatIframeLoad = () => {
            this.postMessageToIframe(chatDispatch.INIT_CHAT, Object.assign(Object.assign({}, this.props.config), { ADOBE_VISITOR_ID: this.props.adobeVisitorID, AVATAR_IMG: avatarImg, LOCALE: this.props.locale }));
        };
        this.handleMaximize = () => this.setState({ minimized: false });
        this.handleMinimize = () => this.setState({ minimized: true });
        this.postMessageToIframe = (eventName, payload) => {
            this.liveAgentIframe.contentWindow.postMessage({
                detail: payload,
                eventName,
            }, "*");
        };
        this.state = {
            active: false,
            isClientRendered: false,
            isDesktop: false,
            minimized: false,
        };
    }
    componentDidMount() {
        if (typeof window !== "undefined") {
            window.addEventListener(chatEvents.LIVE_AGENT_CHAT_STARTED, this.handleChatStart);
            window.addEventListener(chatEvents.LIVE_AGENT_AVAILABLE, this.handleAgentAvaileble);
            window.addEventListener(chatEvents.LIVE_AGENT_UNAVAILABLE, this.handleAgentUnavaileble);
            window.addEventListener(chatEvents.LIVE_AGENT_CHAT_ENDED, this.handleChatEnd);
            window.addEventListener(chatEvents.LIVE_AGENT_IFRAME_LOADED, this.handleChatIframeLoad);
            window.addEventListener(chatEvents.LIVE_AGENT_MAXIMIZED, this.handleMaximize);
            window.addEventListener(chatEvents.LIVE_AGENT_MINIMIZED, this.handleMinimize);
            this.setState({ isClientRendered: true });
        }
    }
    componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener(chatEvents.LIVE_AGENT_CHAT_STARTED, this.handleChatStart);
            window.removeEventListener(chatEvents.LIVE_AGENT_AVAILABLE, this.handleAgentAvaileble);
            window.removeEventListener(chatEvents.LIVE_AGENT_UNAVAILABLE, this.handleAgentAvaileble);
            window.removeEventListener(chatEvents.LIVE_AGENT_CHAT_ENDED, this.handleChatEnd);
            window.removeEventListener(chatEvents.LIVE_AGENT_IFRAME_LOADED, this.handleChatIframeLoad);
            window.removeEventListener(chatEvents.LIVE_AGENT_MAXIMIZED, this.handleMaximize);
            window.removeEventListener(chatEvents.LIVE_AGENT_MINIMIZED, this.handleMinimize);
        }
    }
    render() {
        const classNames = styles.chatFrame + "\
            " + (this.props.className ? this.props.className : "") + "\
            " + (this.state.active ? styles.active : "") + "\
            " + (this.state.isDesktop ? styles.desktop : "") + "\
            " + (this.state.minimized ? styles.minimized : "");
        if (this.state.isClientRendered) {
            return (React.createElement(React.Fragment, null,
                React.createElement("iframe", { sandbox: "allow-scripts allow-forms allow-same-origin allow-popups", ref: (ref) => { this.liveAgentIframe = ref; }, src: this.props.iframeSrc, className: classNames })));
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=LiveAgent.js.map