import * as React from "react";
import BasketIcon from "./components/BasketIcon/BasketIcon";
import Confirmation from "./components/Confirmation/Confirmation";
import * as styles from "./styles.css";
export class CartIndicator extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClose = () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        };
        this.handleViewCart = () => {
            this.props.onViewCart();
        };
    }
    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount();
        }
    }
    render() {
        return (React.createElement("div", { className: styles.cartIndicator, id: "cartIcon" },
            React.createElement(BasketIcon, { totalQuantity: this.props.orderNumber ? 0 : this.props.totalQuantity, onViewCart: this.handleViewCart, showLabel: this.props.showLabel }),
            React.createElement(Confirmation, { apiStatusCode: this.props.apiStatusCode, show: this.props.showConfirmation, onClose: this.handleClose, onViewCart: this.handleViewCart, status: this.props.status })));
    }
}
export default CartIndicator;
//# sourceMappingURL=CartIndicator.js.map