import { ChevronDown, ChevronUp } from "@bbyca/bbyca-components";
import * as React from "react";
import Truncate from "react-truncate";
import Button from "../button";
import * as styles from "./style.css";
const initialState = {
    expanded: false,
    truncated: false,
};
export class CollapsibleBlock extends React.Component {
    constructor(props) {
        super(props);
        this.handleTruncate = (truncated) => {
            if (this.state.truncated !== truncated) {
                this.setState({ truncated });
            }
        };
        this.toggleExpanded = (e) => {
            e.preventDefault();
            this.setState({ expanded: !this.state.expanded });
        };
        this.state = initialState;
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.expanded && this.props.children !== nextProps.children) {
            this.setState({ expanded: false });
        }
    }
    render() {
        return (React.createElement("div", { className: "x-collapsibleBlock" },
            React.createElement("div", { className: "x-collapsibleBlock-visible " + styles.body },
                React.createElement(Truncate, { lines: this.state.expanded ? false : this.lines, onTruncate: this.handleTruncate }, this.props.children)),
            React.createElement("div", { className: "x-collapsibleBlock-actionButton" }, this.hasCollapsibleBody && this.actionButton)));
    }
    get actionButton() {
        const props = this.state.expanded ? {
            iconAfter: React.createElement(ChevronUp, { viewBox: "0 0 28 28" }),
            label: this.props.collapseButtonLabel,
        } : {
            iconAfter: React.createElement(ChevronDown, { viewBox: "0 -1 28 28" }),
            label: this.props.expandButtonLabel,
        };
        return React.createElement(Button, Object.assign({ type: "button", spacing: "none", appearance: "link", onClick: this.toggleExpanded, disableTouchRipple: true, className: "small" }, props));
    }
    get hasCollapsibleBody() {
        return this.state.truncated || this.state.expanded;
    }
    get lines() {
        if (this.props.linesBeforeTruncate !== undefined) {
            return this.props.linesBeforeTruncate;
        }
        return 4;
    }
}
export default CollapsibleBlock;
//# sourceMappingURL=index.js.map