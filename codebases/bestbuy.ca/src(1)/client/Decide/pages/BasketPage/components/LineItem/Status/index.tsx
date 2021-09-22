import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {GlobalErrorMessage, GlobalInfoMessage} from "@bbyca/bbyca-components";

import {AvailabilityShippingStatus, Region} from "models";

import messages from "./translations/messages";

interface StatusProps {
    shippingStatus: AvailabilityShippingStatus;
    currentRegion: Region;
}

const typeError = [
    AvailabilityShippingStatus.SoldOutOnline,
    AvailabilityShippingStatus.RegionRestricted,
    AvailabilityShippingStatus.OutofStockInRegion,
];

export const Status: React.FC<StatusProps & InjectedIntlProps> = ({shippingStatus, currentRegion, intl}) => {
    let title = "";
    let details = "";

    switch (shippingStatus) {
        case AvailabilityShippingStatus.SoldOutOnline:
            title = intl.formatMessage(messages.SoldOutOnline);
            break;
        case AvailabilityShippingStatus.OutofStockInRegion:
            title = intl.formatMessage(messages.OutofStockInRegion, {currentRegion});
            details = intl.formatMessage(messages.OutofStockInRegionDescription);
            break;
        case AvailabilityShippingStatus.RegionRestricted:
            title = intl.formatMessage(messages.RegionRestricted, {currentRegion});
            details = intl.formatMessage(messages.RegionRestrictedDescription);
            break;
        case AvailabilityShippingStatus.Preorder:
            title = intl.formatMessage(messages.Preorder);
            break;
        case AvailabilityShippingStatus.BackOrder:
            title = intl.formatMessage(messages.BackOrder);
            break;
        case AvailabilityShippingStatus.ComingSoon:
            title = intl.formatMessage(messages.ComingSoon);
            break;
        case AvailabilityShippingStatus.NotAvailable:
            title = intl.formatMessage(messages.NotAvailable);
            break;
        case AvailabilityShippingStatus.Unknown:
            title = intl.formatMessage(messages.Unknown);
            break;
        default:
            return null;
    }

    return (
        <>
            {typeError.includes(shippingStatus) ? (
                <GlobalErrorMessage message={title}>{details}</GlobalErrorMessage>
            ) : (
                <GlobalInfoMessage message={title}>{details}</GlobalInfoMessage>
            )}
        </>
    );
};

export default injectIntl(Status);
