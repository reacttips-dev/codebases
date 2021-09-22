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
import { ServicePlanType } from "../../business-rules/entities";
import { NotFoundError } from "../../errors";
export default class ApiBenefitProvider {
    constructor(uri) {
        this.getBenefitMessages = (sku, lang = "en") => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.send(`/${sku}/warranties?lang=${lang}`);
            return {
                benefitMessages: this.mapResponseToServicePlanBenefits(res),
                servicePlanType: this.getFirstWarrantyType(res),
            };
        });
        this.send = (url) => __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${this.baseUri}${url}`;
            const fetchData = {
                method: "GET",
            };
            const res = yield fetch(apiUrl, fetchData);
            if (res.status === 204) {
                return {};
            }
            if (res.status === 404) {
                throw new NotFoundError();
            }
            if (res.status >= 400) {
                throw new Error();
            }
            return res.json();
        });
        this.getFirstWarrantyType = (res) => {
            const firstWarranty = res.warranties && res.warranties.find((i) => {
                return i.type === ServicePlanType.PSP || i.type === ServicePlanType.PRP;
            });
            if (firstWarranty) {
                return firstWarranty.type;
            }
            return null;
        };
        this.getMessagesByWarrantyType = (res) => {
            const warrantyType = this.getFirstWarrantyType(res);
            const msgs = res.warrantyBenefitsMessages ? res.warrantyBenefitsMessages.filter((i) => {
                return i.warrantyType === warrantyType;
            }) : [];
            return [...msgs];
        };
        this.mapResponseToServicePlanBenefits = (res) => (this.getMessagesByWarrantyType(res).map((b) => ({
            messages: b.benefits ? b.benefits.map((item) => (item.description)) : [],
            title: b.title,
            warrantyType: b.warrantyType,
        })));
        this.baseUri = uri;
    }
}
//# sourceMappingURL=ApiBenefitProvider.js.map