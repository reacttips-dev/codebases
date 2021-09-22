import { renderItemCreator } from "components/AutocompleteWebCategories/utils";
import { RecentService } from "services/recent/recentService";
import { ETrackerAssetType } from "services/competitiveTracker/types";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

export type IListItem = ITrackerAsset;
export type IListItems = IListItem[];

const { Website, Segment, Company } = ETrackerAssetType;

export const hasQuery = (query) => typeof query === "string" && query !== "";

const filterExcludeItems = (excludeItems) => ({ id, type }: IListItem) =>
    !excludeItems.has(type + id);

export const getListItems = (
    selectedValue,
    onClearSearch,
    renderItemsClick,
    query,
    customSegmentsMeta,
    excludeItems,
    websiteResults = [],
): IListItems => {
    if (!hasQuery(query) && selectedValue) {
        onClearSearch();
    }
    const websiteItems = getListItemsWebsites(query, websiteResults);
    const segmentItems = getListItemsSegments(query, customSegmentsMeta);
    const companyItems = getListItemsCompanies(query);
    const items = [...websiteItems, ...segmentItems, ...companyItems];

    const excludeItemsEnriched = excludeItems.map(({ type, id }) => type + id);
    const excludeItemsSet = new Set(excludeItemsEnriched);
    const listItems = items
        .filter(filterExcludeItems(excludeItemsSet))
        .map(renderItemCreator(renderItemsClick));
    return listItems;
};

const getListItemsWebsites = (query, websiteResults): IListItems =>
    websiteResults.length ? getAutoCompleteWebsites(websiteResults) : getRecentWebsites();

const getAutoCompleteWebsites = (websiteResults): IListItems => {
    const recentWebsites = websiteResults?.map((item) => {
        const { name, image } = item;
        return {
            displayText: name,
            image,
            type: Website,
            id: name,
        };
    });
    return recentWebsites;
};
const getRecentWebsites = (): IListItems => {
    const recents = RecentService.getRecentsWebsites();
    const recentWebsites = recents.map(({ data }) => {
        const { mainItem, resources } = data;
        return {
            displayText: mainItem,
            id: mainItem,
            image: resources.mainItemFavIcon,
            type: Website,
        };
    });
    return recentWebsites;
};

const getListItemsSegments = (query = "", customSegmentsMeta): IListItems => {
    const { Segments: segments = [], AccountSegments: accountSegments = [] } = customSegmentsMeta;
    const accountSegmentsEnriched = accountSegments.map((segment) => ({
        ...segment,
        isAccount: true,
    }));
    const filterByQuery = ({ segmentName }) =>
        segmentName?.toLowerCase().includes(query.toLowerCase());
    const segmentsListItems = [...segments, ...accountSegmentsEnriched]
        .filter(filterByQuery)
        .map(({ favicon, segmentName, isAccount, id, domain }) => {
            return {
                displayText: domain,
                image: favicon,
                type: Segment,
                id,
                isAccount,
                name: segmentName,
            };
        });
    return segmentsListItems;
};

const getListItemsCompanies = (query): IListItems => [];
