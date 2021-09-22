import {CarrierMetaDataApiResponse, MobileActivationEligibilityCheckStore} from "models";

export default (data: CarrierMetaDataApiResponse): MobileActivationEligibilityCheckStore => {
    const normalizedData: MobileActivationEligibilityCheckStore = {
        default: {
            requiredMobileNumber: true,
            requiredPostalCode: true,
        },
    };

    if (data.carrierId) {
        const {carrierId, upgradeCheck} = data;
        if (!upgradeCheck) {
            normalizedData[carrierId] = null;
        } else {
            const {requiredMobileNumber = true, requiredPostalCode = true} = upgradeCheck;
            normalizedData[carrierId] = {
                requiredMobileNumber,
                requiredPostalCode,
            };
        }
    }

    return normalizedData;
};
