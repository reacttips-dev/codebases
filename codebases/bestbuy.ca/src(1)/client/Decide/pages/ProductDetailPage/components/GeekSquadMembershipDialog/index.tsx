import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {AddToCart} from "@bbyca/ecomm-checkout-components/dist/components";

import Link from "components/Link";
import {Availability} from "models";

import * as styles from "./style.css";
import messages from "./translations/messages";

interface Props {
    isOpen: boolean;
    isAddToCartEnabled: boolean;
    close: () => undefined;
    availability: Availability;
    onGotoBasketPage: () => void;
}

interface State {
    isTermsAccepted: boolean;
}

export class GeekSquadMembershipDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isTermsAccepted: false,
        };
    }

    public render() {
        const {availability} = this.props;

        const isShippable = availability && availability.shipping && availability.shipping.purchasable;

        return (
            <Dialog
                open={this.props.isOpen}
                onBackdropClick={this.closeWithDefaultState}
                className={styles.container}
                classes={{
                    root: styles.dialogRoot,
                    paper: styles.dialogBody,
                }}>
                <h2 className={styles.dialogHeader}>
                    <FormattedMessage {...messages.header} />
                </h2>
                <ol>
                    <li>
                        <FormattedMessage {...messages.listItem1} />
                    </li>
                    <li>
                        <FormattedMessage {...messages.listItem2} />
                    </li>
                </ol>

                <FormattedMessage {...messages.fullTermsHref}>
                    {(localizedLink) => (
                        <Link key="desktop" href={localizedLink as string} className={styles.termsLink} external>
                            <FormattedMessage {...messages.fullTermsText} />
                            <KeyboardArrowRight
                                className={styles.icon}
                                classes={{
                                    root: styles.arrowIcon,
                                }}
                                viewBox={"0 0 16 16"}
                            />
                        </Link>
                    )}
                </FormattedMessage>

                <FormControlLabel
                    className={`${styles.materialOverride}`}
                    control={
                        <Checkbox
                            checked={this.state.isTermsAccepted}
                            className={`${styles.materialOverride} ${styles.checkbox}`}
                            color="primary"
                            onChange={this.updateCheck}
                        />
                    }
                    label={
                        <span className={styles.checkboxLabel}>
                            <FormattedMessage {...messages.agreement} />
                        </span>
                    }
                />

                <AddToCart
                    buttonClassName={styles.addToCartButton}
                    offer={{sku: availability ? availability.sku : ""}}
                    onViewCart={this.props.onGotoBasketPage.bind(this)}
                    disabled={!isShippable || !this.props.isAddToCartEnabled || !this.state.isTermsAccepted}
                />

                <Button
                    fullWidth={true}
                    className={`${styles.button} ${styles.continueShopping}`}
                    onClick={this.closeWithDefaultState}
                    variant="flat">
                    <FormattedMessage {...messages.noThanks} />
                </Button>
            </Dialog>
        );
    }

    public closeWithDefaultState = () => {
        this.setState({
            isTermsAccepted: false,
        });
        this.props.close();
    };

    private updateCheck = () => {
        this.setState((oldState) => {
            return {
                isTermsAccepted: !oldState.isTermsAccepted,
            };
        });
    };
}

export default GeekSquadMembershipDialog;
