import * as React from "react";
import * as closeIcon from "./icons/close.svg";
import * as styles from "./styles.css";
import preventScroll from "prevent-scroll";
export default class Modal extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClose = (e) => {
            if (e) {
                e.preventDefault();
            }
            if (this.props.onClose) {
                this.props.onClose();
            }
        };
        this.handleKeyPress = (e) => {
            if (this.props.visible) {
                if (e.keyCode === 9) {
                    e.preventDefault();
                }
                if (e.keyCode === 27) {
                    this.handleClose(e);
                }
            }
        };
        this.open = () => {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
            if (document) {
                if (this.props.blockScrollingOnOpen) {
                    preventScroll.on();
                }
                document.addEventListener("keydown", this.handleKeyPress);
                document.addEventListener("popstate", this.handleClose);
            }
        };
        this.close = () => {
            if (document) {
                if (this.props.blockScrollingOnOpen) {
                    preventScroll.off();
                }
                document.removeEventListener("keydown", this.handleKeyPress);
                document.removeEventListener("popstate", this.handleClose);
            }
        };
    }
    componentWillUnmount() {
        this.close();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.props.visible ? this.open() : this.close();
        }
    }
    render() {
        const showCloseIcon = this.props.closeIcon === undefined ? !!this.props.onClose : this.props.closeIcon;
        const visible = this.props.visible ? styles.visible : styles.hidden;
        const theme = this.props.theme ? styles[this.props.theme] : styles.defaultTheme;
        const classNames = `${styles.modalContainer} ${visible} ${theme} ${this.props.className}`;
        return (React.createElement("div", { className: classNames },
            React.createElement("div", { role: "button", className: "bgFade", onClick: this.handleClose }),
            React.createElement("section", { className: "modal", "aria-modal": "true" },
                showCloseIcon ? (React.createElement("a", { onClick: this.handleClose, className: "closeIcon", href: this.props.closeLink, role: "button" },
                    React.createElement("img", { src: closeIcon, alt: "close" }))) : null,
                this.props.children)));
    }
}
//# sourceMappingURL=modal.js.map