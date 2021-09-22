import * as React from "react";
import CollapsibleControlled from "./CollapsibleControlled";
export default class Collapsible extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggle = () => this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
        this.state = {
            collapsed: props.defaultCollapsed === undefined ? false : props.defaultCollapsed,
        };
    }
    render() {
        return (React.createElement(CollapsibleControlled, Object.assign({}, this.props, { onToggle: this.handleToggle, collapsed: this.state.collapsed }), this.props.children));
    }
}
//# sourceMappingURL=Collapsible.js.map