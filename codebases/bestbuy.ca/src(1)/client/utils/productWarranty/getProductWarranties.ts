import {isBothPspPrpWarranty, getProductWarrantiesBySubType} from ".";
import {Warranty, WarrantyType, WarrantySubType} from "models";

const getProductWarranties = (warranties: Warranty[] = []) => {
    // Return null when both PSP and PRP warranties
    if (isBothPspPrpWarranty(warranties)) {
        return null;
    }

    // For PSP show InHome subType
    let requiredWarranties = getProductWarrantiesBySubType(warranties, WarrantySubType.InHome, WarrantyType.PSP);
    if (requiredWarranties.length === 0) {
        requiredWarranties = getProductWarrantiesBySubType(warranties, WarrantySubType.InStore, WarrantyType.PSP);
    }

    // For PRP there is no subType
    if (requiredWarranties.length === 0) {
        requiredWarranties = getProductWarrantiesBySubType(warranties, "", WarrantyType.PRP);
    }

    if (requiredWarranties.length === 0) {
        return null;
    }

    return requiredWarranties;
};

export default getProductWarranties;
