import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import ReduxConnector from "../../../../containers/connectors/TermsAndConditionsMsgConnector";
import messages from "./translations/messages";
export class TermsAndConditionsMsg extends React.Component {
    constructor() {
        super(...arguments);
        this.onManuFacturersWarrantyClick = () => {
            this.props.goToManufacturersWarrantyPage(this.props.parentSku);
        };
        this.generateHelpTopicPath = () => {
            const { intl: { locale } } = this.props;
            const translations = {
                "en-CA": "help",
                "fr-CA": "aide",
            };
            return `/${locale}/${translations[locale]}`;
        };
    }
    render() {
        const legalWarrantyLink = `${this.generateHelpTopicPath()}/blt9dc31dabc18a0f99/blt9829bb6fbacda8f2`;
        const termsAndConditionsLink = `${this.generateHelpTopicPath()}/blt372c78db41358a01/blt612eaea73f4477ad`;
        return (React.createElement("div", { "data-automation": "terms-and-conditions-msg" },
            React.createElement(FormattedMessage, Object.assign({}, messages.termsAndConditionsMsg, { values: {
                    legalWarrantyLink: React.createElement("a", { href: legalWarrantyLink, target: "_blank", "data-automation": "legal-warranty-link" },
                        React.createElement(FormattedMessage, Object.assign({}, messages.quebecWarrantyLink))),
                    manufacturerWarrantyLink: React.createElement("a", { target: "_blank", href: "javascript:void(0);", "data-automation": "manufacturer-warranty-link", onClick: this.onManuFacturersWarrantyClick },
                        React.createElement(FormattedMessage, Object.assign({}, messages.manufacturerWarrantyLink))),
                    termsAndConditionsLink: React.createElement("a", { href: termsAndConditionsLink, target: "_blank", "data-automation": "terms-and-conditions-link" },
                        React.createElement(FormattedMessage, Object.assign({}, messages.termsAndConditionsLink))),
                } }))));
    }
}
export default ReduxConnector(injectIntl(TermsAndConditionsMsg));
//# sourceMappingURL=TermsAndConditionsMsg.js.map