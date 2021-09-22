var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Checkbox, GeekSquad, Loader, LoadingSkeleton, RadioButton, } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { scroller } from "react-scroll";
import { ServicePlanType, } from "../../../../business-rules/entities";
import ReduxConnector from "../../../../containers/connectors/ServicePlanProviderConnector";
import { formatPrice } from "../../../utilities/formatting";
import BenefitLink from "./BenefitLink";
import "./styles.css";
import TermsAndConditionsMsg from "./TermsAndConditionsMsg";
import messages from "./translations/messages";
export class ServicePlanItems extends React.Component {
    constructor(props) {
        super(props);
        this.getWarrantyCopy = () => {
            const { planType, intl: { formatMessage } } = this.props;
            switch (planType) {
                case ServicePlanType.PSP:
                    return {
                        hook: formatMessage(messages.GspItemHook),
                        productHeader: formatMessage(messages.GspItemProductHeader),
                    };
                case ServicePlanType.PRP:
                    return {
                        hook: formatMessage(messages.GrpItemHook),
                        productHeader: formatMessage(messages.GrpItemProductHeader),
                    };
            }
        };
        this.setSelectedOptionToPrevious = () => {
            this.setState(Object.assign(Object.assign({}, this.state), { selectedOption: this.props.selectedPlan }));
        };
        this.selectedServicePlanInfo = () => {
            const { selectedPlan } = this.props;
            const { productHeader } = this.getWarrantyCopy();
            return (React.createElement(Loader, { loading: this.state.isLoading, loadingDisplay: React.createElement(LoadingSkeleton.Title, null) },
                React.createElement("div", { className: "gsp-info" },
                    React.createElement("div", { className: "gsp-name" },
                        React.createElement(GeekSquad, { className: "geek-squad-icon", viewBox: "0 8 48 48" }),
                        React.createElement("p", null,
                            productHeader,
                            " - ",
                            this.servicePlanName(selectedPlan))),
                    React.createElement("p", { className: "gsp-price" }, this.servicePlanPrice(selectedPlan)))));
        };
        this.servicePlanName = (id) => {
            const { intl: { formatMessage } } = this.props;
            const plan = this.props.plans.find(({ sku }) => sku === id);
            if (!plan || !plan.termMonths) {
                return formatMessage(messages.noPlan);
            }
            const numOfYears = plan.termMonths / 12;
            return `${numOfYears} ${formatMessage(messages.year, { numOfYears })}`;
        };
        this.servicePlanPrice = (id) => {
            const { intl: { locale } } = this.props;
            const plan = this.props.plans.find(({ sku }) => sku === id);
            if (!plan || !plan.termMonths) {
                return formatPrice(0, locale);
            }
            return formatPrice(plan.purchasePrice, locale);
        };
        this.servicePlanOption = (item) => {
            const { intl: { locale } } = this.props;
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "label" }, this.servicePlanName(item.sku)),
                React.createElement("div", { className: "price" }, formatPrice(item.purchasePrice, locale))));
        };
        this.onServicePlanChange = (sku) => __awaiter(this, void 0, void 0, function* () {
            this.setState(Object.assign(Object.assign({}, this.state), { isLoading: true, isServicePlanAccepted: false, isShowServicePlanAcceptWarning: false, selectedOption: sku }));
            this.props.onServicePlanAcceptChange(false);
            if (sku && sku !== "") {
                yield this.props.onAdd(sku);
            }
            else {
                yield this.props.onRemove();
            }
            this.setState(Object.assign(Object.assign({}, this.state), { isLoading: false }));
        });
        this.renderTermsAndConditionsAcceptCheckbox = () => {
            return (React.createElement(Checkbox, { name: "accepted", label: "", handleAsyncChange: this.onAcceptChange, value: this.state.isServicePlanAccepted ? "checked" : "", error: !this.state.isServicePlanAccepted && this.state.isShowServicePlanAcceptWarning }));
        };
        this.onAcceptChange = (ignored, inputValue) => {
            const isServicePlanAccepted = !!inputValue.length;
            this.setState(Object.assign(Object.assign({}, this.state), { isServicePlanAccepted }));
            this.props.onServicePlanAcceptChange(isServicePlanAccepted);
        };
        this.state = {
            isLoading: false,
            isServicePlanAccepted: false,
            isShowServicePlanAcceptWarning: false,
            selectedOption: this.props.selectedPlan,
        };
    }
    componentDidUpdate(prevProps) {
        const apiErrorJustOccurred = prevProps.apiErrorOccurred !== this.props.apiErrorOccurred
            && this.props.apiErrorOccurred === true;
        if (apiErrorJustOccurred) {
            this.setSelectedOptionToPrevious();
        }
        if (this.props.lineItemIDsWithNoWarrantyAccepted !== prevProps.lineItemIDsWithNoWarrantyAccepted) {
            const isShowServicePlanAcceptWarning = this.props.lineItemIDsWithNoWarrantyAccepted
                .indexOf(this.props.parentLineItemId) !== -1;
            this.setState(Object.assign(Object.assign({}, this.state), { isShowServicePlanAcceptWarning }));
            if ([].concat(this.props.lineItemIDsWithNoWarrantyAccepted)[0] === this.props.parentLineItemId) {
                scroller.scrollTo(`service-plan-items-${this.props.parentLineItemId}`, {
                    delay: 100,
                    duration: 1000,
                    smooth: true,
                });
            }
        }
    }
    render() {
        const { features, planType, plans, intl: { formatMessage }, parentLineItemId, selectedPlan, goToBenefitsPage, goToManufacturersWarrantyPage, } = this.props;
        if (planType === ServicePlanType.PRP && !features.grpInCart) {
            return null;
        }
        if (plans.length < 1) {
            return null;
        }
        const plansWithNonePlan = [ServicePlanItems.NonePlan, ...plans];
        const { hook } = this.getWarrantyCopy();
        return (React.createElement("section", { className: "service-plans", "data-automation": "gsp-items", id: `service-plan-items-${this.props.parentLineItemId}` },
            React.createElement("header", null, formatMessage(messages.GspItemTitle)),
            this.selectedServicePlanInfo(),
            React.createElement("p", { className: "gsp-description" }, hook),
            React.createElement(BenefitLink, { lineItemId: this.props.parentLineItemId, goToBenefitsPage: goToBenefitsPage }),
            React.createElement("div", { className: "service-plans-options" }, plansWithNonePlan.map((item, i) => {
                return (React.createElement(RadioButton, { className: "service-plans-option", disabled: this.state.isLoading, hideCheckmark: true, key: item.sku, label: this.servicePlanOption(item), name: parentLineItemId, onChange: this.onServicePlanChange, selectedValue: item.sku, value: this.state.selectedOption }));
            })),
            selectedPlan && React.createElement(React.Fragment, null,
                React.createElement("div", { className: "terms-and-conditions-warning" + ((!this.state.isServicePlanAccepted && this.state.isShowServicePlanAcceptWarning) ?
                        " terms-and-conditions-warning-displayed" : "") },
                    React.createElement("p", null, formatMessage(messages.warnAcceptWarranty))),
                React.createElement("div", { className: "terms-and-conditions" },
                    this.renderTermsAndConditionsAcceptCheckbox(),
                    React.createElement(TermsAndConditionsMsg, { parentLineItemId: parentLineItemId, goToManufacturersWarrantyPage: goToManufacturersWarrantyPage })))));
    }
}
ServicePlanItems.NonePlan = {
    name: "",
    purchasePrice: 0,
    sku: "",
    termMonths: 0,
};
export default ReduxConnector(injectIntl(ServicePlanItems));
//# sourceMappingURL=ServicePlanItems.js.map