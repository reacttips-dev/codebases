import * as React from "react";
import { useState } from "react";
import { ContactBlock } from "..";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import { FormattedMessage } from "react-intl";
import { Phone } from "@bbyca/bbyca-components";
import { utils as adobeLaunch } from "@bbyca/adobe-launch";

export interface StateProps {
    displayMessage: JSX.Element;
}

export const CallUs = () => {

    const phoneNumber = "1-866-237-8289";
    const [displayMessage, setDisplayMessage] = useState(<FormattedMessage {...messages.callUsMessage} />);

    const handleOnContactBlockClick = () => {
        adobeLaunch.customLink("Help Centre CTA: Call");
        setDisplayMessage(<a href={`tel:${phoneNumber}`}>{phoneNumber}</a>);
    };

    return (
        <ContactBlock className={styles.enabledComponent} onClick={handleOnContactBlockClick}>
            <Phone className={styles.phoneLogo}/>
            <h3 className={styles.callUs}>{displayMessage}</h3>
            <p className={styles.callUsAvailability}>
                <FormattedMessage {...messages.callUsAvailability}/>
            </p>
        </ContactBlock>
    );
};

export default CallUs;
