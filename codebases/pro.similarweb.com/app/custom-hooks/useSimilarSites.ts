import { useState, useEffect } from "react";
import { DefaultFetchService } from "services/fetchService";

const fetchService = DefaultFetchService.getInstance();

export const useSimilarSites = (siteName: string): [boolean, Array<any>] => {
    const [isFetching, setIsFetching] = useState(false);
    const [similarSites, setSimilarSites] = useState(null);

    useEffect(() => {
        const getSimilarSites = async () => {
            try {
                return await fetchService.get(
                    `/api/WebsiteOverview/getsimilarsites?key=${siteName}&limit=20`,
                );
            } catch (e) {
                return [];
            }
        };
        const fetchFn = async () => {
            setIsFetching(true);
            const res: any = await getSimilarSites();
            setIsFetching(false);
            setSimilarSites(res);
        };
        if (siteName) {
            fetchFn();
        } else {
            setSimilarSites(null);
        }
    }, [siteName]);
    return [isFetching, similarSites];
};
