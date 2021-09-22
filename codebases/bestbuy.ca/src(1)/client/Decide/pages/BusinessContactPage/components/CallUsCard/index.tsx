import * as React from "react";
import Link from "components/Link";
import * as styles from "./style.css";
import {InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";

export interface Props {
    className?: string;
}

export default ({ intl, className= "" }: InjectedIntlProps & Props) => {
    return (
        <div className={className}>
            <p className={styles.title}>{intl.formatMessage(messages.callUsTitle)}</p>
            <p className={styles.noMargin}>{intl.formatMessage(messages.callUsSubtitle)}</p>
            <Link
                className={styles.helpLink}
                external href={`tel: ${intl.formatMessage(messages.callUsPhone)}`}
                targetSelf>
                    {intl.formatMessage(messages.callUsPhone)}
            </Link>
            <p className={styles.noMargin}>{intl.formatMessage(messages.callUsTime)}</p>
        </div>
    );
};
