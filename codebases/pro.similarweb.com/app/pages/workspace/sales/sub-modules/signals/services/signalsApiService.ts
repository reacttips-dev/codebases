import { SignalsContainer, SignalsRequestParams } from "../types";
import { SALES_WIDGET_ENDPOINT } from "../../../types";
import { IFetchService } from "services/fetchService";

export const createSignalsApiService = (fetchService: IFetchService) => {
    return {
        /**
         * Fetches available signals for given params
         * @param params
         */
        fetchSignals(params: SignalsRequestParams): Promise<SignalsContainer> {
            return fetchService.get(
                `${SALES_WIDGET_ENDPOINT}/OpportunitiesList/GetFeedStatistics`,
                params,
            );
        },
    };
};
