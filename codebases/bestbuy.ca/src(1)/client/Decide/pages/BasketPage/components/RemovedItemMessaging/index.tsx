import * as React from "react";
import {LineItemType} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";
import {GlobalSuccessMessage} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import {ChildLineItem} from "models";

import messages from "./translations/messages";

export interface RemovedItemMessagingProps {
    parentName: string;
    childLineItems?: ChildLineItem[];
    className?: string;
}

const messaging = {
    [LineItemType.Psp]: <FormattedMessage {...messages.GspItemRemoved} />,
    [LineItemType.FreeItem]: <FormattedMessage {...messages.FreeItemRemoved} />,
};

const RemovedItemMessaging: React.FC<RemovedItemMessagingProps> = ({parentName, childLineItems, className = ""}) => (
    <div className={className}>
        <GlobalSuccessMessage>
            <FormattedMessage {...messages.ItemRemoved} values={{skuName: parentName}} />
            {childLineItems &&
                childLineItems.map((childLineItem: ChildLineItem) => {
                    return childLineItem.type === LineItemType.Psp || childLineItem.type === LineItemType.FreeItem ? (
                        <div key={childLineItem.id} data-automation="child-item-removed-msg">
                            {messaging[childLineItem.type]}
                        </div>
                    ) : null;
                })}
        </GlobalSuccessMessage>
    </div>
);

export default RemovedItemMessaging;
