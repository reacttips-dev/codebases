import swLog from "@similarweb/sw-log";
import { ApiManagementService } from "../pages/account/api-management/apiManagementService";
import { ApiKey } from "../pages/account/api-management/types";

export const CIG_UPDATE_LINK_WITH_TOKEN = "CIG_UPDATE_LINK_WITH_TOKEN";

export function getCigLinkWithToken(apiService: ApiManagementService) {
    return (dispatch) => {
        apiService
            .getUserKeys()
            .then((keys: ApiKey[]) => {
                let link = null;
                if (keys.length > 0) {
                    const firstValidKey = keys.find((key) => key.IsValid === true);
                    if (firstValidKey) {
                        link = `https://labs.similarweb.com/#apikey=${firstValidKey.Key}`;
                    } else {
                        link = `https://labs.similarweb.com`;
                    }
                }
                return dispatch({
                    type: CIG_UPDATE_LINK_WITH_TOKEN,
                    cigLink: link,
                });
            })
            .catch((err) => {
                // eslint:disable-next-line:no-console
                swLog.error(`Failed to fetch api key. Error: ${err.message}`);
            });
    };
}

export function cig(state = { cigLink: null }, action) {
    switch (action.type) {
        case CIG_UPDATE_LINK_WITH_TOKEN:
            return {
                cigLink: action.cigLink,
            };
        default:
            return state;
    }
}
