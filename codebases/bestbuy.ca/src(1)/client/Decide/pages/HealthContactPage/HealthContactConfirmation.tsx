import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import Link from "components/Link";
import * as styles from "./style.css";
import messages from "./translations/messages";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";

interface Props {
    bbyHealthUrl: string;
    assuredLivingUrl: string;
    bbyHealthBlogUrl: string;
}

const HealthContactConfirmation = (props: InjectedIntlProps & Props) => {
    const {intl, bbyHealthUrl, assuredLivingUrl, bbyHealthBlogUrl} = props;
    return (
        <div className={styles.fullHeight}>
            <SectionTitle appearance={TitleAppearance.d1} className={styles.sectionTitle}>
                <h1>{intl.formatMessage(messages.healthContactConfirmationTitle)}</h1>
            </SectionTitle>
            <p>{intl.formatMessage(messages.healthContactConfirmationDescription)}</p>
            <p>{intl.formatMessage(messages.healthContactConfirmationDetails)}</p>
            <ul>
                <li>
                    <Link href={bbyHealthUrl} external targetSelf>
                        {intl.formatMessage(messages.bbyHealthPage)}
                    </Link>
                </li>
                <li>
                    <Link href={assuredLivingUrl} external targetSelf>
                        {intl.formatMessage(messages.assuredLivingPage)}
                    </Link>
                </li>
                {intl.locale === "en-CA" && (
                    <li>
                        <Link href={bbyHealthBlogUrl} external targetSelf>
                            {intl.formatMessage(messages.bbyHealthBlog)}
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};
export default HealthContactConfirmation;
