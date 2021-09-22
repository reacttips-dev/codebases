import { ApiManagementService } from "./apiManagementService";

export class ApiManagementMockService extends ApiManagementService {
    getUserKeys() {
        return Promise.resolve([
            {
                UserId: 730969,
                UserEmail: "yoav.shmaria@similarweb.com",
                Key: "65bfd9d13f564cada464b38854cea877",
                Title: "Team Lead - Ligers",
                CreatedDate: new Date("2018-08-28"),
                IsValid: true,
                LastUsedDate: null,
                MonthlyUsage: 0,
                canBeEnabled: true,
                isLoading: false,
            },
        ]);
    }
}
