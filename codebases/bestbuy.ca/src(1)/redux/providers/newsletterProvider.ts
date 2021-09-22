var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpRequestError, NotFoundError, StatusCode } from "../../business-rules/entities/errors/index";
export class NewsletterProvider {
    constructor(newsletterApiUrl, apiVersionNumber = 1) {
        this.addSubscriber = (data) => __awaiter(this, void 0, void 0, function* () {
            const submitUrl = this.newsletterApiUrl + "/marketing-cloud/subscribe";
            const submitData = {
                email: data.email,
                language: data.language,
                optedOut: false,
                // Temporarily assigning dummy postal code when postal code is not provided by user.
                postalCode: data.postalCode || "X0X 0X0",
            };
            const response = yield fetch(submitUrl, {
                body: JSON.stringify(submitData),
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Accept-Language": data.locale,
                    "Content-Type": "application/json;charset=UTF-8",
                },
                method: "POST",
            });
            if (response.status === StatusCode.OK) {
                return response.status;
            }
            else {
                return Promise.reject(new HttpRequestError(submitUrl, "Failed to subscribe", undefined, response.status));
            }
        });
        this.getSubscriber = (data) => __awaiter(this, void 0, void 0, function* () {
            const apiUrl = this.newsletterApiUrl + "/marketing-cloud/preferences";
            const requestUrl = `${apiUrl}?email=${data.email}`;
            const response = yield fetch(requestUrl, {
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Accept-Language": data.locale,
                    "Content-Type": "application/json;charset=UTF-8",
                },
                method: "GET",
            });
            if (response.status === StatusCode.OK) {
                return response.json();
            }
            else if (response.status === StatusCode.NotFound) {
                return Promise.reject(new NotFoundError(requestUrl, "Email not found in subscriber's list"));
            }
            else {
                return Promise.reject(new HttpRequestError(requestUrl, "Failed to fetch subscriber", undefined, response.status));
            }
        });
        this.updateSubscriberPreferences = (data) => __awaiter(this, void 0, void 0, function* () {
            const submitUrl = this.newsletterApiUrl + "/marketing-cloud/preferences";
            const submitData = {
                campaignList: data.campaignList,
                email: data.email,
                language: data.language,
                optedOut: this.isOptedOut(data.campaignList),
                postalCode: data.postalCode || "M5G 2C3",
            };
            const response = yield fetch(submitUrl, {
                body: JSON.stringify(submitData),
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Accept-Language": data.locale,
                    "Content-Type": "application/json;charset=UTF-8",
                },
                method: "PUT",
            });
            if (response.status === StatusCode.OK) {
                return response.status;
            }
            else {
                return Promise.reject(new HttpRequestError(submitUrl, "Failed to update subscription", undefined, response.status));
            }
        });
        this.isOptedOut = (campaignList) => {
            let isOptedOut = true;
            campaignList.forEach((campaign) => {
                if (campaign.frequency !== "unsubscribe") {
                    return isOptedOut = false;
                }
            });
            return isOptedOut;
        };
        this.newsletterApiUrl = newsletterApiUrl;
        this.newsletterApiUrl += `/v${String(apiVersionNumber)}`;
    }
}
//# sourceMappingURL=newsletterProvider.js.map