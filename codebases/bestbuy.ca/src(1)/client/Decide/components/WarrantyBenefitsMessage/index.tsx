import * as React from "react";
import {injectIntl, InjectedIntlProps, FormattedMessage} from "react-intl";

import {classname} from "utils/classname";
import {WarrantyType} from "models";

import messages from "./translations/messages";
import * as styles from "./styles.css";

interface WarrantyBenefitsMessageProps {
    warrantyType: WarrantyType;
    content?: {
        title?: string;
        body?: string;
    };
    className?: string;
    warrantyTermsAndConditionUrl?: string;
}

const DEFAULT_MSG: {
    [key: string]: {
        title: FormattedMessage.MessageDescriptor;
        body: FormattedMessage.MessageDescriptor;
    };
} = {
    [WarrantyType.PSP]: {
        title: messages.pspTitle,
        body: messages.pspBody,
    },
    [WarrantyType.PRP]: {
        title: messages.prpTitle,
        body: messages.prpBody,
    },
};

const VALID_WARRANTIES = [WarrantyType.PSP, WarrantyType.PRP];

export const WarrantyBenefitsMessage: React.FC<WarrantyBenefitsMessageProps & InjectedIntlProps> = ({
    warrantyType,
    content,
    intl,
    warrantyTermsAndConditionUrl,
    className = "",
}) => {
    if (!VALID_WARRANTIES.includes(warrantyType)) {
        return null;
    }

    const defaultTitle = DEFAULT_MSG[warrantyType].title;
    const defaultBody = DEFAULT_MSG[warrantyType].body;

    let messageTitle: React.ReactNode = <FormattedMessage {...defaultTitle} values={{obsOneFirst: <sup>1</sup>}} />;
    let messageBody = (
        <FormattedMessage
            {...defaultBody}
            values={{
                obsOneFirst: <sup>1</sup>,
                obsOneContent: (
                    <>
                        <br />
                        <br />
                        <sup>1</sup>
                    </>
                ),
                link: (
                    <a href={warrantyTermsAndConditionUrl} target="_blank">
                        {intl.formatMessage(messages.termsLinkText)}
                    </a>
                ),
                geekSquadProtectionLink: (
                    <a href={intl.formatMessage(messages.geekSquadProtectionLink)} target="_blank">
                        geeksquad.ca/protection
                    </a>
                ),
            }}
        />
    );

    // checks for existence of title to determine if data came from Content API or Product API
    // since Content API returns non-customer facing data in the title field, title was removed upstream from this component
    // This can be refactored when we remove support for Product API
    const hasNoTitle = content && content.body && !content.title;

    if (content && content.body) {
        messageTitle = content.title;
        messageBody = <div dangerouslySetInnerHTML={{__html: content.body}}></div>;
    }

    return (
        <div className={classname([styles.container, className])}>
            {!hasNoTitle && <p className={styles.title}>{messageTitle}</p>}
            {messageBody && <div>{messageBody}</div>}
        </div>
    );
};

export default injectIntl(WarrantyBenefitsMessage);
