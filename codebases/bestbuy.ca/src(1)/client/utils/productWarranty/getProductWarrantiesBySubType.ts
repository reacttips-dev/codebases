import {Warranty, WarrantySubType} from "models";

const getProductWarrantiesBySubType = (
    warranties: Warranty[] = [],
    subType: WarrantySubType,
    type: string,
): Warranty[] =>
    warranties
        .filter((warranty) => warranty.type === type && warranty.subType === subType)
        .sort((oneWarranty, anotherWarranty) => oneWarranty.termMonths - anotherWarranty.termMonths);

export default getProductWarrantiesBySubType;
