var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class ManufacturersWarrantyPage extends React.Component {
    constructor() {
        super(...arguments);
        this.LoadingDisplay = () => (React.createElement(React.Fragment, null,
            React.createElement(LoadingSkeleton.Title, { maxWidth: 200 }),
            React.createElement(LoadingSkeleton.Title, { maxWidth: 200 })));
        this.renderPartsAndLabour = () => {
            const { intl: { formatMessage } } = this.props;
            return this.hasManufacturerWarranty() ?
                React.createElement("div", null,
                    this.renderParts(),
                    this.renderLabour()) :
                formatMessage(messages.noWarranty);
        };
        this.hasManufacturerWarranty = () => {
            const { manufacturerWarranty: { labourInDays, partsInDays } } = this.props;
            return labourInDays > 0 || partsInDays > 0;
        };
        this.renderLabour = () => {
            const { intl: { formatMessage }, manufacturerWarranty: { labourInDays }, } = this.props;
            if (labourInDays > 0) {
                return (React.createElement("div", null, `${formatMessage(messages.labourLabel)} ${this.generateDurationCopy(labourInDays)}`));
            }
            else {
                return null;
            }
        };
        this.renderParts = () => {
            const { intl: { formatMessage }, manufacturerWarranty: { partsInDays }, } = this.props;
            if (partsInDays > 0) {
                return (React.createElement("div", null, `${formatMessage(messages.partsLabel)} ${this.generateDurationCopy(partsInDays)}`));
            }
            else {
                return null;
            }
        };
        this.generateDurationCopy = (days) => {
            const { intl: { formatMessage } } = this.props;
            if (days >= 365) {
                const years = this.convertDaysToYears(days);
                return formatMessage(messages.years, { numOfYears: years });
            }
            else {
                return formatMessage(messages.days, { numOfDays: days });
            }
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.props.retrieveManufacturerWarranty();
        });
    }
    render() {
        const { intl: { formatMessage }, hasFetchingManufacturerWarrantyFailed, isFetchingManufacturerWarranty, } = this.props;
        return (React.createElement("div", { className: styles.manufacturersWarrantyPage, "data-automation": "manufacturers-warranty-page" },
            React.createElement("div", { className: styles.contentContainer },
                React.createElement("h1", null, formatMessage(messages.header)),
                React.createElement(Loader, { loading: isFetchingManufacturerWarranty, loadingDisplay: this.LoadingDisplay() }, hasFetchingManufacturerWarrantyFailed ?
                    React.createElement("div", null, formatMessage(messages.fallback)) :
                    this.renderPartsAndLabour()))));
    }
    convertDaysToYears(days) {
        return Math.round(10 * (days / 365)) / 10;
    }
}
export default injectIntl(ManufacturersWarrantyPage);
//# sourceMappingURL=ManufacturersWarrantyPage.js.map