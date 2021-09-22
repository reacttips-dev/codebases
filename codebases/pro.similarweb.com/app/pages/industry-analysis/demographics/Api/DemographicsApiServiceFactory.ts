import { IDemographicsApiService } from "./DemographicsApiServiceTypes";
import { DemographicsApiService } from "./DemographicsApiService";

// export const getMockApiService = (): IDemographicsApiService => {
//     return new MockDemographicsApiService();
// };

export const getApiService = (): IDemographicsApiService => {
    return new DemographicsApiService();
};
