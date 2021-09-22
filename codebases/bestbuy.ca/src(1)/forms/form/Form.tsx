import * as React from "react";
import scrollToTarget from "../../utils/scrollToTarget";
import * as styles from "./styles.css";
export const FormContext = React.createContext({});
class Form extends React.Component {
    constructor() {
        super(...arguments);
        this.registeredInputs = {};
        this.registerInput = (name, getData) => {
            this.registeredInputs[name] = { getData };
        };
        this.unregisterInput = (name) => {
            delete this.registeredInputs[name];
        };
        this.getFormData = () => {
            let errors = 0;
            const data = {};
            for (const name of Object.keys(this.registeredInputs)) {
                const getFieldData = this.registeredInputs[name].getData;
                if (getFieldData) {
                    const fieldData = getFieldData();
                    if (fieldData.error) {
                        errors++;
                    }
                    data[name] = fieldData;
                }
            }
            return { data, errors };
        };
        this.scrollToErrors = () => {
            const firstError = document.querySelector(".validation-error");
            if (!firstError) {
                return;
            }
            const target = firstError.getBoundingClientRect().top + window.pageYOffset;
            scrollToTarget(target);
        };
        this.handleSubmit = (e) => {
            const { data, errors } = this.getFormData();
            if (!errors) {
                if (this.props.onSubmit) {
                    this.props.onSubmit("SUCCESS", e, data);
                }
            }
            else {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (this.props.onError) {
                    this.props.onError("ERROR", data);
                }
                if (this.props.scrollToErrors) {
                    setTimeout(() => this.scrollToErrors(), 0);
                }
            }
        };
    }
    render() {
        return (React.createElement(FormContext.Provider, { value: {
                registerInput: this.registerInput,
                unregisterInput: this.unregisterInput,
            } },
            React.createElement("form", { action: this.props.action, className: styles.bbyForm, id: this.props.name, method: this.props.method, onSubmit: this.handleSubmit, autoComplete: this.props.autoComplete }, this.props.children)));
    }
}
Form.defaultProps = {
    scrollToErrors: true,
};
export default Form;
//# sourceMappingURL=Form.js.map