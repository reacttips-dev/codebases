import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {Button, GlobalErrorMessage, Car, Store} from "@bbyca/bbyca-components";
import {FormattedMessage, injectIntl} from "react-intl";

import AvailabilityIcon from "components/ProductAvailability/components/AvailabilityIcon";
import {PickupStore, StoreStatuses, RetailStoreStatus, StoreBasicInfo} from "models";
import {classname} from "utils/classname";
import {RpuPickUpLinks} from "config";

import StoreHoursTable, {StoreHoursTableProps} from "../StoreHoursTable";
import getStoreCurbsideHours from "../../utils/getStoreCurbsideHours";
import messages from "./translations/messages";
import * as styles from "../../style.css";

export interface StoreListProps extends StoreHoursTableProps {
    rpuUrl: RpuPickUpLinks;
    storesStatus: RetailStoreStatus;
    store: PickupStore;
    language: Language;
    screenSize: ScreenSize;
    storeLocatorUrl: string;
    onReserveButtonClicked: () => void;
    quickAndEasyPickupHelpUrl: string;
    storeMessage?: string;
}

const hasCurbsidePickup = (storesStatus: RetailStoreStatus, currentStoreStatus: StoreStatuses): boolean => {
    const curbSideIconArray = [StoreStatuses.ppu_curbside_pickup];
    return curbSideIconArray.indexOf(currentStoreStatus) > -1;
};

const hasInStorePickup = (storesStatus: RetailStoreStatus, currentStoreStatus: StoreStatuses): boolean => {
    const inStoreIconArray = [
        StoreStatuses.open,
        StoreStatuses.ppu_instore_pickup,
        StoreStatuses.ppu_curbside_pickup,
        StoreStatuses.open_reduced_hours,
    ];
    return inStoreIconArray.indexOf(currentStoreStatus) > -1;
};

const getStoreStatus = (storesStatus: RetailStoreStatus, store: PickupStore): StoreStatuses => {
    const storeInfo: StoreBasicInfo = getStoreStatusById(storesStatus, store);
    return storeInfo && storeInfo.status;
};

const getStoreOpeningHoursOffset = (storesStatus: RetailStoreStatus, store: PickupStore): number => {
    const storeInfo: StoreBasicInfo = getStoreStatusById(storesStatus, store);
    return (storeInfo && storeInfo.pickupOpeningHoursOffset) || 0;
};

const getStoreClosingHoursOffset = (storesStatus: RetailStoreStatus, store: PickupStore): number => {
    const storeInfo: StoreBasicInfo = getStoreStatusById(storesStatus, store);
    return (storeInfo && storeInfo.pickupClosingHoursOffset) || 0;
};

const getStoreStatusById = (storesStatus: RetailStoreStatus, store: PickupStore): StoreBasicInfo => {
    return storesStatus && storesStatus.statuses && storesStatus.statuses[store.locationId];
};

const renderStoreStatusMessage = ({
    storesStatus,
    store,
}: {
    storesStatus: RetailStoreStatus;
    store: PickupStore;
}): null | React.ReactNode => {
    const {locationId, postalCode} = store;
    const status = getStoreStatus(storesStatus, store);
    const isCurbsidePickup = hasCurbsidePickup(storesStatus, status);
    const isInStorePickup = hasInStorePickup(storesStatus, status);

    const affectedStores = storesStatus.statuses;

    const storeStatus =
        affectedStores &&
        affectedStores[locationId] &&
        affectedStores[locationId].postalCode === postalCode &&
        affectedStores[locationId].status;

    if (
        storeStatus !== StoreStatuses.open &&
        storeStatus !== StoreStatuses.open_reduced_hours &&
        storeStatus !== StoreStatuses.ppu_curbside_pickup &&
        storeStatus !== StoreStatuses.ppu_instore_pickup &&
        storeStatus !== StoreStatuses.closed
    ) {
        return null;
    }

    const inStoreMessage = () => {
        if (!isInStorePickup) {
            return null;
        }
        return (
            <div className={styles.inStoreStatus}>
                <Store className={styles.iconStyle} />
                <p className={styles.iconMessaging}>
                    <FormattedMessage {...messages.InStorePickUpInStore} />
                </p>
            </div>
        );
    };

    const curbsideMessage = () => {
        if (!isCurbsidePickup) {
            return null;
        }
        return (
            <div className={styles.curbSideStatus}>
                <Car className={styles.iconStyle} />
                <p className={styles.iconMessaging}>
                    <FormattedMessage {...messages.CurbsidePickUpInStore} />
                </p>
            </div>
        );
    };

    return (
        <div className={styles.storeStatusContainer}>
            {inStoreMessage()}
            {curbsideMessage()}
        </div>
    );
};

export const StoresListItem = (props: StoreListProps) => {
    const {screenSize, store, storeLocatorUrl, storeMessage, language, storesStatus} = props;
    const status = getStoreStatus(storesStatus, store);
    const openOffset = getStoreOpeningHoursOffset(storesStatus, store);
    const closeOffset = getStoreClosingHoursOffset(storesStatus, store);
    const hasCurbside = hasCurbsidePickup(storesStatus, status);
    const hasInStore = hasInStorePickup(storesStatus, status);

    const hasOnlyInStorePickup = !hasCurbside && hasInStore;

    const locationInStockMessage = store.hasInventory
        ? messages.UpdateLocationInStock
        : messages.UpdateLocationOutOfStock;

    let storeHoursHeader = <FormattedMessage {...messages.StoreHours} />;

    if (status) {
        if (hasOnlyInStorePickup) {
            storeHoursHeader = <FormattedMessage {...messages.inStorePickupOnlyHeader} />;
        } else if (!hasOnlyInStorePickup) {
            storeHoursHeader = <FormattedMessage {...messages.pickupHoursHeader} />;
        }
    }

    const getCta = (className: string) => {
        return (
            <div className={classname([styles.cta, className])}>
                <div className={styles.inStockStatus}>
                    <AvailabilityIcon purchasable={store.hasInventory} className={styles.iconStyle} />
                    <p className={styles.availabilityMessage}>
                        <FormattedMessage {...locationInStockMessage} />
                    </p>
                </div>
                {store.hasInventory && (
                    <Button
                        appearance="secondary"
                        type="submit"
                        onClick={props.onReserveButtonClicked}
                        data-automation="pick-up-here-submit"
                        className={styles.storeListItemReserveButton}
                        size={screenSize.lessThan.medium ? "large" : "small"}>
                        <FormattedMessage {...messages.ReserveButton} />
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className={styles.storeListItem}>
            <a href={storeLocatorUrl} target="_blank" className={styles.name} data-automation="store-name">
                <h4>{store.name}</h4>
            </a>
            {storeMessage && (
                <div className={styles.emergencyMessageContainer}>
                    <GlobalErrorMessage>{storeMessage}</GlobalErrorMessage>
                </div>
            )}
            <div className={styles.details}>
                <div className={styles.address}>
                    <p className={styles.storeInformationHeader}>
                        <FormattedMessage {...messages.Address} />
                    </p>
                    <p>{store.address}</p>
                    <p>{`${store.city}, ${store.region}, ${store.postalCode}`}</p>
                    <p>{store.phoneNumber}</p>
                </div>

                <div className={styles.offers}>
                    <p className={styles.storeInformationHeader}>
                        <FormattedMessage {...messages.ThisStoreOffers} />
                    </p>
                    {!!props.storesStatus && renderStoreStatusMessage({store, storesStatus})}
                </div>
                {getCta(styles.ctaDesktop)}
                <div className={styles.break} />
                <div className={styles.hours}>
                    <StoreHoursTable
                        header={storeHoursHeader}
                        className={styles.storeHoursTable}
                        hours={getStoreCurbsideHours({
                            lang: language,
                            storeHours: store.hours,
                            storeOffsets: {
                                openOffset,
                                closeOffset,
                            },
                        })}
                    />
                </div>
            </div>
            {getCta(styles.ctaMobile)}
        </div>
    );
};

export default injectIntl(StoresListItem);
