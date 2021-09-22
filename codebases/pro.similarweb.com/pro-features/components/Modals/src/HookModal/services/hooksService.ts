import { DefaultFetchService } from "services/fetchService";
import { Hooks } from "@similarweb/features/lib/components/Common/HookModalBase/types";

export class HooksService {
    private fetchService: DefaultFetchService = DefaultFetchService.getInstance();

    public getHooksCarousel(featureKey: string): Promise<Hooks> {
        return this.fetchService
            .get<Hooks>(`/api/hooks/related?featureKey=${featureKey}`)
            .then((response) =>
                !Array.isArray(response) ? Promise.reject("Invalid hooks response") : response,
            );
    }
}
