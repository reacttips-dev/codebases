import * as React from "react";

import ConversationContextMenu from "../ConversationContextMenu";
import OrderStatusForm from "../OrderStatusForm";
import GeneralQuestionForm from "../GeneralQuestionForm";
import PriceMatchForm from "../PriceMatchForm";
import ReturnForm from "../ReturnForm";
import Marketplace from "../Marketplace";
import {ConversationType} from "@bbyca/ecomm-communications-components";
import {FormattedMessage} from "react-intl";
import {Form} from "@bbyca/bbyca-components";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    option: ConversationType;
    handleOptionChange: (o) => void;
    handleSubmit: (type, event, data) => void;
    ordersWebAppUrl: string;
}

const forms = {
    INITIAL: null,
    ORDERSTATUS: <OrderStatusForm />,
    GENERALQUESTION: <GeneralQuestionForm />,
    PRICEMATCH: <PriceMatchForm />,
    RETURN: <ReturnForm />,
};

export const EmailUsForm: React.FC<Props> = ({option, handleOptionChange, handleSubmit, ordersWebAppUrl}) => {
    forms[ConversationType.marketPlace] = <Marketplace ordersWebAppUrl={ordersWebAppUrl} />;
    return (
        <>
            <h1 className={styles.emailUsHeading}>
                <FormattedMessage {...messages.emailUs} />
            </h1>
            <p>
                <FormattedMessage {...messages.emailUsSubheading} />
            </p>
            <Form onSubmit={handleSubmit}>
                <ConversationContextMenu optionSelected={option} onOptionChange={handleOptionChange} />
                {forms[option]}
            </Form>
        </>
    );
};

export default EmailUsForm;
