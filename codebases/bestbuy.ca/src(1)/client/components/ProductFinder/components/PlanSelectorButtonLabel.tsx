import * as React from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "../styles.css";

interface Props {
    messageId: string;
    subMessageId: string;
}

const PlanSelectorButtonLabel = ({
    messageId,
    subMessageId,
}: Props) => (
    <>
        <div>
            <FormattedMessage id={messageId} />
        </div>
        <div className={styles.subText}>
            <FormattedMessage id={subMessageId} />
        </div>
    </>
);

export default PlanSelectorButtonLabel;
