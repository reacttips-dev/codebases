import getLogger from "common/logging/getLogger";

import convertStoreHoursToMap from "../convertStoreHoursToMap";
import {PickupHoursOffset, WeekStoreHoursMap} from "../../models";
import calculateCurbsideHours from "../calculateCurbsideHours";

export interface GetStoreCurbsideHoursArgs {
    storeHours: string[];
    lang: Language;
    storeOffsets: PickupHoursOffset;
}

const getStoreCurbsideHours = ({storeHours = [], lang, storeOffsets}: GetStoreCurbsideHoursArgs): WeekStoreHoursMap => {
    // this is guaranted to be an object
    const storeHoursMap = convertStoreHoursToMap(storeHours, lang);

    try {
        const curbsideHours = calculateCurbsideHours(storeHoursMap, storeOffsets);
        return curbsideHours;
    } catch (error) {
        getLogger().error(error);
        return storeHoursMap;
    }
};

export default getStoreCurbsideHours;
