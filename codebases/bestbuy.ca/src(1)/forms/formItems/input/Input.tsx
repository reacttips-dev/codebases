import * as React from "react";
import FormItem from "../FormItem";
import formatText from "./formatter";
import * as styles from "./styles.css";
class Input extends React.Component {
    constructor(props, state) {
        super(props, state);
        this.handleKeyUp = (e) => {
            // this is to address an issue found in some android devices where the cursor position
            // doesn't update when an input field gets formatted
            const navKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Shift"];
            if (navKeys.indexOf(e.key) < 0 && this.props.formatter) {
                const l = (this.state.formattedValue && this.state.formattedValue.length) || 0;
                e.currentTarget.setSelectionRange(l, l);
            }
        };
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
            const f = formatText(e.currentTarget.value, this.props.formatter);
            this.setState({
                formattedValue: f.formatted,
            });
            if (this.props.handleAsyncChange) {
                this.props.handleAsyncChange(this.props.name, f.raw);
            }
        };
        this.handleTextBlur = (e) => {
            if (this.props.handleSyncChange) {
                this.props.handleSyncChange(this.props.name, formatText(e.currentTarget.value, this.props.formatter).raw);
            }
        };
        this.state = Object.assign({ formattedValue: formatText(props.value.toString(), props.formatter).formatted }, state);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value || nextProps.formatter !== this.props.formatter) {
            this.setState({
                formattedValue: formatText(nextProps.value.toString(), nextProps.formatter).formatted,
            });
        }
    }
    render() {
        return (React.createElement("div", { className: styles.bbyInput },
            React.createElement("div", { className: "" + (this.props.error && "validation-error") },
                React.createElement("input", Object.assign({ type: this.props.type || "text", id: this.props.name, name: this.props.noSubmit ? "" : this.props.name, onChange: this.handleTextChange.bind(this), onClick: this.handleOnClick.bind(this), onKeyUp: this.handleKeyUp.bind(this), onFocus: this.handleOnFocus.bind(this), onBlur: this.handleTextBlur.bind(this), placeholder: this.props.placeholder, maxLength: this.props.maxLength, pattern: this.props.pattern, value: this.state.formattedValue, autoComplete: this.props.autoComplete }, this.props.extraAttrs)),
                React.createElement("div", { className: "highlight" }))));
    }
}
export default FormItem()(Input);
//# sourceMappingURL=Input.js.map