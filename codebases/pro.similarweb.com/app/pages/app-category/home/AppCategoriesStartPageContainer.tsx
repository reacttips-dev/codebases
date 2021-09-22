import { HomepageAppMarketItem } from "@similarweb/ui-components/dist/homepages";
import { appStores } from "@similarweb/ui-components/dist/homepages/common/ICommonHomepageProps";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { AutocompleteAppCategories } from "components/AutocompleteAppategories/AutocompleteAppCategories";
import { IAppCategory } from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import AppCategoriesStartPage from "pages/module start page/src/app categories/AppCategoriesStartPage";
import { string } from "prop-types";
import * as React from "react";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";

const DEFAULT_PAGE_STATE = "appcategory-leaderboard";
interface IAppCategoryItem extends IAppCategory {
    store: string;
    device: string;
}
interface IAppCategoriesStartPageContainerProps {
    pageState?: string;
    subtitlePosition?: string;
    title: string;
    subtitle: string;
    bodyText?: string;
}

interface IAppCategoryRecent {
    id: number;
    data: {
        country: number;
        category: string;
        store: appStores;
        device: string;
        mode: string;
    };
}

const AppCategoriesStartPageContainer: FunctionComponent<IAppCategoriesStartPageContainerProps> = ({
    pageState,
    subtitlePosition,
    title,
    subtitle,
    bodyText,
}) => {
    const homepageProps = useMemo(
        () => ({
            subtitlePosition,
            title,
            subtitle,
            bodyText,
        }),
        [subtitlePosition, title, subtitle, bodyText],
    );

    const [recents, setRecents] = useState<IAppCategoryRecent[]>([]);

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        };
    }, []);

    useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems: IAppCategoryRecent[] = await getRecentsAnalysis("appCategory", true);
            setRecents(recentItems);
        };

        getRecents();
    }, []);

    const getListItems = useCallback(
        (recents: IAppCategoryRecent[]) => {
            const onItemClick = (params) => () => {
                const { defaultParams } = services.swNavigator.getState(pageState);
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key],
                );
                services.swNavigator.go(pageState, { ...defaultParams, ...params });
            };
            return recents.map((recent) => {
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
            });
        },
        [navigator, pageState],
    );

    const handleItemClick = useCallback(
        (item: IAppCategoryItem) => {
            const config: any = services.swNavigator.getState(pageState).configId;
            const defaultParams = swSettings.components[config()].defaultParams;
            const { id: category, store, device } = item;
            services.swNavigator.go(pageState, { ...defaultParams, category, store, device });
        },
        [navigator, pageState],
    );

    return (
        <TranslationProvider translate={services.i18n}>
            <AppCategoriesStartPage
                searchComponent={
                    <AutocompleteAppCategories
                        onClick={handleItemClick}
                        autocompleteProps={{
                            placeholder: services.i18n(
                                "app.categories.home.autocomplete.placeholder",
                            ),
                        }}
                    />
                }
                listItems={getListItems(recents)}
                {...homepageProps}
            />
        </TranslationProvider>
    );
};

AppCategoriesStartPageContainer.propTypes = {
    pageState: string,
    subtitlePosition: string,
    title: string,
    subtitle: string,
    bodyText: string,
};
AppCategoriesStartPageContainer.defaultProps = {
    pageState: DEFAULT_PAGE_STATE,
    subtitlePosition: "left-aligned",
    bodyText: "app.categories.home.body.text",
};

export default SWReactRootComponent(
    AppCategoriesStartPageContainer,
    "AppCategoriesStartPageContainer",
);
