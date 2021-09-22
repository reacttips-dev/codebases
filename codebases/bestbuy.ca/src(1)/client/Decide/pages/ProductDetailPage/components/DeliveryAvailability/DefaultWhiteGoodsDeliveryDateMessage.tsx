import * as React from "react";
import {FormattedMessage} from "react-intl";

import messages from "./translations/messages";
import {formatDateForDeliveryMessage} from "../../utils";
import {DatePropsInterface} from "./DatePropsInterface";

const DefaultWhiteGoodsDeliveryDateMessage: React.FC<DatePropsInterface> = ({postalCode, year, month, day}) => {
    const deliveryDate = formatDateForDeliveryMessage(year, month, day);
    return (
        <p>
            <FormattedMessage {...messages.specialDeliveryMSGSingleDate} values={{postalCode, date: deliveryDate}} />
        </p>
    );
};

DefaultWhiteGoodsDeliveryDateMessage.displayName = "DefaultWhiteGoodsDeliveryDateMessage";

export default DefaultWhiteGoodsDeliveryDateMessage;
