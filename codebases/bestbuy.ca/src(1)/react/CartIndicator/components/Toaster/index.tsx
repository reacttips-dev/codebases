import CloseIcon from "@material-ui/icons/Close";
import * as React from "react";
import * as styles from "./styles.css";
export default class Toaster extends React.Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
        document.addEventListener("popstate", this.close.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress.bind(this));
        document.removeEventListener("popstate", this.close.bind(this));
    }
    render() {
        const className = `toasterContainer ${this.props.visible ? "visible" : "hidden"} ${this.props.className}`;
        return (React.createElement("div", { className: styles.toaster },
            React.createElement("div", { className: className },
                React.createElement("div", { className: "bgFade", onClick: this.close.bind(this) }),
                React.createElement("section", { className: "toaster", onMouseEnter: this.preventClose.bind(this) },
                    React.createElement("a", { onClick: this.close.bind(this), className: "closeIcon", href: "" },
                        React.createElement(CloseIcon, null)),
                    this.props.children))));
    }
    handleKeyPress(event) {
        if (event.keyCode === 27) {
            this.close();
        }
    }
    preventClose() {
        clearTimeout(this.autoCloseInt);
    }
    close(e) {
        if (e) {
            e.preventDefault();
        }
        clearTimeout(this.autoCloseInt);
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
}
//# sourceMappingURL=index.js.map