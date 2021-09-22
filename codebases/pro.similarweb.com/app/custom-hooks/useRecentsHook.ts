import { useEffect, useState } from "react";
import { RecentsTypes } from "services/solutions2Services/HomepageDataFetchers/HomepageDataFetcherTypes";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";

export const useRecents = (filter?: RecentsTypes, deduped = false) => {
    const [recents, setRecents] = useState([]);
    useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis(filter, deduped);
            setRecents(recentItems);
        };

        getRecents();
    }, [filter, deduped]);
    return recents;
};
