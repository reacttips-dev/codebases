import * as React from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";

const EndOfResults = () => {

    return <div className={styles.endOfList}><FormattedMessage {...messages.endOfList} /></div>;

};

export default EndOfResults;
