import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import Link from "components/Link";
import * as styles from "./style.css";
import messages from "./translations/messages";
import CallUsCard from "./components/CallUsCard";
import SectionTitle from "components/SectionTitle";

interface Props {
    bbyBusinessUrl: string;
    bbyBusinessWorkFromHomeUrl: string;
}

const BusinessContactConfirmation = (props: InjectedIntlProps & Props) => {
    const {intl, bbyBusinessUrl, bbyBusinessWorkFromHomeUrl} = props;
    return (
        <>
            <SectionTitle className={styles.title}>
                <h1>{intl.formatMessage(messages.businessContactConfirmationTitle)}</h1>
            </SectionTitle>
            <p>{intl.formatMessage(messages.businessContactConfirmationDescription)}</p>
            <p>{intl.formatMessage(messages.businessContactConfirmationDetails)}</p>
            <ul>
                <li>
                    <Link href={bbyBusinessUrl} external targetSelf>
                        {intl.formatMessage(messages.businessContactConfirmationLink1)}
                    </Link>
                </li>
                <li>
                    <Link href={bbyBusinessWorkFromHomeUrl} external targetSelf>
                        {intl.formatMessage(messages.businessContactConfirmationLink2)}
                    </Link>
                </li>
            </ul>
            <CallUsCard intl={props.intl} className={styles.confirmationSpacing} />
        </>
    );
};
export default BusinessContactConfirmation;
