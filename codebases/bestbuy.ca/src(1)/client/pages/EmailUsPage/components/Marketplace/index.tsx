import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import messages from "./translations/messages";
import * as styles from "./style.css";
import {Link} from "@bbyca/bbyca-components";

export interface MarketplaceProps {
    ordersWebAppUrl: string;
}
export const Marketplace: React.FC<InjectedIntlProps & MarketplaceProps> = (props) => {
    const urlLocale = props.intl.locale.toLowerCase();
    const param = props.intl.formatMessage(messages.findOrderUrlParam);
    const findOrderProps = {
        href: `${props.ordersWebAppUrl}${urlLocale}/${param}`,
        targetSelf: false,
    };
    const findOrderLink = <Link {...findOrderProps}>{props.intl.formatMessage(messages.findOrder)}</Link>;
    return (
        <div className={styles.marketplace}>
            <p>
                <FormattedMessage {...messages.paragraphHeader} values={{findOrder: findOrderLink}} />
            </p>
            <h3>
                <FormattedMessage {...messages.mainHeader} />
            </h3>
            <p>
                <FormattedMessage {...messages.mainParagraph} values={{findOrder: findOrderLink}} />
            </p>
        </div>
    );
};

export default injectIntl(Marketplace);
