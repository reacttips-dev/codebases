import * as React from "react";
import {MinusCircle, PlusCircle} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";

import * as styles from "../styles.css";

export interface QuantityStepperProps {
    hasQuantityUpdateError?: boolean;
    max: number;
    onChange?: (n: number) => void;
    quantity?: number;
    disableButtons?: boolean;
}

export interface QuantityStepperState {
    inputValue: number;
    setQuantity: number;
}

const forceRange = (input: number, min = 1, max: number): number => {
    if (Number.isInteger(min)) {
        input = input < min ? min : input;
    }
    if (Number.isInteger(max)) {
        input = input > max ? max : input;
    }
    return input;
};

export class QuantityStepper extends React.Component<QuantityStepperProps, QuantityStepperState> {
    private timer?: ReturnType<typeof setTimeout>;
    private TIMER_DELAY: number = 500;

    constructor(props: QuantityStepperProps) {
        super(props);
        this.state = {
            inputValue: props.quantity || 1,
            setQuantity: props.quantity || 1,
        };
    }

    public componentWillReceiveProps(nextProps: QuantityStepperProps) {
        if (
            nextProps.hasQuantityUpdateError &&
            nextProps.hasQuantityUpdateError !== this.props.hasQuantityUpdateError
        ) {
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
    // TODO: Check disabling of buttons
    public render() {
        const atMin = this.state.setQuantity <= 1;
        const atMax = this.state.setQuantity >= this.props.max;

        return (
            <div className={styles.quantityStepper} data-automation="quantity-stepper">
                <button
                    disabled={this.props.disableButtons || atMin}
                    onClick={this.decrease}
                    className={styles.quantityStepperButton}
                    type="button"
                    value="minus">
                    <MinusCircle className={styles.icon} filled={!(this.props.disableButtons || atMin)} />
                </button>
                <input
                    aria-valuemax={this.props.max}
                    aria-valuemin={1}
                    aria-valuenow={this.state.inputValue}
                    type="number"
                    name="quantity"
                    min="1"
                    max={this.props.max}
                    className={styles.quantityStepperInput}
                    autoComplete="off"
                    value={this.state.inputValue}
                    onBlur={this.handleTextBlur}
                    onChange={this.handleTextChange}
                />
                <button
                    disabled={this.props.disableButtons || atMax}
                    onClick={this.increase}
                    className={classname([styles.quantityStepperButton, styles.right])}
                    type="button"
                    value="add">
                    <PlusCircle className={styles.icon} filled={!(this.props.disableButtons || atMax)} />
                </button>
            </div>
        );
    }

    private increase = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        this.onQuantityChange(this.state.setQuantity === this.props.max ? this.props.max : this.state.setQuantity + 1);
    };

    private decrease = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        this.onQuantityChange(this.state.setQuantity === 1 ? 1 : this.state.setQuantity - 1);
    };

    private handleTextChange = (e) => {
        this.setState({inputValue: e.currentTarget.value});
        const num = parseInt(e.currentTarget.value, 10);
        if (Number.isInteger(num)) {
            this.onQuantityChange(num);
        }
    };

    private handleTextBlur = () => {
        this.setState({inputValue: this.state.setQuantity});
    };

    private onQuantityChange = (num: number) => {
        num = forceRange(num, 1, this.props.max);
        this.setState(
            {
                inputValue: num,
                setQuantity: num,
            },
            () => {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.props.onChange(num);
                }, this.TIMER_DELAY);
            },
        );
    };
}
