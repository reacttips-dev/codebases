import * as React from "react";
import FormItem from "../FormItem";
import * as styles from "./styles.css";
class TextArea extends React.Component {
    handleChange(e) {
        if (this.props.handleSyncChange) {
            this.props.handleSyncChange(e.currentTarget.name, e.currentTarget.value);
        }
    }
    render() {
        return (React.createElement("div", { className: styles.textArea },
            React.createElement("div", { className: "" + (this.props.error && "validation-error") },
                React.createElement("textarea", Object.assign({ id: this.props.name, maxLength: this.props.maxLength, name: this.props.name, onChange: this.handleChange.bind(this), rows: this.props.rows, placeholder: this.props.placeholder, value: this.props.value || "" }, this.props.extraAttrs), this.props.children),
                React.createElement("div", { className: "highlight" }))));
    }
}
export default FormItem()(TextArea);
//# sourceMappingURL=TextArea.js.map