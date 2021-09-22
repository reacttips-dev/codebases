/* tslint:disable:react-a11y-role-has-required-aria-props */
import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {routeManager} from "@bbyca/apex-components";
import {Form, Select} from "@bbyca/bbyca-components";

import messages from "./translations/messages";
import {VariantOptionsUIProps} from ".";
import * as variantStyles from "./style.css";

export const DropdownSizeVariant = injectIntl<VariantOptionsUIProps & InjectedIntlProps>((props) => {
    const {
        variantOptions,
        currentVariant,
        routingActions,
        language,
        intl: {formatMessage},
    } = props;

    const handleChange = (name, sku) => {
        routingActions.push(routeManager.getPathByKey(language, "product", "", sku));
    };

    return (
        <div className={variantStyles.sizeVariantWrapper}>
            <Form onSubmit={(data, e) => e.preventDefault()}>
                <Select
                    name="size-variant"
                    label={formatMessage(messages.selectedScreenSizeMessage)}
                    value={currentVariant.sku}
                    handleSyncChange={handleChange}>
                    <option key={0} disabled>
                        {formatMessage(messages.selectedScreenSizeMessage)}
                    </option>
                    {variantOptions.map((variantOption) => (
                        <option value={variantOption.sku} key={variantOption.sku}>
                            {variantOption.variantSize}
                        </option>
                    ))}
                </Select>
            </Form>
        </div>
    );
});
