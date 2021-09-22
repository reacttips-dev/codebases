import * as React from "react";
import { injectIntl } from "react-intl";
import { ServicePlanType } from "../../business-rules/entities";
import ServiceBenefits from "./ServiceBenefits";
import messages from "./translations/messages";
const GrpServiceBenefitHeader = ({ intl: { formatMessage } }) => {
    return (React.createElement("h1", null, formatMessage(messages.grpBenefitTitle)));
};
const GrpServiceBenefitFallbackMessage = ({ intl: { formatMessage } }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("p", null, formatMessage(messages.grpFallbackBenefitMessage)),
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement("p", null, formatMessage(messages.grpFallbackBenefitMessageLine1))),
            React.createElement("li", null,
                React.createElement("p", null, formatMessage(messages.grpFallbackBenefitMessageLine2))),
            React.createElement("li", null,
                React.createElement("p", null, formatMessage(messages.grpFallbackBenefitMessageLine3))),
            React.createElement("li", null,
                React.createElement("p", null, formatMessage(messages.grpFallbackBenefitMessageLine4))))));
};
const GspServiceBenefitHeader = ({ intl: { formatMessage } }) => {
    return (React.createElement("h1", null, formatMessage(messages.gspBenefitTitle)));
};
const GspServiceBenefitFallbackMessage = ({ intl: { formatMessage } }) => {
    return (React.createElement("p", null, formatMessage(messages.gspFallbackBenefitMessage)));
};
export class BenefitPage extends React.Component {
    render() {
        const { servicePlanType } = this.props;
        if (servicePlanType === ServicePlanType.PRP) {
            return (React.createElement(ServiceBenefits, Object.assign({}, this.props, { header: GrpServiceBenefitHeader(this.props), fallbackMessage: GrpServiceBenefitFallbackMessage(this.props) })));
        }
        return (React.createElement(ServiceBenefits, Object.assign({}, this.props, { header: GspServiceBenefitHeader(this.props), fallbackMessage: GspServiceBenefitFallbackMessage(this.props) })));
    }
}
export default injectIntl(BenefitPage);
//# sourceMappingURL=BenefitPage.js.map