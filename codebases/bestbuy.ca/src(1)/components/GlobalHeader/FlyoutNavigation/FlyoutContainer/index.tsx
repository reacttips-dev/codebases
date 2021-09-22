import { ChevronDown } from "@bbyca/bbyca-components";
import classNames from "classnames";
import * as React from "react";
import ClickAwayListener from "../../../ClickAwayListener";
import * as styles from "./style.css";
export const DownArrow = () => React.createElement(ChevronDown, { color: "white", viewBox: "0 4 24 26", className: styles.rightIcon });
export class FlyoutContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.toggleMenu = (item) => {
            const isCurrentItem = this.props.selectedItem === item;
            this.props.setSelectedItem(isCurrentItem ? "" : item);
        };
        this.handleClickAway = () => {
            this.toggleMenu("");
        };
    }
    render() {
        const { selectedItem, className = "" } = this.props;
        return (React.createElement("div", { className: `${styles.flyoutContainer} ${className}` },
            React.createElement("ul", { className: styles.linkList }, this.props.menuItems.map((item) => {
                const isActive = selectedItem === item.id;
                const className = classNames(styles.flyoutMenu, { [styles.active]: isActive });
                return item.content ? React.createElement("li", { key: item.id },
                    React.createElement(ClickAwayListener, { active: isActive, onClickAway: this.handleClickAway },
                        React.createElement("div", { className: (item.id === "deals" || item.id === "services") ? styles.dealsContainer : "" },
                            React.createElement("button", { onClick: () => this.toggleMenu(item.id), className: isActive ? styles.activeButton : "" },
                                item.label,
                                React.createElement(DownArrow, null)),
                            isActive &&
                                React.createElement("div", { className: styles.flyoutIndicatorContainer },
                                    React.createElement("div", { className: item.id === "shop" ? styles.shopFlyoutIndicator : styles.flyoutIndicator })),
                            React.createElement("div", { className: classNames(className, `nav-item-${item.id}`), style: item.contentPanelStyles }, item.content)))) : React.createElement("li", { key: item.id }, item.label);
            }))));
    }
}
export default FlyoutContainer;
//# sourceMappingURL=index.js.map