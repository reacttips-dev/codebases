import * as React from "react";
import { Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import { AddToCart } from "@bbyca/ecomm-checkout-components/dist/components";
import { FormattedMessage } from "react-intl";
import * as styles from "../styles.css";
import messages from "../translations/messages";

interface AddToCartButtonProps {
    loading: boolean;
    offer: object;
    callback: (product: any) => boolean;
}

export const AddToCartButtonSkeleton = () => <LoadingSkeleton.Button />;

const AddToCartButton = ({
    loading,
    offer,
    callback,
    ...others
}: AddToCartButtonProps) => {
    return (
        <Loader
            loading={loading}
            loadingDisplay={<AddToCartButtonSkeleton />}
        >
            <AddToCart
                {...others}
                className={styles.addToCart}
                offer={offer}
                isCartLoading={false}
                disabled={false}
                showCartIcon={false}
                label={<FormattedMessage id={messages.addToCartButton.id} />}
                onSubmit={callback}
            />
        </Loader>
    );
};

export default AddToCartButton;
