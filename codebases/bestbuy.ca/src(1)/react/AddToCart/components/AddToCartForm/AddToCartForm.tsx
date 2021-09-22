import { Button, Cart as CartIcon } from "@bbyca/bbyca-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { injectIntl } from "react-intl";
import { CartStatus } from "../../../../business-rules/entities";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class AddToCartForm extends React.Component {
    constructor(props) {
        super(props);
        this.setWasClicked = () => this.setState({ wasClicked: true });
        this.state = {
            wasClicked: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cart.status !== CartStatus.PROCESSING) {
            this.setState({ wasClicked: false });
        }
    }
    render() {
        const { buttonClassName = "", cart, disabled, intl, isCartLoading = false, label, loaderSize = 24, offer, showCartIcon, } = this.props;
        const { wasClicked } = this.state;
        return (React.createElement("form", { method: "post", id: "test", action: "", target: "_self", onSubmit: this.handleSubmit.bind(this) },
            React.createElement("input", { type: "hidden", name: "sku", id: "sku", value: offer.sku }),
            React.createElement(Button, { className: `${buttonClassName} addToCartButton`, "data-automation": "addToCartButton", isDisabled: disabled, onClick: this.setWasClicked, type: "submit" }, wasClicked && !disabled && (cart.status === CartStatus.PROCESSING || isCartLoading) ?
                React.createElement(CircularProgress, { size: loaderSize, classes: {
                        root: styles.circularProgressRoot,
                    }, className: `${styles.addToCartCircularProgress}` }) :
                React.createElement("div", { className: `${styles.addToCartLabel}` },
                    showCartIcon && React.createElement(CartIcon, { className: styles.cartIcon }),
                    label || intl.formatMessage(messages.buttonLabel)))));
    }
    handleSubmit(e) {
        e.preventDefault();
        const { add, onSubmit = () => true } = this.props;
        const handleAddSuccess = this.props.onSuccessConfirmation || this.props.showConfirmation;
        if (onSubmit()) {
            add(this.props.offer, handleAddSuccess);
        }
    }
}
export default injectIntl(AddToCartForm);
//# sourceMappingURL=AddToCartForm.js.map