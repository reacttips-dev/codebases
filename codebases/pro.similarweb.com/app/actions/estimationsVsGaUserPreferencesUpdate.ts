import {
    estimationsVsGaUserPreferencesUpdateSuccess,
    estimationsVsGaUserPreferencesUpdateFailure,
} from "./commonActions";
import swLog from "@similarweb/sw-log";
import { DefaultFetchService } from "../services/fetchService";

/**
 * Created by Eyal.Albilia on 5/17/2017.
 */

export const estimationsVsGaUserPreferencesUpdate = (userData) => {
    const fetchService = DefaultFetchService.getInstance();
    return (dispatch) =>
        fetchService
            .post<any>("/api/userdata/dataviewpreferences/update", [
                {
                    Type: userData.type,
                    IsEnabled: userData.isEnabled,
                },
            ])
            .then((response) => {
                dispatch(estimationsVsGaUserPreferencesUpdateSuccess(response));
            })
            .catch((error) => {
                swLog.error("request failed", error);
            });
};
