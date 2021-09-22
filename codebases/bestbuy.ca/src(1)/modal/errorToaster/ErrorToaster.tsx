import * as React from "react";
import { Button, Modal } from "../..";
import * as styles from "./styles.css";
export default class ErrorToaster extends React.Component {
    componentDidMount() {
        if (this.props.visible) {
            this.setTimer();
        }
    }
    componentWillUnmount() {
        this.clearTimer();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.props.visible ? this.setTimer() : this.clearTimer();
        }
    }
    render() {
        const { visible, close, message, buttonText, buttonAction, className } = this.props;
        return (React.createElement(Modal, { visible: visible, theme: "error-toaster", onClose: close, closeIcon: false, className: className },
            React.createElement("div", { className: styles.errorToaster },
                React.createElement("span", { className: styles.errorToaster__text }, message),
                buttonText && (React.createElement(Button, { className: styles.errorToaster__button, appearance: "transparent", onClick: buttonAction || close }, buttonText)))));
    }
    setTimer() {
        if (window && this.props.autoHideTimeout) {
            this.clearTimer();
            this.autoHideTimer = window.setTimeout(this.props.close, this.props.autoHideTimeout);
        }
    }
    clearTimer() {
        if (window && this.autoHideTimer !== undefined) {
            window.clearTimeout(this.autoHideTimer);
            this.autoHideTimer = undefined;
        }
    }
}
//# sourceMappingURL=ErrorToaster.js.map