import * as React from "react";
import * as ReactDOM from "react-dom";
const isDescendant = (el, target) => {
    if (target !== null) {
        return el === target || isDescendant(el, target.parentNode);
    }
    return false;
};
const clickAwayEvents = ["touchstart", "mousedown"];
const bind = (callback) => clickAwayEvents.forEach((event) => document.addEventListener(event, callback));
const unbind = (callback) => clickAwayEvents.forEach((event) => document.removeEventListener(event, callback));
export default class ClickAwayListener extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClickAway = (event) => {
            if (event.defaultPrevented) {
                return;
            }
            const el = ReactDOM.findDOMNode(this);
            if (document.documentElement.contains(event.target)) {
                if (!isDescendant(el, event.target)) {
                    const attribute = event.target.attributes.getNamedItem("data-automation");
                    if (attribute && attribute.value === "x-global-overlay") {
                        event.preventDefault();
                    }
                    this.props.onClickAway(event);
                }
            }
        };
    }
    componentDidMount() {
        if (this.props.onClickAway && this.props.active) {
            bind(this.handleClickAway);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.active !== prevProps.active) {
            unbind(this.handleClickAway);
            if (this.props.active === true && this.props.onClickAway) {
                bind(this.handleClickAway);
            }
        }
    }
    componentWillUnmount() {
        unbind(this.handleClickAway);
    }
    render() {
        return this.props.children;
    }
}
//# sourceMappingURL=ClickAwayListener.js.map