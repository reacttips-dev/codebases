import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import CartSvg from "../../../../icons/CartSvg";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class BasketIcon extends React.Component {
    constructor(props) {
        super(props);
        this.handleViewCart = () => {
            this.props.onViewCart();
        };
        this.state = {
            pulse: false,
        };
    }
    componentWillReceiveProps(newProps) {
        if (this.props.totalQuantity !== 0 && newProps.totalQuantity !== this.props.totalQuantity) {
            this.pulse();
        }
    }
    render() {
        const pulse = (this.state.pulse) ? " pulse" : "";
        return (React.createElement("div", null,
            React.createElement("a", { "data-automation": "x-basket", onClick: this.handleViewCart, className: styles.basketIcon, href: "javascript:void(0);" },
                React.createElement(CartSvg, { className: "icon" }),
                this.props.totalQuantity > 0
                    && React.createElement("span", { className: "counter" + pulse },
                        " ",
                        this.props.totalQuantity),
                this.props.showLabel &&
                    React.createElement("span", { className: "label" },
                        React.createElement(FormattedMessage, Object.assign({}, messages.basketLabel))))));
    }
    pulse() {
        this.setState({ pulse: true });
        clearTimeout(this.pulseTimeout);
        this.pulseTimeout = setTimeout(() => {
            this.setState({ pulse: false });
        }, 1000); // Please also see the styles.css 'pulseInt: 1000' value
    }
}
export default injectIntl(BasketIcon);
//# sourceMappingURL=BasketIcon.js.map