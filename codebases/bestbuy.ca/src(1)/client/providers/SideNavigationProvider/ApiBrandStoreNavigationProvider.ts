import { HttpRequestType } from "errors";
import { SideNavigationNode } from "models";
import { ApiCmsSideNavigationProvider, SideNavigationProvider} from "./SideNavigationProvider";

export class ApiBrandStoreSideNavigationProvider extends ApiCmsSideNavigationProvider implements SideNavigationProvider {
    constructor(baseUrl: string, locale: Locale, brandName: string, brandStoreId: string) {
        super(baseUrl, `brands/${brandName}/store-pages/${brandStoreId}/navigation`, locale, null);
    }

    public async getNavigation(): Promise<SideNavigationNode> {
        return await this.getResourceNavigation({}, HttpRequestType.CollectionContentApi) as SideNavigationNode;
    }
}

export default ApiBrandStoreSideNavigationProvider;
