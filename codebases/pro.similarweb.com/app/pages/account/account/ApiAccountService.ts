import { DefaultFetchService } from "services/fetchService";

export class ApiAccountService {
    private fetchService: DefaultFetchService;
    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }
    public async userWorkspaceSwitch(enabled: boolean): Promise<boolean> {
        return this.fetchService.post<boolean>(`/Api/Account/SwitchWorkspaces?enabled=${enabled}`, {
            enabled,
        });
    }
}
