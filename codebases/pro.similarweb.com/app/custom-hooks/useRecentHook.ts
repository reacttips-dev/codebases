import { useEffect, useState } from "react";
import { getRecentByFilter } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { RecentsTypes } from "services/solutions2Services/HomepageDataFetchers/HomepageDataFetcherTypes";

export const useRecent = (filter?: RecentsTypes) => {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const getRecent = async (): Promise<void> => {
            const recentItems = await getRecentByFilter(filter);
            setRecent(recentItems);
        };
        getRecent();
    }, [filter]);

    return recent;
};
