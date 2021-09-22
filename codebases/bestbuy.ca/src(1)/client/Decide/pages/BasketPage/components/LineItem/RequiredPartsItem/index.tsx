import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Remove, RequiredPartsLineItem} from "@bbyca/ecomm-checkout-components";

import Link from "components/Link";
import {ChildLineItem} from "models/Basket";

import messages from "../translations/messages";
import * as styles from "./styles.css";

export interface RequiredPartsItemProps {
    requiredParts: ChildLineItem[];
    parentSku: string;
    onRemoveChildItem: (lineItemId: string) => void;
    areAllRequiredProductsInCart: boolean;
    disabled?: boolean;
}

const RequiredPartsItem: React.FC<RequiredPartsItemProps> = (props: RequiredPartsItemProps) => {
    const {requiredParts, onRemoveChildItem, disabled, parentSku, areAllRequiredProductsInCart} = props;
    return (
        <>
            <div data-automation={`required-parts-item-${parentSku}`}>
                <header className={styles.reqPartsHeader}>
                    <FormattedMessage {...messages.SeeRequiredPartsHeader} />
                </header>
                {!areAllRequiredProductsInCart && (
                    <div
                        className={styles.requiredPartsItemDetails}
                        data-automation={`required-parts-item-details-${parentSku}`}>
                        <p className={styles.requiredPartsDesc}>
                            <FormattedMessage {...messages.SeeRequiredPartsDescription} />
                        </p>
                        <Link
                            disabled={disabled}
                            chevronType="right"
                            className={styles.seeRequiredPartsItemLink}
                            targetSelf={true}
                            params={[parentSku]}
                            to="requiredParts">
                            <span data-automation="required-parts-link">
                                <FormattedMessage {...messages.SeeRequiredPartsLinkText} />
                            </span>
                        </Link>
                    </div>
                )}
            </div>
            {requiredParts &&
                requiredParts.map((requiredPart, index) => (
                    <React.Fragment key={requiredPart.product.sku}>
                        <RequiredPartsLineItem
                            name={requiredPart.product.name}
                            thumbnailUrl={requiredPart.product.thumbnailUrl}
                            offer={{
                                regularPrice: requiredPart.product.offer.regularPrice,
                                salePrice: requiredPart.product.offer.purchasePrice,
                            }}
                            footer={
                                <Remove
                                    className={"remove-required-product"}
                                    onRemove={() => onRemoveChildItem(requiredPart.id)}
                                />
                            }
                        />
                        {index < requiredParts.length - 1 ? <hr /> : null}
                    </React.Fragment>
                ))}
        </>
    );
};

export default RequiredPartsItem;
