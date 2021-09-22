import * as React from "react";
import * as styles from "./style.css";
export class Heading extends React.Component {
    render() {
        const { as: Element = "h2" } = this.props;
        return React.createElement(Element, { className: styles[Element] }, this.props.children);
    }
}
export default Heading;
//# sourceMappingURL=heading.js.map