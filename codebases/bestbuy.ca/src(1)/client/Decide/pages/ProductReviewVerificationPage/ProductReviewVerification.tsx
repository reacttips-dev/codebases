import * as React from "react";
import { FormattedMessage } from "react-intl";
import { ChevronRight } from "@bbyca/bbyca-components";
import { getHelpTopicsId } from "@bbyca/apex-components/dist/utils/helpTopics";
import { connect } from "react-redux";

import { State } from "store";
import Link from "components/Link";

import messages from "./translations/messages";
import { VerificationPlaceHolder } from "./VerificationPlaceHolder/VerificationPlaceHolder";
import * as styles from "./style.css";
import useRequestUserId, { UseRequestUserId } from "./useRequestUserId";

export interface StateProps {
    baseUrl: string;
    env: string;
    locale: Locale;
}

export interface OwnState {
    loading: boolean;
    isSuccessful: boolean;
}

const ProductVerificationWrapper: React.FC = ({ children }) => (
    <div className={`${styles.container} ${styles.reviewEmailVerificationContainer}`} data-automation="verification-page">
        {children}
    </div>
);

export const ProductReviewVerification: React.FC<StateProps> = ({
    env,
    baseUrl,
    locale,
}: StateProps) => {

    const { loading = true, isSuccessful }: UseRequestUserId = useRequestUserId(baseUrl, locale);
    if (loading) {
        return (
            <ProductVerificationWrapper>
                <VerificationPlaceHolder />
            </ProductVerificationWrapper>
        );
    }

    const config = getHelpTopicsId(env);
    const contactLink = <Link to="help" params={config.contactUs} ><FormattedMessage {...messages.contactContent} /></Link>;
    let verificationResult;

    if (isSuccessful) {
        // email approved
        verificationResult = (
            <div data-automation="review-verification">
                <h2 className={styles.thanksHeadline}><FormattedMessage {...messages.approvedHeadline} /></h2>
                <p><FormattedMessage {...messages.approvedParagraph} /></p>
                <Link
                    className={styles.startShoppingLink}
                    to="homepage"
                >
                    <FormattedMessage {...messages.startShoppingLink} />
                    <ChevronRight className={styles.rightArrowIcon} />
                </Link>
            </div>
        );
    } else {
        // email rejected
        verificationResult = (
            <div data-automation="verification-failed">
                <h2 className={styles.thanksHeadline}><FormattedMessage {...messages.rejectedHeadline} /></h2>
                <p><FormattedMessage {...messages.rejectedParagraph} /></p>
                <FormattedMessage {...messages.failLink} values={{ contact: contactLink }} />
            </div>
        );
    }

    return (
        <ProductVerificationWrapper>
            { verificationResult }
        </ProductVerificationWrapper>
    );
};

const mapStateToProps = (state: State) => ({
    baseUrl: state.config.dataSources.reviewApiUrl,
    env: state.app.environment.nodeEnv,
    locale: state.intl.locale,
});

export default connect<StateProps>(mapStateToProps)(ProductReviewVerification);
