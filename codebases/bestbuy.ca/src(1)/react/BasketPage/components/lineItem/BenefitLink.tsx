import { ChevronRight } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import ReduxBenefitLinkConnector from "../../../../containers/connectors/ReduxBenefitLinkConnector";
import messages from "./translations/messages";
export class BenefitLink extends React.Component {
    constructor() {
        super(...arguments);
        this.handleOnClick = () => {
            this.props.goToBenefitsPage(this.props.sku);
        };
    }
    render() {
        return (React.createElement("div", { className: "gsp-benefit" }, React.createElement("a", { className: "seeAllBenefitsLink", href: "javascript:void(0);", onClick: this.handleOnClick },
            this.props.intl.formatMessage(messages.GspItemBenefit),
            React.createElement("div", { className: "rightChevron" },
                React.createElement(ChevronRight, { color: "blue", viewBox: "0 0 32 32" })))));
    }
}
export default ReduxBenefitLinkConnector(injectIntl(BenefitLink));
//# sourceMappingURL=BenefitLink.js.map