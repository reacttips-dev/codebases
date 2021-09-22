import * as React from "react";
import FormItem from "../FormItem";
export class RadioGroup extends React.Component {
    constructor() {
        super(...arguments);
        this.handleRadioChange = (value) => {
            const { onChange, handleSyncChange, name } = this.props;
            if (handleSyncChange) {
                handleSyncChange(name, value);
            }
            if (onChange) {
                onChange(name, value);
            }
        };
    }
    render() {
        const children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                hideCheckmark: this.props.hideCheckmarks,
                name: this.props.name,
                onChange: (val) => {
                    if (child.props.onChange) {
                        child.props.onChange(val);
                    }
                    this.handleRadioChange(val);
                },
                value: this.props.value,
            });
        });
        return (React.createElement("div", { className: "radio-group", role: "group", "aria-label": "radio group" }, children));
    }
}
export default FormItem({ showLabel: false })(RadioGroup);
//# sourceMappingURL=RadioGroup.js.map