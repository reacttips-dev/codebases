import {PickupStore} from "models/Availability"

const getStoresSortedByAvailabilityAndDistance = (stores: PickupStore[]) => {
    // stores are pre-sorted by distance by the API
    const hasAvailabilityList = stores.filter((store) => store.hasInventory);
    const noAvailabilityList = stores.filter((store) => !store.hasInventory);
    return hasAvailabilityList.concat(noAvailabilityList)
};

export default getStoresSortedByAvailabilityAndDistance;