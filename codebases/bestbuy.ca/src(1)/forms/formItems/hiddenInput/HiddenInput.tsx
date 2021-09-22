import * as React from "react";
import FormItem from "../FormItem";
export class HiddenInput extends React.Component {
    render() {
        return (React.createElement("input", Object.assign({ type: "hidden", name: this.props.name, id: this.props.name, value: this.props.value || "" }, this.props.extraAttrs)));
    }
}
export default FormItem({ hideUI: true })(HiddenInput);
//# sourceMappingURL=HiddenInput.js.map