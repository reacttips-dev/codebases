import * as React from "react";
import ContactBlock from "../ContactBlock";
import { Email } from "@bbyca/bbyca-components";
import * as styles from "./style.css";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import messages from "./translations/messages";

import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import routeManager from "utils/routeManager";
import { convertLocaleToLang } from "models";
import { Locale } from "@bbyca/apex-components/dist/models";

export const EmailUs = (props: InjectedIntlProps) => (
        <ContactBlock
            href= {routeManager.getPathByKey(convertLocaleToLang(props.intl.locale as Locale), "emailUs")}
            onClick={() => { adobeLaunch.customLink("Help Centre CTA: Email"); }}
            className={styles.enabledComponent}
        >
            <Email className={styles.emailLogo}/>
            <h3 className={styles.emailHeader}><FormattedMessage {...messages.emailHeading} /></h3>
            <p className={styles.emailBody}><FormattedMessage {...messages.emailSubheading} /></p>
        </ContactBlock>
);

export default injectIntl(EmailUs);
