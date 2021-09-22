import * as isEqual from "react-fast-compare";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {classname, classIf} from "utils/classname";

import {AddToCart} from "@bbyca/ecomm-checkout-components/dist/components";
import {Button} from "@bbyca/bbyca-components";
import {Availability, AvailabilityPickupStatus, Warranty} from "models";

import {GeekSquadMembershipDialogActionCreators} from "../../../../actions";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    onAddToCart: () => boolean;
    onReserveInStoreButtonClick: () => void;
    onGotoBasketPage: () => void;
    isAvailabilityError: boolean;
    availability: Availability;
    isRpuEnabled?: boolean;
    isAddToCartEnabled?: boolean;
    isSubscription?: boolean;
    selectedWarranty: Warranty | null;
    geekSquadMembershipSubscriptionDialogActions: GeekSquadMembershipDialogActionCreators;
    onAddToCartConfirmation?: () => void;
    isDisabled: boolean;
}

export interface State {
    isCartLoading: boolean;
    isRPULoading: boolean;
}

export class ProductToolbar extends React.Component<Props & InjectedIntlProps, State> {
    private isPreOrder: boolean;
    private isShippable: boolean;
    private isReservable: boolean;
    private isOnlineOnly: boolean;
    private browseMode: boolean;

    constructor(props: Props & InjectedIntlProps) {
        super(props);
        this.state = {isCartLoading: false, isRPULoading: false};
    }

    public shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (
            this.state.isCartLoading !== nextState.isCartLoading ||
            this.state.isRPULoading !== nextState.isRPULoading
        ) {
            return true;
        }
        return !isEqual(
            {
                ...this.props,
                isAddToCartEnabled: this.props.isAddToCartEnabled === undefined ? false : this.props.isAddToCartEnabled,
                isRpuEnabled: this.props.isRpuEnabled === undefined ? false : this.props.isRpuEnabled,
            },
            nextProps,
        );
    }

    public render() {
        const {
            intl,
            isAddToCartEnabled,
            isRpuEnabled,
            isAvailabilityError,
            availability,
            onGotoBasketPage,
            selectedWarranty,
            isDisabled,
        } = this.props;

        this.browseMode = isAddToCartEnabled === false && isRpuEnabled === false;
        if (availability) {
            if (availability.pickup) {
                this.isReservable =
                    availability.pickup.purchasable &&
                    (isRpuEnabled === undefined || isRpuEnabled === true) &&
                    !this.browseMode;
                this.isOnlineOnly = availability.pickup.status === AvailabilityPickupStatus.OnlineOnly;
            }
            if (availability.shipping) {
                this.isShippable = availability.shipping.purchasable && !this.browseMode;
                this.isPreOrder = availability.shipping.status === AvailabilityPickupStatus.Preorder;
            }
        }

        const offer = {
            sku: availability ? availability.sku : "",
            associatedItems: !selectedWarranty ? undefined : [{sku: selectedWarranty.sku}],
        };

        const buttonLabel = this.props.isSubscription ? "subscribe" : this.isPreOrder ? "preOrder" : "addToCart";

        return (
            <>
                <div
                    data-automation="checkout-button-container"
                    className={`x-checkout-experience-new ${styles.container} ${
                        !availability && !isAvailabilityError ? styles.loadingButtons : ""
                    }`}>
                    <div className={styles.addToCartButtonContainer}>
                        {this.props.isSubscription ? (
                            <Button
                                className={classname([
                                    "x-geekSquadMembershipButton",
                                    styles.button,
                                    styles.geekSquadMembershipDialogOpenButton,
                                    classIf(styles.disabled, isDisabled),
                                ])}
                                isDisabled={isDisabled}
                                onClick={this.props.geekSquadMembershipSubscriptionDialogActions.open}>
                                <FormattedMessage {...messages.geekSquadMembershipSubscribe} />
                            </Button>
                        ) : (
                            <>
                                <AddToCart
                                    buttonClassName={styles.addToCartButton}
                                    disabled={this.isAddToCartDisabled()}
                                    isCartLoading={this.state.isCartLoading}
                                    label={
                                        <span className={styles.addToCartLabel}>
                                            {intl.formatMessage(messages[buttonLabel])}
                                        </span>
                                    }
                                    offer={offer}
                                    onViewCart={onGotoBasketPage.bind(this)}
                                    onSubmit={() => !this.isAddToCartDisabled() && this.props.onAddToCart()}
                                    onSuccessConfirmation={this.props.onAddToCartConfirmation}
                                />
                            </>
                        )}
                    </div>
                    {this.reserveInStoreButton()}
                </div>
            </>
        );
    }

    private isAddToCartDisabled = (): boolean => !this.isShippable || this.state.isRPULoading || this.props.isDisabled;

    private reserveInStoreButton = () => {
        return (
            !this.isPreOrder &&
            !this.isOnlineOnly &&
            !this.isComingSoonStatus() && (
                <Button
                    appearance={"secondary"}
                    className={`x-reserveInStoreButton ${styles.button} ${styles.reserveInStoreButton} ${(!this.isReservable || this.state.isCartLoading) && styles.disabled}`}
                    data-automation="reserve-in-store-button"
                    onClick={this.onReserveInStoreButtonClick()}
                    isDisabled={
                        this.browseMode || !this.isReservable || this.state.isRPULoading || this.state.isCartLoading
                    }>
                    {this.state.isRPULoading ? (
                        <CircularProgress size={24} style={{top: "8px", color: "#fff"}} />
                    ) : (
                        <FormattedMessage {...messages.pickupInStore} />
                    )}
                </Button>
            )
        );
    };

    private onReserveInStoreButtonClick = () => async () => {
        if (this.isReservable) {
            this.setState({isRPULoading: true});
            await this.props.onReserveInStoreButtonClick();
            this.setState({isRPULoading: false});
        }
    };

    private isComingSoonStatus() {
        return this.props.availability?.pickup?.status === AvailabilityPickupStatus.ComingSoon;
    }
}

export default injectIntl(ProductToolbar);
