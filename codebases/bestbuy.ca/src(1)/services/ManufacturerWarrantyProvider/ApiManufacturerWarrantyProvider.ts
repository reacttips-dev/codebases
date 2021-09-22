var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "isomorphic-fetch";
export class ApiManufacturerWarrantyProvider {
    constructor(uri) {
        this.getManufacturerWarranty = (sku) => __awaiter(this, void 0, void 0, function* () {
            const uri = `${this.baseUri}/${sku}/offers`;
            const res = yield this.send(uri);
            return this.getManufacturerWarrantyYears(res);
        });
        this.send = (uri) => __awaiter(this, void 0, void 0, function* () {
            const fetchData = {
                method: "GET",
            };
            const res = yield fetch(uri, fetchData);
            if (res.status !== 200) {
                throw new Error();
            }
            return res.json();
        });
        this.baseUri = uri;
    }
    getManufacturerWarrantyYears(res) {
        if (res && res[0] && res[0].warranty) {
            const { warranty } = res[0];
            const { labourCarryIn: labourInDays, parts: partsInDays } = warranty;
            return { labourInDays, partsInDays };
        }
        else {
            throw new Error();
        }
    }
}
//# sourceMappingURL=ApiManufacturerWarrantyProvider.js.map