import * as React from "react";
import MinusIcon from "../../../../icons/MinusIcon";
import PlusIcon from "../../../../icons/PlusIcon";
import * as styles from "./styles.css";
const forceRange = (i, min = 1, max) => {
    if (Number.isInteger(min)) {
        i = i < min ? min : i;
    }
    if (Number.isInteger(max)) {
        i = (i > max ? max : i);
    }
    return i;
};
export default class QuantityStepper extends React.Component {
    constructor(props) {
        super(props);
        this.delay = 500;
        this.increase = (e) => {
            e.preventDefault();
            this.onQuantityChange(this.state.setQuantity === this.props.max ? this.props.max : this.state.setQuantity + 1);
        };
        this.decrease = (e) => {
            e.preventDefault();
            this.onQuantityChange(this.state.setQuantity === 1 ? 1 : this.state.setQuantity - 1);
        };
        this.handleTextChange = (e) => {
            this.setState({ inputValue: e.currentTarget.value });
            const n = parseInt(e.currentTarget.value, 10);
            if (Number.isInteger(n)) {
                this.onQuantityChange(n);
            }
        };
        this.handleTextBlur = () => {
            this.setState({ inputValue: this.state.setQuantity });
        };
        this.onQuantityChange = (n) => {
            window.clearTimeout(this.t);
            n = forceRange(n, 1, this.props.max);
            this.setState({
                inputValue: n,
                setQuantity: n,
            });
            this.t = window.setTimeout(() => {
                this.props.onChange(n);
            }, this.delay);
        };
        this.state = {
            inputValue: props.quantity || 1,
            setQuantity: props.quantity || 1,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.hasQuantityUpdateError &&
            nextProps.hasQuantityUpdateError !== this.props.hasQuantityUpdateError) {
            this.setState({
                inputValue: this.props.quantity || 1,
                setQuantity: this.props.quantity || 1,
            });
        }
        if (nextProps.quantity !== this.props.quantity) {
            this.setState({
                inputValue: nextProps.quantity || 1,
                setQuantity: nextProps.quantity || 1,
            });
        }
    }
    render() {
        const atMin = this.state.setQuantity <= 1 ? true : false;
        const atMax = this.state.setQuantity >= this.props.max ? true : false;
        return (React.createElement("div", { className: styles.quantityStepper },
            React.createElement("div", { className: "quantity-stepper" },
                React.createElement("button", { disabled: atMin, onClick: this.decrease, className: "stepper left", type: "button", value: "minus" },
                    React.createElement(MinusIcon, { className: "icon" })),
                React.createElement("input", { type: "number", name: "quantity", min: "1", max: this.props.max, className: "quantity-input", autoComplete: "off", value: this.state.inputValue, onBlur: this.handleTextBlur, onChange: this.handleTextChange }),
                React.createElement("button", { disabled: atMax, onClick: this.increase, className: "stepper right", type: "button", value: "add" },
                    React.createElement(PlusIcon, { className: "icon" })))));
    }
}
//# sourceMappingURL=QuantityStepper.js.map