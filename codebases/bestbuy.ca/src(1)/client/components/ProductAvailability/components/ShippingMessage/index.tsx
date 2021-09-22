import * as React from "react";
import * as style from "./styles.css";
import {classname} from "utils/classname";
import {FormattedMessage} from "react-intl";
import messages from "./translations/messages";

export interface ShippingMessageProps {
    status: string;
    regionName: string;
    className?: string;
}

const ShippingMessage = ({className, status, regionName}: ShippingMessageProps) => {
    return (
        <span className={classname([className, style.container])}>
            {messages[status] && <FormattedMessage {...messages[status]} values={{region: regionName}} />}
        </span>
    );
};

export default ShippingMessage;
