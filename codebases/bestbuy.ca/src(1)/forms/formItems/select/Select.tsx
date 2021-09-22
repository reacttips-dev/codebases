import * as React from "react";
import { CaretDown } from "../../../";
import FormItem from "../FormItem";
import * as styles from "./styles.css";
class Select extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = (e) => {
            if (this.props.handleSyncChange) {
                this.props.handleSyncChange(e.currentTarget.name, e.currentTarget.value);
            }
        };
    }
    render() {
        return (React.createElement("div", { className: styles.bbySelect },
            React.createElement("div", { className: "" + (this.props.error && "validation-error") },
                React.createElement("select", Object.assign({ id: this.props.name, name: this.props.name, onChange: this.handleChange, ref: (ref) => (this.textInput = ref), value: this.props.value || "" }, this.props.extraAttrs), this.props.children),
                React.createElement(CaretDown, { className: styles.dropdownIcon }),
                React.createElement("div", { className: "highlight" }))));
    }
    componentDidMount() {
        if (this.props.handleSyncChange && this.textInput.value !== this.props.value) {
            this.props.handleSyncChange(this.props.name, this.textInput.value);
        }
    }
}
export default FormItem()(Select);
//# sourceMappingURL=Select.js.map