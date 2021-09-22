/* eslint-disable @typescript-eslint/no-empty-function */
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import classNames from "classnames";
import { i18nFilter } from "filters/ngFilters";
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import { IKeywordGroup } from "userdata";
import { KeywordGroupsShareModal } from "pages/workspace/marketing/pages/KeywordGroupShareModal";
import { SharingService } from "sharing/SharingService";
import { useAccountUsers } from "custom-hooks/useAccountUsers";
import {
    IAutocompleteKeywordGroupsProps,
    IKeywordAutocompleteResults,
    IAutocompleteKeywordGroup,
} from "components/AutocompleteKeywords/types/AutocompleteKeywordGroupTypes";
import {
    getAutocompleteKeywordsForQuery,
    getAutocompleteRecentKeywordSearches,
} from "components/AutocompleteKeywords/helpers/KeywordAutocompleteDataHandler";
import { IAutocompleteKeyword } from "components/AutocompleteKeywords/types/AutocompleteKeywordGroupTypes";
import {
    AutocompleteStyled,
    StyledTab,
} from "components/AutocompleteKeywords/styles/AutocompleteKeywordStyles";
import {
    KeywordsGroupSection,
    KeywordsSection,
} from "components/AutocompleteKeywords/components/AutocompleteKeywordGroupsComponents";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export const AutocompleteKeywordGroups: FunctionComponent<IAutocompleteKeywordGroupsProps> = ({
    selectedValue,
    onClick,
    className,
    autocompleteProps = {},
    forceResultsView = false,
    defaultSelectedTab = "keywords",
    onGroupShareModalOpened,
    onGroupShareModalClosed,
    onGroupDelete,
    onClearSearch,
    showKeywords = true,
    onValueChange = () => {},
    onGroupEditorModalClosed = () => {},
}) => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            sharingService: SharingService,
            fetchService: DefaultFetchService.getInstance(),
        };
    }, []);

    const [selectedIndex, setSelectedIndex] = useState(() => {
        // Resolve which tab should be opened by default
        switch (defaultSelectedTab) {
            case "keyword groups":
                return 1;

            case "keywords":
            default:
                return 0;
        }
    });

    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
    const [isInitialQuery, setIsInitialQuery] = useState(true);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [groupToShare, setGroupToShare] = useState<IKeywordGroup>(null);
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();

    const autocompleteRef = useRef(null);
    const accountUsers = useAccountUsers();

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const handleBodyClick = (e) => {
        if (!findParentByClass(e.target, "AutocompleteWithTabs")) {
            autocompleteRef?.current?.truncateResults(true);
        }
    };

    const onTabSelected = (index: number) => {
        setSelectedIndex(index);
    };

    const renderItemsClick = (item) => () => {
        autocompleteRef?.current?.truncateResults(true);
        onClick(item);
    };

    /**
     * Resolves the query text that should be sent for the autocomplete search
     */
    const resolveQueryInput = (query: string) => {
        const hasQuery = typeof query === "string" && query !== "";

        if (hasQuery) {
            return query;
        }

        // In case no query is present, but the component user wants to show
        // results immediately, we should use the initial selected value as the query input.
        // this logic is used to display immediate search results upon opening the autocomplete
        // search in the new keywords query bar.
        if (isInitialQuery && forceResultsView) {
            setIsInitialQuery(false);
            return selectedValue;
        }

        return null;
    };

    const getKeywords = async (
        query: string,
        hasQuery: boolean,
    ): Promise<IAutocompleteKeyword[]> => {
        return hasQuery
            ? await getAutocompleteKeywordsForQuery(query, services.fetchService)
            : getAutocompleteRecentKeywordSearches();
    };

    const getKeywordGroups = (query: string, hasQuery: boolean): IAutocompleteKeywordGroup[] => {
        const keywordGroups = keywordsGroupsService.userGroups.map((group) => ({
            ...group,
            SharedWithMe: false,
        }));

        return hasQuery
            ? keywordGroups.filter((keywordGroup: IKeywordGroup) => {
                  return keywordGroup.Name.toLowerCase().includes(query.toLowerCase());
              })
            : keywordGroups;
    };

    const getSharedKeywordGroups = (
        query: string,
        hasQuery: boolean,
    ): IAutocompleteKeywordGroup[] => {
        const sharedKwGroups = keywordsGroupsService
            .getSharedGroups()
            .map((group: IKeywordGroup) => ({ ...group, SharedWithMe: true }));

        return hasQuery
            ? sharedKwGroups.filter((keywordGroup) => {
                  return keywordGroup.Name.toLowerCase().includes(query.toLowerCase());
              })
            : sharedKwGroups;
    };

    const getAutocompleteData = async (
        queryInput: string,
    ): Promise<IKeywordAutocompleteResults> => {
        onValueChange(queryInput);
        setIsAutocompleteLoading(true);

        const query = resolveQueryInput(queryInput) as string;
        const hasQuery = typeof query === "string" && query !== "";
        if (!hasQuery && selectedValue) {
            if (onClearSearch) {
                onClearSearch();
            }
        }
        const keywords = await getKeywords(query, hasQuery);
        const keywordGroups = getKeywordGroups(query, hasQuery);
        const sharedKeywordGroups = getSharedKeywordGroups(query, hasQuery);

        setIsAutocompleteLoading(false);
        // sim-32009: switch to kwgroups if the user doesnt have recent searched and he has at least on group
        if (keywords.length === 0 && (keywordGroups.length > 0 || sharedKeywordGroups.length > 0)) {
            setSelectedIndex(1);
        }

        // sim-32009: after the users type anything, if there are keyword results and no keyword group results,
        // move to the keywords tab
        if (
            hasQuery &&
            keywords.length > 0 &&
            keywordGroups.length === 0 &&
            sharedKeywordGroups.length === 0
        ) {
            setSelectedIndex(0);
        }

        return {
            hasQuery: hasQuery,
            keywords: keywords,
            keywordGroups: keywordGroups,
            sharedKeywordGroups: sharedKeywordGroups,
        };
    };

    const handleGroupEditClick = (item) => {
        setKeywordGroupToEdit(item);
        setIsOpen(true);
    };

    const handleGroupShareClick = (item: IKeywordGroup) => {
        const groupToShare = keywordsGroupsService.adaptGroupDataForShareModal(item);
        setGroupToShare(groupToShare);
        setIsShareModalOpen(true);

        if (onGroupShareModalOpened) {
            onGroupShareModalOpened();
        }
    };

    const handleGroupShareClose = () => {
        setIsShareModalOpen(false);
        setGroupToShare(null);

        if (onGroupShareModalClosed) {
            onGroupShareModalClosed();
        }
    };

    const renderAutocompleteContent = (data: { listItems: IKeywordAutocompleteResults }) => {
        const { keywords, keywordGroups, sharedKeywordGroups, hasQuery } = data.listItems;
        const hasAnyData =
            keywords?.length > 0 || keywordGroups?.length > 0 || sharedKeywordGroups?.length > 0;
        const hideResultsCount = isAutocompleteLoading || !hasQuery;

        if (!hasAnyData) {
            return null;
        }

        return showKeywords ? (
            <div className={"ListItemsContainer"}>
                <Tabs selectedIndex={selectedIndex} onSelect={onTabSelected}>
                    <TabList>
                        <StyledTab>
                            {services.translate("autocompleteKeywordsGroup.keywordsTab.Title")}{" "}
                            {!hideResultsCount && `(${keywords.length})`}
                        </StyledTab>
                        <StyledTab>
                            {services.translate("autocompleteKeywordsGroup.keywordsGroupTab.Title")}{" "}
                            {!hideResultsCount &&
                                `(${keywordGroups.length + sharedKeywordGroups.length})`}
                        </StyledTab>
                    </TabList>
                    <>
                        <TabPanel>
                            <KeywordsSection
                                keywords={keywords}
                                isRecentSearches={!hasQuery}
                                translate={services.translate}
                                renderOnItemClick={renderItemsClick}
                            />
                        </TabPanel>
                        <TabPanel>
                            <KeywordsGroupSection
                                keywordGroups={keywordGroups}
                                sharedKeywordGroups={sharedKeywordGroups}
                                translate={services.translate}
                                renderOnItemClick={renderItemsClick}
                                onEditClick={handleGroupEditClick}
                                onShareClick={handleGroupShareClick}
                            />
                        </TabPanel>
                    </>
                </Tabs>
            </div>
        ) : (
            <div>
                <KeywordsGroupSection
                    keywordGroups={keywordGroups}
                    sharedKeywordGroups={sharedKeywordGroups}
                    translate={services.translate}
                    renderOnItemClick={renderItemsClick}
                    onEditClick={handleGroupEditClick}
                    onShareClick={handleGroupShareClick}
                />
            </div>
        );
    };

    return (
        <>
            {isShareModalOpen && (
                <KeywordGroupsShareModal
                    keywordGroup={groupToShare}
                    isOpen={isShareModalOpen}
                    users={accountUsers}
                    onCloseClick={handleGroupShareClose}
                    onFinish={handleGroupShareClose}
                />
            )}
            <AutocompleteStyled
                className={classNames("AutocompleteWithTabs", className)}
                getListItems={getAutocompleteData}
                renderItems={renderAutocompleteContent}
                preventTruncateUnlessForced={true}
                ref={autocompleteRef}
                loadingComponent={<DotsLoader />}
                isLoading={isAutocompleteLoading}
                floating={true}
                debounce={250}
                selectedValue={selectedValue}
                {...autocompleteProps}
            />
            <KeywordsGroupEditorModal
                onClose={() => {
                    setIsOpen(false);
                    onGroupEditorModalClosed();
                }}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                hideViewGroupLink={false}
                onDelete={onGroupDelete}
            />
        </>
    );
};
