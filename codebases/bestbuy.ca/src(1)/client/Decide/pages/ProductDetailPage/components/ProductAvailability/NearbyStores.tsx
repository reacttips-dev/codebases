import {FormattedMessage} from "react-intl";
import * as React from "react";

import {tracker} from "@bbyca/ecomm-utilities";
import {Col, Row} from "@bbyca/ecomm-components";
import {Key} from "@bbyca/apex-components";

import Link from "components/Link";
import AvailabilityIcon from "components/ProductAvailability/components/AvailabilityIcon";
import {AvailabilityReduxStore, PickupStore} from "models";

import * as styles from "./style.css";
import messages from "./translations/messages";
import LowInventory from "./LowInventory";
import {getNumToFixed} from "utils/numberUtils";

export interface NearbyStoresProps {
    stores: PickupStore[];
    updateStores?: () => void;
    locale: string;
    storeLocatorUrl: string;
    sku?: string;
    seoText?: string;
    onReserveButtonClick: (storeId: string, positionNumber: number) => Promise<void>;
    availability: AvailabilityReduxStore;
    showLowInventory: boolean;
}

export const NUMBER_OF_STORES_TO_SHOW = 3;
const COL_SIZE_STORE_NAME_WITH_ICON = 12;
const COL_SIZE_STORE_RESERVE_LINK = 10;

const renderFirstThreeStores = (
    stores: PickupStore[],
    storeLocatorUrl: string,
    locale: string,
    onReserveButtonClick: (storeId: string, positionNumber: number) => Promise<void>,
    showLowInventory: boolean
): JSX.Element[] | null => {
    if (!storeLocatorUrl || !locale) {
        return null;
    }

    const firstStores = stores.slice(0, NUMBER_OF_STORES_TO_SHOW);

    if (!firstStores) {
        return null;
    }

    const getStoreDistance = ({distance}) => {
        return distance ? <FormattedMessage {...messages.distanceToAStore} values={{ distance: getNumToFixed(distance, 1) }} /> : null;
    };

    return firstStores.map((store: PickupStore, index: number) => (
        <Row className={styles.fluidRow} key={index}>
            <Col xs={COL_SIZE_STORE_NAME_WITH_ICON}>
                <AvailabilityIcon purchasable={store.hasInventory} className={styles.storeListIcons} />
                <span data-automation="pickup-store-list-item-store-name" className={styles.storeName}>
                    {store.name}
                </span>
                <span className={styles.verticalLine}>|</span>
                <span>{getStoreDistance(store)}</span>
            </Col>
            {store.hasInventory && (
                <Col xs={COL_SIZE_STORE_RESERVE_LINK} className={styles.reserveLink}>
                    <button
                        onClick={() => onReserveButtonClick(store.locationId, index + 1)}
                        className={styles.pickupStoreReserveButton}
                        data-automation="pickup-store-list-item-reserve-button">
                        <FormattedMessage {...messages.pickupStoreReserveButton} />
                    </button>
                    {showLowInventory && <LowInventory numRemaining={store.quantityOnHand} />}
                </Col>
            )}
        </Row>
    ));
};

export default ({locale, stores, storeLocatorUrl, updateStores, sku, onReserveButtonClick, showLowInventory}: NearbyStoresProps) => {
    const onCheckOtherStoresClick = (): void => {
        tracker.dispatchEvent({
            action: "Click",
            category: "PDP",
            label: "Check other stores (Store Locator Page)",
        });
    };

    return (
        <div className={`x-nearby-stores ${styles.stores}`}>
            {stores &&
                stores.length > 0 &&
                renderFirstThreeStores(stores, storeLocatorUrl, locale, onReserveButtonClick, showLowInventory)}

            {!!updateStores && !!sku && (
                <div className={styles.storeProductAvailabilityPageLink} data-automation="check-other-stores-link">
                    <Link
                        className={`x-update-location-link ${styles.updateLocation}`}
                        chevronType={"right"}
                        to={"productRpu" as Key}
                        params={[sku]}
                        onClick={onCheckOtherStoresClick}>
                        <FormattedMessage {...messages.UpdateLocation} />
                    </Link>
                </div>
            )}
        </div>
    );
};
