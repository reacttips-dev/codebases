import {Warranty, WarrantyType} from "models";
const isBothPspPrpWarranty = (warranties: Warranty[] = []): boolean =>
    !!warranties.find((warranty) => warranty.type === WarrantyType.PSP) &&
    !!warranties.find((warranty) => warranty.type === WarrantyType.PRP);

export default isBothPspPrpWarranty;
