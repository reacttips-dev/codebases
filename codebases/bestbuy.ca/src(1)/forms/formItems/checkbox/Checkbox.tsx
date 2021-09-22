import * as React from "react";
import FormItem from "../FormItem";
import CheckMarkSvg from "./icon/CheckMarkSvg";
import * as styles from "./styles.css";
class Checkbox extends React.Component {
    constructor() {
        super(...arguments);
        this.handleCheckboxChange = (e) => {
            e.currentTarget.blur();
            if (this.props.handleAsyncChange) {
                this.props.handleAsyncChange(e.currentTarget.name, e.currentTarget.checked ? this.props.value || "checked" : "");
            }
        };
        this.handleMouseDown = (e) => {
            e.preventDefault();
        };
    }
    render() {
        return (React.createElement("div", { className: styles.bbyCheckbox },
            React.createElement("label", { htmlFor: this.props.name }, this.props.label),
            React.createElement("div", { className: "input" },
                React.createElement("div", { className: this.props.error ? "validation-error" : "" },
                    React.createElement("input", Object.assign({ type: "checkbox", name: this.props.name, id: this.props.name, onMouseDown: this.handleMouseDown, onChange: this.handleCheckboxChange.bind(this), placeholder: this.props.placeholder, maxLength: this.props.maxLength, value: this.props.value ? this.props.value : "", checked: this.props.value ? true : false, disabled: this.props.disabled }, this.props.extraAttrs)),
                    React.createElement(CheckMarkSvg, { className: "check" }),
                    React.createElement("div", { className: "highlight" })))));
    }
}
export default FormItem({ showLabel: false })(Checkbox);
//# sourceMappingURL=Checkbox.js.map