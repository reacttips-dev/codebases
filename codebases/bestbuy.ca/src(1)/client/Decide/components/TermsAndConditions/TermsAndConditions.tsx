import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Link, Checkbox} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";

import * as styles from "./style.css";
import messages from "./translations/messages";

export interface TermsAndConditionsLink {
    href: string;
    openNewTab?: boolean;
    text: React.ReactElement | string;
    dataAutomation: string;
}

export interface Props {
    isTermsAccepted: boolean;
    shouldHighlightTerms: boolean;
    links: TermsAndConditionsLink[];
    className?: string;
    errorMsg?: string;
    onTermsChecked(checked: boolean): void;
}

const TermsAndConditions: React.FC<Props & InjectedIntlProps> = ({
    isTermsAccepted,
    shouldHighlightTerms,
    onTermsChecked,
    links,
    className = "",
    intl,
    errorMsg,
}) => {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div data-automation="terms-and-conditions" className={classname(className)}>
            <Checkbox
                className={styles.checkBox}
                extraAttrs={{"data-automation": "terms-checkbox"}}
                label={intl.formatMessage(messages.agreement)}
                name="termsAndConditionsCheckbox"
                value={isTermsAccepted ? "checked" : ""}
                error={shouldHighlightTerms}
                errorMsg={errorMsg}
                handleAsyncChange={(id, val, error) => onTermsChecked(!!val)}
            />
            <ul className={styles.warrantyList} data-automation="terms-and-conditions-links">
                {links.map((link) => {
                    return (
                        <li key={link.dataAutomation} className={styles.warrantyListItem}>
                            <Link href={link.href} targetSelf={!link.openNewTab} className={styles.warrantyLink}>
                                <span data-automation={link.dataAutomation}>{link.text}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

TermsAndConditions.displayName = "TermsAndConditions";

export default injectIntl(TermsAndConditions);
