import * as React from "react";
import {FormattedMessage} from "react-intl";

import Link from "components/Link";

import {OptionBoxText} from "../../../../components/OptionBox";
import {VariantOptionsUIProps} from ".";
import messages from "./translations/messages";
import * as variantStyles from "./style.css";

export const PillSizeVariantNoPrice = (props: VariantOptionsUIProps) => {
    const {variantOptions, currentVariant} = props;
    return (
        <div className={variantStyles.sizeVariantWrapper}>
            <p className={variantStyles.selectedScreenSizeMessage}>
                <b>
                    <FormattedMessage {...messages.selectedScreenSizeMessage} />
                </b>
                {currentVariant.variantSize}
            </p>

            <div className={variantStyles.sizeVariantOptionsWrapper}>
                {variantOptions.map((variantOption, idx) => {
                    return (
                        <Link
                            to="product"
                            params={["", variantOption.sku]}
                            data-automation="product-screen-size-variant-link"
                            key={variantOption.sku}>
                            <OptionBoxText
                                dataAutomation="product-screen-size-variant"
                                text={variantOption.variantSize}
                                isSelected={variantOption.isSelected}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
