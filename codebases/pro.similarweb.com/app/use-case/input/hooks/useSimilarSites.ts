import { ISimilarSite, ISite } from "components/Workspace/Wizard/src/types";
import { IDomain } from "pages/feed/types/feed.types";
import { useEffect, useState } from "react";
import { DefaultFetchService } from "services/fetchService";

const fetchService = DefaultFetchService.getInstance();

export const useSimilarSites = (site: ISite | null, setIsLoading): IDomain[] => {
    const [similarSites, setSimilarSites] = useState<IDomain[] | null>([]);

    useEffect(() => {
        const fetchSimilarSites = async ({ name }) => {
            setSimilarSites([]);
            setIsLoading(true);
            const items = await fetchService.get<ISimilarSite[]>(
                `/api/websiteanalysis/getsimilarsites?key=${name}&limit=20`,
            );
            setIsLoading(false);

            setSimilarSites(
                items.map(({ Domain: name, Favicon: icon, Rank }) => ({
                    name,
                    icon,
                    Rank,
                })),
            );
        };

        if (site) {
            fetchSimilarSites(site);
        }
    }, [site?.name]);

    return similarSites;
};
