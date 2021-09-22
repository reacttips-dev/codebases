import * as React from "react";
import {FormattedMessage} from "react-intl";

import messages from "./translations/messages";
import {isDateToday, isDateTomorrow} from "../../utils";
import DefaultWhiteGoodsDeliveryDateMessage from "./DefaultWhiteGoodsDeliveryDateMessage";
import {DatePropsInterface} from "./DatePropsInterface";

const WhiteGoodsDeliveryMessage: React.FC<DatePropsInterface> = ({postalCode, year, month, day}) => {
    let componentToReturn;

    if (isDateToday(year, month, day)) {
        componentToReturn = (
            <p>
                <FormattedMessage {...messages.specialDeliveryMSGToday} values={{postalCode}} />
            </p>
        );
    } else if (isDateTomorrow(year, month, day)) {
        componentToReturn = (
            <p>
                <FormattedMessage {...messages.specialDeliveryMSGTomorrow} values={{postalCode}} />
            </p>
        );
    } else {
        componentToReturn = (
            <DefaultWhiteGoodsDeliveryDateMessage postalCode={postalCode} year={year} month={month} day={day} />
        );
    }

    return (
        <>
            {componentToReturn}
            <p>
                <FormattedMessage {...messages.specialDeliveryMSGSingleDateSubText} />
            </p>
        </>
    );
};

export default WhiteGoodsDeliveryMessage;
