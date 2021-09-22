import * as React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import messages from "./translations/messages";
import Link from "components/Link";
import * as styles from "./styles.css";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

export interface LegalPoliciesProps {
    environment: string;
}

export const LegalPolicies: React.FC<LegalPoliciesProps> = (props) => {
    const helpTopicIds = getHelpTopicsId(props.environment);

    return (
        <div className={styles.legalContainer} data-automation="terms-helper-text">
            <FormattedMessage
                {...messages.legalPoliciesBody}
                values={{
                    terms: (
                        <Link
                            to="help"
                            params={[...helpTopicIds.termsConditions]}
                            external={true}
                            targetSelf={false}
                            extraAttrs={{"data-automation": "terms-link"}}>
                            <FormattedMessage {...messages.legalPoliciesTerms} />
                        </Link>
                    ),
                    privacy: (
                        <Link
                            to="help"
                            params={[...helpTopicIds.privacy]}
                            external={true}
                            targetSelf={false}
                            extraAttrs={{"data-automation": "privacy-link"}}>
                            <FormattedMessage {...messages.legalPoliciesPrivacy} />
                        </Link>
                    ),
                }}
            />
        </div>
    );
};

export default injectIntl(LegalPolicies);
