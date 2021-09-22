import * as React from "react";
import { Close } from "../../SvgIcons/Close";
import InPageNav from "./InPageNav/InPageNav";
import * as styles from "./styles.css";
class SideNavMenu extends React.Component {
    constructor(props) {
        super(props);
        this.renderSideNavMenu = () => {
            return (React.createElement("div", { className: this.getSideNavClassNames() },
                this.props.displayCloseIcon && (React.createElement("a", { "data-automation": "close-side-nav", className: `${styles[this.props.closeIconColor || styles.darkGrey]} ${styles.closeIcon}`, onClick: () => this.setState({ isOpen: false }) },
                    React.createElement("span", { className: styles.closeIconWrapper },
                        React.createElement(Close, { color: this.props.closeIconColor, className: styles.closeIcon })))),
                this.props.sideNavContent()));
        };
        this.getSideNavClassNames = () => {
            const classNames = [styles.sideNav];
            this.state.isOpen ? classNames.push(styles.sideNavFullWidth) : classNames.push(styles.sideNavHidden);
            return classNames.join(" ");
        };
        this.displayOverlay = () => this.state.isOpen && React.createElement("div", { className: styles.globalOverlay, onClick: () => this.setState({ isOpen: false }) });
        this.state = { isOpen: false };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(InPageNav, { title: this.props.title, onClick: () => this.setState({ isOpen: true }) }),
            this.displayOverlay(),
            this.renderSideNavMenu()));
    }
}
export default SideNavMenu;
//# sourceMappingURL=SideNavMenu.js.map