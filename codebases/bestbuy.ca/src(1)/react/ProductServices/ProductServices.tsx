import { HaulAway } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import ProductService from "./ProductService";
import * as styles from "./style.css";
import messages from "./translations/messages";
const predefinedServices = {
    "appliance-recycling": {
        addLabel: React.createElement(FormattedMessage, Object.assign({}, messages.addHaulAwayService)),
        benefits: React.createElement(FormattedMessage, Object.assign({}, messages.haulAwayBenefits)),
        description: React.createElement(FormattedMessage, Object.assign({}, messages.haulAwayDescription)),
        icon: React.createElement(HaulAway, { className: styles.haulAwayIcon }),
        selectionLabel: messages.takeMyOldAppliance,
        shortTitle: React.createElement(FormattedMessage, Object.assign({}, messages.haulAwayShortTitle)),
        title: React.createElement(FormattedMessage, Object.assign({}, messages.haulAwayTitle)),
        type: React.createElement(FormattedMessage, Object.assign({}, messages.haulAwayType)),
    },
};
const ProductServices = ({ services, selectable, selectedServices: passedSelectedServices = [], hideBenefits = true, hideLineItems, addOrRemoveMode = false, intl, onChange, }) => {
    const selectedServices = React.useRef(passedSelectedServices);
    const handleChange = React.useCallback((selected, sku) => {
        if (selected) {
            selectedServices.current = [...selectedServices.current, sku];
        }
        else {
            selectedServices.current = selectedServices.current.filter((item) => item !== sku);
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(selectedServices.current);
    }, []);
    const serviceItems = services === null || services === void 0 ? void 0 : services.map((service) => {
        const mappedService = predefinedServices[service.type];
        const selected = passedSelectedServices.indexOf(service.sku) !== -1;
        return (React.createElement(ProductService, { key: service.sku || service.id, selectable: selectable, icon: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.icon) || (service === null || service === void 0 ? void 0 : service.icon), title: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.title) || service.title, description: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.description) || service.description, shortTitle: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.shortTitle) || (mappedService === null || mappedService === void 0 ? void 0 : mappedService.title) || (service === null || service === void 0 ? void 0 : service.shortTitle) ||
                service.title, type: mappedService === null || mappedService === void 0 ? void 0 : mappedService.type, benefits: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.benefits) || (service === null || service === void 0 ? void 0 : service.benefits), price: service.regularPrice, sku: service.sku, hideBenefits: hideBenefits, hideLineItem: hideLineItems, addOrRemoveMode: addOrRemoveMode, addLabel: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.addLabel) || (service === null || service === void 0 ? void 0 : service.addLabel), removeLabel: mappedService === null || mappedService === void 0 ? void 0 : mappedService.removeLabel, selected: selected, onChange: handleChange, loading: service.loading, selectionLabel: (mappedService === null || mappedService === void 0 ? void 0 : mappedService.selectionLabel) ? intl.formatMessage(Object.assign({}, mappedService.selectionLabel))
                : service === null || service === void 0 ? void 0 : service.selectionLabel }));
    });
    return (serviceItems === null || serviceItems === void 0 ? void 0 : serviceItems.length) ? (React.createElement("div", { className: styles.servicesContainer }, serviceItems)) : null;
};
export default injectIntl(ProductServices);
//# sourceMappingURL=ProductServices.js.map