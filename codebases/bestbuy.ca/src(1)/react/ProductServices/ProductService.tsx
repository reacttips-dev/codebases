import { Checkbox, Link, Loader, LoadingSkeleton, } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { formatPrice } from "../utilities/formatting";
import * as styles from "./style.css";
import messages from "./translations/messages";
const ProductService = ({ icon, title, description, shortTitle, type = React.createElement(FormattedMessage, Object.assign({}, messages.type)), selectable, price, intl, sku, benefits, benefitsLabel = React.createElement(FormattedMessage, Object.assign({}, messages.seeBenefits)), hideBenefits = true, selected: passedSelected = false, selectionLabel = intl.formatMessage(Object.assign({}, messages.serviceSelection)), addLabel = React.createElement(FormattedMessage, Object.assign({}, messages.addService)), removeLabel = React.createElement(FormattedMessage, Object.assign({}, messages.removeService)), hideLineItem, addOrRemoveMode = false, hideTitle = false, hideDescription = false, loading = false, onChange, }) => {
    const [benefitsOpen, setBenefitsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(passedSelected);
    const selectionRef = React.useRef(selected);
    React.useEffect(() => {
        selectionRef.current = selected;
    }, [selected]);
    React.useEffect(() => {
        if (passedSelected !== selectionRef.current) {
            setSelected(passedSelected);
        }
    }, [passedSelected]);
    const handleChange = React.useCallback(() => {
        setSelected((currentValue) => {
            onChange === null || onChange === void 0 ? void 0 : onChange(!currentValue, sku);
            return !currentValue;
        });
    }, [setSelected]);
    const wrappedIcon = typeof icon === "string" ? (React.createElement("img", { src: icon, alt: typeof title === "string" ? title : undefined })) : (icon);
    return (React.createElement(Loader, { loading: loading, loadingDisplay: React.createElement(LoadingSkeleton.ProductTile, null) },
        React.createElement("div", { className: [
                styles.serviceContainer,
                selectable && styles.selectable,
                selected !== passedSelected &&
                    addOrRemoveMode &&
                    selected &&
                    styles.serviceAdded,
                selectionRef.current !== selected &&
                    addOrRemoveMode &&
                    selectionRef.current &&
                    styles.serviceRemoved,
            ]
                .filter(Boolean)
                .join(" ") },
            icon && !selectable && (React.createElement("div", { className: styles.serviceIcon }, wrappedIcon)),
            ((!hideTitle && !hideDescription && !addOrRemoveMode) ||
                (addOrRemoveMode && !selected)) && (React.createElement("div", { className: styles.serviceContent },
                !hideTitle && (React.createElement("strong", { className: styles.serviceTitle }, title)),
                !hideDescription && description && (React.createElement("div", { className: styles.serviceDescription }, typeof description === "string" ? (React.createElement("div", { dangerouslySetInnerHTML: { __html: description } })) : (description))))),
            benefits && !hideBenefits && (React.createElement("div", { className: styles.benefitsContainer },
                React.createElement(Link, { onClick: (e) => {
                        e.preventDefault();
                        setBenefitsOpen((currentValue) => !currentValue);
                    }, href: "#", chevronType: benefitsOpen ? "up" : "down" }, benefitsLabel),
                React.createElement("div", { className: [styles.benefits, benefitsOpen && styles.open]
                        .filter(Boolean)
                        .join(" ") },
                    React.createElement("div", { className: styles.content }, typeof benefits === "string" ? (React.createElement("div", { dangerouslySetInnerHTML: { __html: benefits } })) : (benefits))))),
            selectable && (React.createElement(React.Fragment, null,
                !hideLineItem && (selected || !addOrRemoveMode) && (React.createElement("div", { className: styles.selectableSection },
                    icon && (React.createElement("div", { className: styles.serviceIcon }, wrappedIcon)),
                    React.createElement("div", { className: styles.selectionDetail },
                        React.createElement("div", { className: styles.details },
                            shortTitle && (React.createElement("h6", { className: styles.shortTitle }, shortTitle)),
                            type && React.createElement("span", { className: styles.type }, type)),
                        price && (React.createElement("div", { className: styles.price }, formatPrice(price, intl.locale)))))),
                React.createElement("div", { className: [
                        styles.selectContainer,
                        addOrRemoveMode && styles.addOrRemoveMode,
                    ]
                        .filter(Boolean)
                        .join(" ") }, addOrRemoveMode ? (React.createElement(Link, { className: styles.addOrRemove, onClick: (e) => {
                        e.preventDefault();
                        handleChange();
                    }, href: "#", chevronType: selected ? undefined : "right" }, selected ? removeLabel : addLabel)) : (React.createElement(Checkbox, { label: selectionLabel, name: sku, value: selected ? "checked" : "", handleAsyncChange: handleChange }))))))));
};
export default injectIntl(ProductService);
//# sourceMappingURL=ProductService.js.map