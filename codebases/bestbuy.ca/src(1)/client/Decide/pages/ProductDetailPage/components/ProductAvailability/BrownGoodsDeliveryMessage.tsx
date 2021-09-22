import * as React from "react";
import {FormattedMessage} from "react-intl";
import {classname} from "utils/classname";

import messages from "./translations/messages";
import {formatDateForDeliveryMessage, isDateToday, isDateTomorrow} from "../../utils";
import {DatePropsInterface} from "./DatePropsInterface";
import * as styles from "./style.css";

const BrownGoodsDeliveryMessage: React.FC<DatePropsInterface> = ({year, month, day}) => {
    let deliveryMessage;
    if (isDateToday(year, month, day)) {
        deliveryMessage = <FormattedMessage {...messages.DeliveryToday} />;
    } else if (isDateTomorrow(year, month, day)) {
        deliveryMessage = <FormattedMessage {...messages.DeliveryTomorrow} />;
    } else {
        deliveryMessage = (
            <FormattedMessage
                {...messages.DeliveryDate}
                values={{
                    date: formatDateForDeliveryMessage(year, month, day),
                }}
            />
        );
    }

    return (
        <p
            data-automation="availability-online-delivery-date"
            className={classname([
                styles.deliveryDate,
                styles.deliveryMessage,
                "x-pdp-availability-online-delivery-date",
            ])}>
            {deliveryMessage}
        </p>
    );
};

export default BrownGoodsDeliveryMessage;
