import * as React from "react";
import { FormContext } from "../form/Form";
import * as styles from "./styles.css";
export const FormItemHoc = ({ showLabel = true, hideUI = false } = {}) => (Component) => {
    const result = class FormItem extends React.Component {
        constructor(props) {
            super(props);
            this.getData = () => {
                const error = !this.validate(this.state.value, [
                    ...(this.props.asyncValidators || []),
                    ...(this.props.validators || []),
                ]);
                const errorMsg = error ? this.props.errorMsg : "";
                this.setState({ error, errorMsg });
                return Object.assign(Object.assign({}, this.state), { error, errorMsg });
            };
            this.state = {
                error: props.error || false,
                errorMsg: props.error ? props.errorMsg : "",
                value: props.value || "",
            };
        }
        componentDidMount() {
            if (this.context && this.context.registerInput) {
                this.context.registerInput(this.props.name, this.getData);
            }
        }
        componentWillUnmount() {
            if (this.context && this.context.unregisterInput) {
                this.context.unregisterInput(this.props.name);
            }
        }
        componentDidUpdate(prevProps) {
            if (this.props.value !== prevProps.value && this.props.value !== this.state.value) {
                const newValue = this.props.value || "";
                this.handleSyncChange(this.props.name, newValue);
            }
            if (this.props.error !== prevProps.error && this.props.error !== this.state.error) {
                this.setState({
                    error: this.props.error || false,
                    errorMsg: this.props.error ? this.props.errorMsg : "",
                });
            }
        }
        render() {
            const childComponent = (React.createElement(Component, Object.assign({}, this.props, { error: this.state.error, errorMsg: this.state.errorMsg, value: this.state.value, handleAsyncChange: this.handleAsyncChange.bind(this), handleSyncChange: this.handleSyncChange.bind(this) })));
            if (hideUI) {
                return childComponent;
            }
            const errorDataAutomation = this.props.extraAttrs && this.props.extraAttrs["data-automation"];
            return (React.createElement("div", { className: `${styles.formItem} ${this.props.className ? this.props.className : ""}` },
                React.createElement("div", { className: `input-container ${this.state.error ? "validation-error" : ""}` },
                    showLabel && React.createElement("label", { htmlFor: this.props.name }, this.props.label),
                    childComponent,
                    this.props.errorMsg && (React.createElement("div", Object.assign({ className: "error-msg" }, (errorDataAutomation && {
                        "data-automation": `${errorDataAutomation}-inline-error-msg`,
                    })),
                        this.props.errorMsg,
                        this.props.helperTxt && " " + this.props.helperTxt)),
                    this.props.helperTxt && React.createElement("div", { className: "help-txt" }, this.props.helperTxt))));
        }
        validate(val, validators = []) {
            if (this.props.error) {
                return false;
            }
            for (const validator of validators) {
                if (!validator(val)) {
                    return false;
                }
            }
            return true;
        }
        validateNonempty(val = "", validators = []) {
            if (this.props.error) {
                return false;
            }
            return !val.toString().length || this.validate(val, validators);
        }
        handleSyncChange(id, val) {
            const error = !this.validateNonempty(this.state.value, [
                ...(this.props.asyncValidators || []),
                ...(this.props.validators || []),
            ]);
            this.setState({ error, value: val, errorMsg: error ? this.props.errorMsg : "" });
            if (this.props.handleSyncChange) {
                this.props.handleSyncChange(id, val, error);
            }
        }
        handleAsyncChange(id, val) {
            const error = !this.validateNonempty(val, this.props.asyncValidators);
            this.setState({ error, value: val });
            if (this.props.handleAsyncChange) {
                this.props.handleAsyncChange(id, val, error);
            }
        }
    };
    result.contextType = FormContext;
    return result;
};
export default FormItemHoc;
//# sourceMappingURL=FormItem.js.map