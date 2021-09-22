import {HttpRequestType, StatusCode, HttpRequestError} from "errors";
import fetch from "utils/fetch";
import {
    CellPhoneUpgradeEligibility,
    CellPhoneUpgradeEligibilityGenericResponse,
    CellPhoneUpgradeEligibilityApiError,
    CellPhoneCarrierID,
    CarrierMetaDataApiResponse,
} from "models";

import {CellPhoneUpgradeEligibilityProvider} from ".";
import carrierMetaDataCache from "./carrierMetaDataCache";

export class ApiCellPhoneUpgradeEligibilityProvider implements CellPhoneUpgradeEligibilityProvider {
    private upgradeEligibilityPath = "/upgrade/eligibilities";
    private metadataPath = "/getCarrierInfo/{carrierId}";

    constructor(private url: string) {}

    public async fetchCellPhoneUpgradeEligibility(
        data: CellPhoneUpgradeEligibility,
        challengeToken: string,
    ): Promise<CellPhoneUpgradeEligibilityGenericResponse> {
        if (!challengeToken) {
            throw new Error("No token");
        }

        if (!data || !data.carrierId) {
            throw new Error("Invalid data provided");
        }

        const upgradeEligibilityUrl = `${this.url}${this.upgradeEligibilityPath}`;

        const payload = {...data};
        if (data.postalCode) {
            Object.assign(payload, {postalCode: data.postalCode.toUpperCase()});
        }

        const response = await fetch(
            upgradeEligibilityUrl,
            HttpRequestType.CellPhoneUpgradeApi,
            {
                body: JSON.stringify(payload),
                headers: {
                    challengetoken: challengeToken,
                    Connection: "keep-alive",
                    "Content-Type": "application/json",
                },
                method: "Post",
            },
            true,
        );

        const responseData = await response.json();

        if (response.status === StatusCode.BadRequest) {
            const errorResponse: CellPhoneUpgradeEligibilityApiError = {
                resultCode: responseData.resultCode,
                resultDetails: responseData.resultDetails,
            };

            return {error: errorResponse};
        }

        if (response.status !== StatusCode.OK) {
            throw new HttpRequestError(
                HttpRequestType.CellPhoneUpgradeApi,
                this.url,
                responseData,
                undefined,
                response.status,
            );
        }

        return {success: responseData};
    }

    public async fetchCarrierMetadata(carrierId: CellPhoneCarrierID): Promise<CarrierMetaDataApiResponse> {
        if (!carrierId) {
            throw new Error("No carrierId");
        }

        try {
            const carrierMetadataRawUrl = `${this.url}${this.metadataPath}`;
            const carrierMetadataUrl = carrierMetadataRawUrl.replace("{carrierId}", carrierId);

            const cachedCarrierMetaData = carrierMetaDataCache.get(carrierMetadataUrl);
            if (cachedCarrierMetaData) {
                return cachedCarrierMetaData;
            }

            const response = await fetch(carrierMetadataUrl, HttpRequestType.CellPhoneUpgradeApi);
            const carrierMetaData = await response.json();

            carrierMetaDataCache.set(carrierMetadataUrl, carrierMetaData);

            return carrierMetaData;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
