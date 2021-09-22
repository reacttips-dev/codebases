import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Link} from "@bbyca/bbyca-components";

import {EligibilityResultContainer} from ".";
import messages from "./translations/messages";
import * as styles from "./styles.css";

export const NotEligibleResult: React.FC<{
    storesLinkUrl: string;
}> = ({storesLinkUrl}) => {
    const title = {...messages.notEligibleTitle};
    const paragraph = {...messages.notEligibleParagraph};
    return (
        <EligibilityResultContainer hasNoBorderDescription={false} title={title} paragraph={paragraph}>
            <Link href={storesLinkUrl} targetSelf={false} chevronType="right" className={styles.storesLink}>
                <FormattedMessage {...messages.closestStoreLinkText} />
            </Link>
        </EligibilityResultContainer>
    );
};
