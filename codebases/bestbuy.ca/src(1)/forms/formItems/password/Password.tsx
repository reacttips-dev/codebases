import * as React from "react";
import FormItem from "../FormItem";
import * as styles from "./styles.css";
export const messages = {
    en: {
        hide: "Hide",
        show: "Show",
    },
    fr: {
        hide: "Masquer",
        show: "Afficher",
    },
};
export class Password extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = (e) => {
            if (this.props.onClick) {
                this.props.onClick(e);
            }
        };
        this.handleOnFocus = (e) => {
            if (this.props.onFocus) {
                this.props.onFocus(e);
            }
        };
        this.handleTextChange = (e) => {
            if (this.props.handleAsyncChange) {
                this.props.handleAsyncChange(e.currentTarget.name, e.currentTarget.value);
            }
        };
        this.handleTextBlur = (e) => {
            if (this.props.handleSyncChange) {
                this.props.handleSyncChange(this.props.name, e.currentTarget.value);
            }
        };
        this.toggleDisplay = (e) => {
            this.setState({ type: this.state.type === "text" ? "password" : "text" });
            if (this.passwordInput) {
                this.passwordInput.focus();
            }
        };
        this.state = { type: "password", value: "" };
    }
    render() {
        const lang = this.props.lang || "en";
        return (React.createElement("div", { className: styles.bbyInput },
            React.createElement("div", { className: this.props.error ? "validation-error" : "" },
                React.createElement("input", Object.assign({ ref: (input) => {
                        this.passwordInput = input;
                    }, type: this.state.type, name: this.props.name, id: this.props.name, onChange: this.handleTextChange.bind(this), onClick: this.handleOnClick.bind(this), onFocus: this.handleOnFocus.bind(this), onBlur: this.handleTextBlur.bind(this), placeholder: this.props.placeholder, maxLength: this.props.maxLength, value: this.props.value || "" }, this.props.extraAttrs)),
                React.createElement("span", { className: "show-hide-password", onClick: this.toggleDisplay }, this.state.type === "text" ? messages[lang].hide : messages[lang].show),
                React.createElement("div", { className: "highlight" }))));
    }
}
export default FormItem()(Password);
//# sourceMappingURL=Password.js.map