import { GeekSquadOrange, Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import * as React from "react";
import * as styles from "./styles.css";
export class ServiceBenefits extends React.Component {
    constructor() {
        super(...arguments);
        this.renderBenefitsInfo = (info) => {
            return (React.createElement("div", null,
                React.createElement("h2", { "data-automation": "benefits-title" }, info.title),
                React.createElement("ul", { className: styles.benefits, "data-automation": "benefits-list" }, this.renderBenefitDescriptions(info.messages))));
        };
        this.renderBenefitDescriptions = (benefits) => {
            return benefits.map((benefit, i) => React.createElement("li", { "data-automation": "benefit", key: `key${i}` },
                " ",
                benefit));
        };
        this.renderFallback = () => {
            return (React.createElement("div", { className: styles.fallbackBenefit, "data-automation": "fallback-benefit" }, this.props.fallbackMessage));
        };
        this.LoadingDisplay = () => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles.benefitItemsLoader, "data-automation": "benefit-item-loader" },
                React.createElement("h1", null,
                    React.createElement(LoadingSkeleton.Title, { width: 500 })),
                React.createElement(LoadingSkeleton.Thumb, { width: 50 }),
                React.createElement(LoadingSkeleton.Title, { maxWidth: 350 }),
                React.createElement(LoadingSkeleton.Title, { maxWidth: 350 }))));
    }
    componentDidMount() {
        this.props.retrieveBenefits();
    }
    render() {
        const { benefits, isLoadingBenefits, header, } = this.props;
        const benefitsInfo = benefits && benefits[0];
        const isValidInfo = benefitsInfo && benefitsInfo.title && benefitsInfo.messages.length > 0;
        return (React.createElement("div", { className: styles.benefitPage, "data-automation": "benefits-page" },
            React.createElement("div", { className: styles.contentContainer },
                React.createElement(Loader, { loading: isLoadingBenefits, loadingDisplay: this.LoadingDisplay() },
                    header,
                    React.createElement("div", { className: styles.geekSquadLogo },
                        React.createElement(GeekSquadOrange, { className: styles.geekSquadSvg, viewBox: "0 0 80 49" })),
                    isValidInfo ? this.renderBenefitsInfo(benefitsInfo) : this.renderFallback()))));
    }
}
export default ServiceBenefits;
//# sourceMappingURL=ServiceBenefits.js.map