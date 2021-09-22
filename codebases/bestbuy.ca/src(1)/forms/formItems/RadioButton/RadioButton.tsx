import * as React from "react";
import * as styles from "./styles.css";
export default class RadioButton extends React.Component {
    constructor() {
        super(...arguments);
        this.handleRadioButtonChange = () => {
            if (this.props.onChange) {
                this.props.onChange(this.props.selectedValue);
            }
        };
    }
    render() {
        const { className = "", disabled = false, hideCheckmark, label, name = "radioGroup", selectedValue, value, } = this.props;
        const hiddenCheckmarkClass = hideCheckmark ? styles.checkmarkHidden : "";
        const isSelected = value === selectedValue;
        return (React.createElement("div", { className: `${styles.bbyRadioButton} ${className} ${isSelected ? "checked" : ""}` },
            React.createElement("div", { className: `${styles.radioInput} ${hiddenCheckmarkClass}` },
                React.createElement("label", { className: styles.label },
                    label,
                    React.createElement("input", Object.assign({ name: name, type: "radio", value: selectedValue, checked: isSelected, disabled: disabled, onChange: this.handleRadioButtonChange }, this.props.extraAttrs)),
                    React.createElement("div", { className: "highlight" }),
                    React.createElement("span", { className: styles.checkmark })),
                React.createElement("div", { className: styles.radioChildren }, this.props.children))));
    }
}
//# sourceMappingURL=RadioButton.js.map