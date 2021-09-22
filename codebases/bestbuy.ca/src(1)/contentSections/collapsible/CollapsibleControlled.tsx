import * as React from "react";
import * as styles from "./styles.css";
export default class CollapsibleControlled extends React.Component {
    constructor(props) {
        super(props);
        this.TRANSITION_INT = 500;
        this.handleToggle = (e) => {
            if (e && e.currentTarget && e.currentTarget.blur) {
                e.currentTarget.blur();
            }
            if (this.props.onToggle) {
                this.props.onToggle();
            }
        };
        this.expand = () => {
            clearTimeout(this.transitionTimeout);
            this.setState({
                height: 0,
            });
            setTimeout(() => {
                this.setState({
                    height: this.containerRef.offsetHeight,
                });
                this.transitionTimeout = window.setTimeout(() => this.setState({ height: undefined }), this.TRANSITION_INT);
            }, 100);
        };
        this.collapse = () => {
            clearTimeout(this.transitionTimeout);
            this.setState({
                height: this.containerRef.offsetHeight,
            });
            setTimeout(() => {
                this.setState({
                    height: 0,
                });
            }, 100);
        };
        this.state = {
            height: props.collapsed ? 0 : undefined,
        };
    }
    componentWillUpdate(nextProps) {
        if (nextProps.collapsed !== this.props.collapsed) {
            nextProps.collapsed ? this.collapse() : this.expand();
        }
    }
    render() {
        const collapsed = !!this.props.collapsed ? styles.collapsed : "";
        const height = this.state.height !== undefined ? this.state.height + "px" : "none";
        const hasIcon = this.props.headerIcon;
        return (React.createElement("div", { className: styles.collapsibleSection + " " + collapsed },
            React.createElement("header", { className: styles.header },
                React.createElement("button", { className: `toggle ${hasIcon ? "with-icon" : ""}`, type: "button", onClick: this.handleToggle },
                    this.props.headerIcon && React.createElement("div", { className: "icon" }, this.props.headerIcon),
                    this.props.headerText)),
            React.createElement("div", { className: "collapsible-container", "aria-expanded": !this.props.collapsed, style: { maxHeight: height } },
                React.createElement("div", { className: "collapsible-content", ref: (ref) => (this.containerRef = ref) },
                    React.createElement("div", { className: styles.content }, this.props.children),
                    this.props.closeText && (React.createElement("footer", { className: styles.footer },
                        React.createElement("button", { className: "toggle", type: "button", onClick: this.handleToggle }, this.props.closeText)))))));
    }
}
//# sourceMappingURL=CollapsibleControlled.js.map