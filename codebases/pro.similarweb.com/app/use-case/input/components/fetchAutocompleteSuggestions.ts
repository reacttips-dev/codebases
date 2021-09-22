import { ISite } from "components/Workspace/Wizard/src/types";
import { DefaultFetchService } from "services/fetchService";

export interface ISiteSuggestion extends ISite {
    blockStatus: boolean;
}

export const fetchAutoCompleteSuggestions = async (
    query: string,
    selectedSite?: ISiteSuggestion,
): Promise<ISiteSuggestion[]> => {
    if (!query) {
        return [];
    }

    const fetchService = DefaultFetchService.getInstance();

    const items = await fetchService.get<ISiteSuggestion[]>(
        // TODO: proper country code
        `/autocomplete/websites?size=9&term=${query}&webSource=Desktop&country=999&validate=true`,
    );

    return selectedSite
        ? // remove selected site from the autocomplete results
          items.filter(({ name }) => name !== selectedSite.name)
        : items;
};
