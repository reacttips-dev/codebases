import React from "react";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { Tab, TabPanel, Tabs, TabList } from "@similarweb/ui-components/dist/tabs";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import SegmentsApiService, {
    ICustomSegment,
    ICustomSegmentAccount,
    ICustomSegmentGroupWebsite,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { ListItemSegment } from "pages/segments/components/ListItems";
import {
    ENABLE_FIREBOLT,
    ICustomSegmentMember,
    SegmentsUtils,
} from "services/segments/SegmentsUtils";
import { useLoading } from "custom-hooks/loadingHook";
import { i18nFilter } from "filters/ngFilters";
import { withUseAdvancedPref, IWithUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import {
    DropdownBannerContainer,
    DropdownBanner,
    DropdownBannerBlock,
} from "pages/segments/modals/styledComponents";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import I18n from "components/WithTranslation/src/I18n";
import {
    ListItemCollapsibleSeparator,
    ScrollAreaWrapper,
} from "../querybar/AutocompleteDropdownTabs";

const AUTOCOMPLETE_DEBOUNCE = 150;
const AUTOCOMPLETE_ASYNC_ADDITIONAL_DEBOUNCE = 500;
const AUTOCOMPLETE_MAX_LIST_SIZE = 350;
const AUTOCOMPLETE_MAX_WEBSITES_SUGGESTIONS = 20;

const fetchWebsitesItems = async (
    query: string,
    options: { maxSuggestions?: number; webSource?: string } = {},
): Promise<ICustomSegmentGroupWebsite[]> => {
    const segmentsApiService = new SegmentsApiService();
    const {
        maxSuggestions = AUTOCOMPLETE_MAX_WEBSITES_SUGGESTIONS,
        webSource = "Desktop",
    } = options;
    const items = await segmentsApiService.fetchWebsitesSuggestions(query, {
        size: maxSuggestions,
        webSource,
    });
    return items.map((item) => ({
        domain: item.name,
        favicon: item.image,
    }));
};

const flexFixed = css`
    flex: none;
`;
const flexAutoScrollContainer = css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    & > * {
        ${flexFixed}
    }
`;

const SegmentsAutocompleteWrapper = styled.div`
    .ListItemsContainer {
        max-height: 360px;
        ${flexAutoScrollContainer}

        &:before {
            transform: none;
            ${flexFixed}
        }

        .ListItemsTabs {
            flex: auto;
            ${flexAutoScrollContainer}

            & > ul:first-child {
                ${flexFixed}
            }
            & > div.selected {
                flex: auto;
                ${flexAutoScrollContainer}
            }
        }

        .ListItemsScrollContainer {
            position: relative;
            flex: auto !important;
            ${flexAutoScrollContainer}
        }
    }
`;

const DropdownContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 8px;
`;
const OrangePill = styled(StyledPill)`
    background-color: ${colorsPalettes.orange["400"]};
    text-transform: uppercase;
    margin-left: 8px;
`;

const segmentsDropdownSections = [
    {
        key: "mySegments",
        title: "My Segments",
    },
    {
        key: "accountSegments",
        title: "Account Segments",
    },
];

const SegmentsDropdownContentComponent = ({ segments, selectItem }) => (
    <>
        {segmentsDropdownSections.map((sect) =>
            segments[sect.key]?.length > 0 ? (
                <ListItemCollapsibleSeparator key={sect.key} title={sect.title}>
                    {segments[sect.key].slice(0, AUTOCOMPLETE_MAX_LIST_SIZE).map((item) => (
                        <ListItemSegment
                            key={item.id}
                            domain={item.domain}
                            name={item.segmentName}
                            img={item.favicon}
                            onClick={() => selectItem(item)}
                        />
                    ))}
                </ListItemCollapsibleSeparator>
            ) : null,
        )}
    </>
);
const SegmentsDropdownContent = React.memo(SegmentsDropdownContentComponent);

const WebsitesDropdownContentComponent = ({ websites, selectItem, isLoading = false }) =>
    isLoading ? (
        <DropdownContentContainer>
            <DotsLoader />
        </DropdownContentContainer>
    ) : (
        <>
            {websites.map((item) => (
                <ListItemWebsite
                    key={item.domain}
                    text={item.domain}
                    img={item.favicon}
                    onClick={() => selectItem(item)}
                />
            ))}
        </>
    );
const WebsitesDropdownContent = React.memo(WebsitesDropdownContentComponent);

const DropdownOptInBanner: React.FC<{ onClose } & IWithUseAdvancedPref> = ({
    useAdvancedPref,
    onClose,
}) => {
    return (
        <DropdownBannerContainer>
            <DropdownBanner>
                <DropdownBannerBlock>
                    <BetaLabel />
                    <I18n>
                        {useAdvancedPref.value
                            ? "segments.module.create.group.modal.optout.main"
                            : "segments.module.create.group.modal.optin.main"}
                    </I18n>
                </DropdownBannerBlock>
                <DropdownBannerBlock>
                    <OnOffSwitch
                        isSelected={useAdvancedPref.value}
                        onClick={() => useAdvancedPref.togglePref("Segments Group Creation")}
                    />
                </DropdownBannerBlock>
            </DropdownBanner>
        </DropdownBannerContainer>
    );
};

const DropdownItemsContentComponent: React.FC<
    {
        listItems: { _PROPS_: any; segments: { [key: string]: ICustomSegmentMember[] } };
        onItemSelect: Function;
    } & IWithUseAdvancedPref
> = ({ listItems, onItemSelect, useAdvancedPref }) => {
    const { _PROPS_: listProps = undefined, segments = {} } = listItems;
    const isShown = listProps !== undefined;
    const { query, selectItem, selectedItems } = listProps || {};

    const filteredSegments = React.useMemo<{ [key: string]: ICustomSegmentMember[] }>(() => {
        const segFilterCallback =
            ENABLE_FIREBOLT && !useAdvancedPref.value
                ? (segment) => !SegmentsUtils.isSegmentAdvanced(segment)
                : () => true;
        return Object.entries(segments).reduce(
            (acc, [segSectKey, segSectItems]) => ({
                ...acc,
                [segSectKey]: segSectItems.filter(segFilterCallback),
            }),
            {},
        );
    }, [segments, useAdvancedPref.value]);

    const scrollWrapperRef = React.useRef(null);
    React.useEffect(() => {
        if (scrollWrapperRef.current) {
            scrollWrapperRef.current.scrollTop();
        }
    }, [query]);

    const [selectedTabIdx, setSelectedTabIdx] = React.useState(0);
    const { selectSegment, selectWebsite } = React.useMemo(
        () => ({
            selectSegment: (segment) =>
                onItemSelect(() => selectItem(segment, SEGMENT_TYPES.SEGMENT)),
            selectWebsite: (website) =>
                onItemSelect(() => selectItem(website, SEGMENT_TYPES.WEBSITE)),
        }),
        [onItemSelect, selectItem],
    );
    const [websitesQuery, websitesQueryOps] = useLoading<any[], string>();
    const lastWebsiteQueryLoadedRef = React.useRef(null);

    const [showOptInBanner, setShowOptInBanner] = React.useState(!useAdvancedPref.value);
    const closeOptInBanner = React.useCallback(() => {
        setShowOptInBanner(false);
    }, [setShowOptInBanner]);

    React.useEffect(() => {
        if (!query) {
            if (query === "") {
                websitesQueryOps.reset();
                lastWebsiteQueryLoadedRef.current = null;
                if (selectedTabIdx !== 0) {
                    setSelectedTabIdx(0);
                }
            }
            return;
        }

        // skip loading the website query if last websiteQuery loaded it already
        if (query !== lastWebsiteQueryLoadedRef.current) {
            websitesQueryOps.reset(); // load new website query, so first reset it, since we load the query after a while
            lastWebsiteQueryLoadedRef.current = null; // since reset websiteQuery and until actually loading, there is no last website query loaded

            const asyncTimeoutHandler = setTimeout(() => {
                lastWebsiteQueryLoadedRef.current = query; // set last website query loaded, even before resolved
                websitesQueryOps.load(() => fetchWebsitesItems(query));
            }, AUTOCOMPLETE_ASYNC_ADDITIONAL_DEBOUNCE);

            // clear the last website query loading timeout if query is changed
            return () => {
                clearTimeout(asyncTimeoutHandler);
            };
        }
    }, [query]);

    // filter websites whenever fetched new list or change selected items
    const filteredWebsites = React.useMemo(() => {
        const selectedWebsitesDomains = (selectedItems ?? [])
            .filter(([_, itemType]) => itemType === SEGMENT_TYPES.WEBSITE)
            .map(([item]) => item.domain);
        return (websitesQuery.data ?? []).filter(
            (item) => !selectedWebsitesDomains.includes(item.domain),
        );
    }, [websitesQuery.data, selectedItems]);

    return isShown ? (
        <div className="ListItemsContainer">
            {ENABLE_FIREBOLT && showOptInBanner && (
                <DropdownOptInBanner onClose={closeOptInBanner} useAdvancedPref={useAdvancedPref} />
            )}
            {query ? (
                <Tabs
                    selectedIndex={selectedTabIdx}
                    onSelect={setSelectedTabIdx}
                    className="ListItemsTabs"
                >
                    <TabList>
                        <Tab>
                            Segments (
                            {Object.entries(filteredSegments).reduce(
                                (acc, [_, segSectItems]) => acc + segSectItems.length,
                                0,
                            )}
                            )
                        </Tab>
                        <Tab>
                            Websites
                            <OrangePill>NEW</OrangePill>
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <ScrollAreaWrapper ref={scrollWrapperRef}>
                            <SegmentsDropdownContent
                                segments={filteredSegments}
                                selectItem={selectSegment}
                            />
                        </ScrollAreaWrapper>
                    </TabPanel>
                    <TabPanel>
                        <ScrollAreaWrapper ref={scrollWrapperRef}>
                            <WebsitesDropdownContent
                                websites={filteredWebsites}
                                selectItem={selectWebsite}
                                isLoading={[
                                    useLoading.STATES.LOADING,
                                    useLoading.STATES.INIT,
                                ].includes(websitesQuery.state)}
                            />
                        </ScrollAreaWrapper>
                    </TabPanel>
                </Tabs>
            ) : (
                <ScrollAreaWrapper ref={scrollWrapperRef}>
                    <SegmentsDropdownContent
                        segments={filteredSegments}
                        selectItem={selectSegment}
                    />
                </ScrollAreaWrapper>
            )}
        </div>
    ) : null;
};
const DropdownItemsContent = withUseAdvancedPref(DropdownItemsContentComponent);
const makeDropdownItemsContent = (props) => <DropdownItemsContent {...props} />;

export interface ISegmentSelectorDropdown {
    segments: ICustomSegment[];
    accountSegments: ICustomSegmentAccount[];
    selectedSegments: [ICustomSegmentMember, SEGMENT_TYPES][];
    onSegmentSelection: (segmentMember: ICustomSegmentMember, segmentType: SEGMENT_TYPES) => void;
    disabled: boolean;
}

const SegmentSelectorDropdownComponent = (props: ISegmentSelectorDropdown) => {
    const {
        segments,
        accountSegments,
        onSegmentSelection,
        selectedSegments,
        disabled = false,
    } = props;
    const autocompleteRef = React.useRef(null);

    const preventKeyUp = (evt) => {
        // stop handling those keys events since they cause errors for custom autocomplete content
        switch (evt.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "Enter":
            case "Escape":
                evt.stopPropagation();
                break;
        }
    };

    const onSegmentSelect = React.useCallback(
        (segmentMember, segmentType) => {
            onSegmentSelection(segmentMember, segmentType);
            autocompleteRef.current.truncateResults(true);
            autocompleteRef.current.textFieldRef.clearValue();
            autocompleteRef.current.textFieldRef.onBlur();
        },
        [onSegmentSelection],
    );

    const getItemsStructured = React.useCallback(
        (query) => {
            const items = {
                _PROPS_: { query, selectItem: onSegmentSelect, selectedItems: selectedSegments },
                segments: {
                    mySegments: segments.filter((segment) =>
                        SegmentsUtils.matchSegments.byQuery(segment, query),
                    ),
                    accountSegments: accountSegments.filter((segment) =>
                        SegmentsUtils.matchSegments.byQuery(segment, query),
                    ),
                },
            };
            return items;
        },
        [segments, accountSegments],
    );

    React.useEffect(() => {
        const handleBodyClick = (e) => {
            if (!e.target.closest(".SegmentsAutocomplete")) {
                autocompleteRef.current.truncateResults(true);
            }
        };
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    return (
        <SegmentsAutocompleteWrapper onKeyUpCapture={preventKeyUp}>
            <Autocomplete
                className="SegmentsAutocomplete"
                ref={autocompleteRef}
                floating={true}
                hideBorder={true}
                resetValueOnSelect={true}
                preventTruncateUnlessForced={true}
                getListItems={getItemsStructured}
                debounce={AUTOCOMPLETE_DEBOUNCE}
                disabled={disabled}
                placeholder={i18nFilter()("segments.module.create.group.modal.search.placeholder")}
                renderItems={makeDropdownItemsContent}
            />
        </SegmentsAutocompleteWrapper>
    );
};

export const SegmentSelectorDropdown = React.memo(SegmentSelectorDropdownComponent);
