import * as React from "react";
import {FormattedMessage} from "react-intl";

import {classIf} from "utils/classname";

import * as styles from "./styles.css";

export const EligibilityResultContainer: React.FC<{
    hasNoBorderDescription: boolean;
    title: FormattedMessage.Props;
    paragraph: FormattedMessage.Props;
    paragraphValues?: any;
}> = ({hasNoBorderDescription, title, paragraph, paragraphValues, children}) => (
    <div className={styles.eligibilityResult} data-automation="eligibility-info-container">
        <h1 className={styles.title}>
            <FormattedMessage {...title} />
        </h1>
        <div
            className={classIf(
                styles.descriptionContainer,
                hasNoBorderDescription,
                styles.descriptionBorderedContainer,
            )}>
            <FormattedMessage {...paragraph} values={paragraphValues} />
        </div>
        {children}
    </div>
);
