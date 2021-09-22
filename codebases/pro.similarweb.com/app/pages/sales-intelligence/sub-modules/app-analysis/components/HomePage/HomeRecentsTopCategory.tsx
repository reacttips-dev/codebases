import React from "react";
import { HomepageAppMarketItem } from "@similarweb/ui-components/dist/homepages";
import { appStores } from "@similarweb/ui-components/dist/homepages/common/ICommonHomepageProps";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { StyledHomeRecentsTopCategory } from "./styles";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";

const DEFAULT_PAGE_STATE = "salesIntelligence-appcategory-leaderboard";

interface IAppCategoryRecentState {
    id: number;
    data: {
        country: number;
        category: string;
        store: appStores;
        device: string;
        mode: string;
    };
}

const HomeRecentsTopCategory: React.FC<{ pageState?: string } & WithSWNavigatorProps> = ({
    pageState = DEFAULT_PAGE_STATE,
    navigator,
}) => {
    const [recents, setRecents] = React.useState<IAppCategoryRecentState[]>([]);

    React.useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems: IAppCategoryRecentState[] = await getRecentsAnalysis(
                "appCategory",
                true,
            );
            setRecents(recentItems);
        };

        getRecents();
    }, []);

    const getListItems = React.useCallback(
        (recents: IAppCategoryRecentState[]) => {
            const onItemClick = (params) => () => {
                const { defaultParams } = navigator.getState(pageState);
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key],
                );
                navigator.go(pageState, { ...defaultParams, ...params });
            };
            return recents
                .map((recent) => {
                    const { data } = recent;
                    const params = {
                        country: data.country,
                        category: data.category,
                        store: data.store,
                        device: data.device,
                        mode: data.mode,
                    };

                    return (
                        <HomepageAppMarketItem
                            key={recent.id}
                            id={recent.id}
                            appMarketName={data.category}
                            appStore={data.store}
                            onItemClick={onItemClick(params)}
                        />
                    );
                })
                .slice(0, 3);
        },
        [navigator, pageState],
    );

    const listOfRecents = getListItems(recents);

    if (listOfRecents.length === 0) {
        return null;
    }

    return <StyledHomeRecentsTopCategory>{listOfRecents}</StyledHomeRecentsTopCategory>;
};

export default withSWNavigator(HomeRecentsTopCategory);
