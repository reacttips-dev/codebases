import {RadioButton} from "@bbyca/bbyca-components";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect, Dispatch} from "react-redux";
import {CartStatus, PartStatus} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";
import {addRequiredProductToCart, removeRequiredProductFromCart} from "@bbyca/ecomm-checkout-components/dist/redux/cart";
import {isCartStatus} from "@bbyca/ecomm-checkout-components/dist/redux/cart/selectors";

import {State as GlobalState} from "store";
import {AppActions} from "actions";
import {RequiredPartsCartStatus} from "models";

import * as styles from "./styles.css";
import messages from "./translations/messages";

interface OwnProps {
    parentItemJustAddedToCart: boolean;
    parentSku: string;
    requiredPartSku: string;
    showErrorMessage: (onRetry: () => void) => void;
    status: PartStatus;
    updateStatus: (sku: string, status: PartStatus) => void;
}

interface StateProps {
    isError: boolean;
}

interface State {
    hasUserMadeSelection: boolean;
}

const mapStateToProps = (state: GlobalState) => ({
    isError: isCartStatus(state.cart, CartStatus.FAILED),
});

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    addToCart: (parentSku: string, requiredPartSku: string) =>
        dispatch(addRequiredProductToCart(parentSku, requiredPartSku)),
    removeFromCart: (parentSku: string, requiredPartSku: string) => {
        dispatch(removeRequiredProductFromCart(parentSku, requiredPartSku));
    },
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & StateProps;

export class RequiredPartsOptIn extends React.Component<Props & InjectedIntlProps, State> {
    constructor(props) {
        super(props);

        this.state = {
            hasUserMadeSelection: false,
        };
    }

    public componentDidUpdate(prevProps: Props) {
        const errorJustOccurred: boolean = prevProps.isError !== this.props.isError && this.props.isError === true;

        if (errorJustOccurred) {
            this.props.showErrorMessage(this.tryAgain);
        }

        if (prevProps.status !== this.props.status) {
            const shouldSelectionBeUndefined =
                !this.state.hasUserMadeSelection &&
                this.props.parentItemJustAddedToCart &&
                this.props.status === RequiredPartsCartStatus.notInCart;

            if (shouldSelectionBeUndefined) {
                this.props.updateStatus(this.props.requiredPartSku, RequiredPartsCartStatus.initial);
            }
        }
    }

    public render() {
        const {intl, requiredPartSku, status} = this.props;

        return (
            <div className={styles["required-parts-opt-in"]} data-automation="required-parts-radio-group">
                <RadioButton
                    label={intl.formatMessage({...messages.requiredPartsOptInYes})}
                    onChange={this.onChange}
                    selectedValue={RequiredPartsCartStatus.isInCart}
                    value={status}
                    name={requiredPartSku}
                />
                <RadioButton
                    label={intl.formatMessage({...messages.requiredPartsOptInNo})}
                    onChange={this.onChange}
                    selectedValue={RequiredPartsCartStatus.notInCart}
                    value={status}
                    name={requiredPartSku}
                />
            </div>
        );
    }

    private onChange = (value: PartStatus): void => {
        this.setState({hasUserMadeSelection: true});
        this.props.updateStatus(this.props.requiredPartSku, value);

        if (value === RequiredPartsCartStatus.isInCart) {
            this.props.addToCart(this.props.parentSku, this.props.requiredPartSku);
        } else {
            this.props.removeFromCart(this.props.parentSku, this.props.requiredPartSku);
        }
    };

    private tryAgain = (): void => {
        this.onChange(
            this.props.status === RequiredPartsCartStatus.isInCart
                ? RequiredPartsCartStatus.notInCart
                : RequiredPartsCartStatus.isInCart,
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RequiredPartsOptIn));
