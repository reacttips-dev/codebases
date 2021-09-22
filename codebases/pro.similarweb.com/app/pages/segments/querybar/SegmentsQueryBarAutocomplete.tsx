import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { Tab, TabPanel, Tabs, TabList } from "@similarweb/ui-components/dist/tabs";
import { ListItemMarket } from "@similarweb/ui-components/dist/list-item";
import {
    ICustomSegment,
    ICustomSegmentAccount,
    ICustomSegmentsGroup,
} from "services/segments/segmentsApiService";
import { ICustomSegmentMember, SegmentsUtils } from "services/segments/SegmentsUtils";
import { i18nFilter } from "filters/ngFilters";
import { ListItemSegment } from "pages/segments/components/ListItems";
import { ListItemCollapsibleSeparator, ScrollAreaWrapper } from "./AutocompleteDropdownTabs";
import {
    DropdownEmptyContentContainer,
    QueryBarAutocomplete,
    QueryBarAutocompleteContainer,
} from "./styledComponents";
import { MODE } from "../analysis/SegmentsAnalysisTrafficContainer";

const AUTOCOMPLETE_DEBOUNCE = 150;
const AUTOCOMPLETE_MAX_LIST_SIZE = 300;

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

const DropdownEmptyContent = ({ message, iconName = "no-search-results" }) => (
    <DropdownEmptyContentContainer>
        <SWReactIcons iconName={iconName} size="sm" />
        <span>{message}</span>
    </DropdownEmptyContentContainer>
);

const SegmentsDropdownContentComponent = ({ segments, selectItem }) => {
    const hasResults = React.useMemo(
        () => segmentsDropdownSections.some((sect) => segments[sect.key]?.length > 0),
        [segments],
    );

    return hasResults ? (
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
    ) : (
        <DropdownEmptyContent
            message={i18nFilter()("segments.querybar.dropdown.segments.noResults")}
        />
    );
};
const SegmentsDropdownContent = React.memo(SegmentsDropdownContentComponent);

const GroupsDropdownContentComponent = ({ groups, selectItem }) =>
    groups.length > 0 ? (
        <>
            {groups.slice(0, AUTOCOMPLETE_MAX_LIST_SIZE).map((item) => (
                <ListItemMarket
                    key={item.id}
                    text={item.name}
                    iconName="segment-folder"
                    onClick={() => selectItem(item)}
                />
            ))}
        </>
    ) : (
        <DropdownEmptyContent
            message={i18nFilter()("segments.querybar.dropdown.groups.noResults")}
        />
    );
const GroupsDropdownContent = React.memo(GroupsDropdownContentComponent);

const DropdownItemsContent: React.FC<{
    listItems: {
        _PROPS_: any;
        segments: { [key: string]: ICustomSegmentMember[] };
        groups: { [key: string]: ICustomSegmentsGroup[] };
    };
    onItemSelect: Function;
}> = ({ listItems, onItemSelect }) => {
    const { _PROPS_: listProps = undefined, segments = {}, groups = {} } = listItems;
    const { query, selectEntity, defaultTabIndex = 0 } = listProps || {};

    const scrollWrapperRef = React.useRef(null);
    React.useEffect(() => {
        scrollWrapperRef.current.scrollTop();
    }, [query]);

    const [selectedTabIdx, setSelectedTabIdx] = React.useState(defaultTabIndex);
    React.useEffect(() => {
        setSelectedTabIdx(defaultTabIndex);
    }, [defaultTabIndex]);
    const { selectSegment, selectGroup } = React.useMemo(
        () => ({
            selectSegment: (segment) => onItemSelect(() => selectEntity(MODE.single, segment)),
            selectGroup: (group) => onItemSelect(() => selectEntity(MODE.group, group)),
        }),
        [onItemSelect, selectEntity],
    );

    const [numQuerySegments, numQueryGroups] = React.useMemo(() => {
        const countSection = (sectionEntities) =>
            Object.entries<any[]>(sectionEntities).reduce(
                (acc, [_, segSectItems]) => acc + segSectItems.length,
                0,
            );
        return [countSection(segments), countSection(groups)];
    }, [segments, groups]);

    return (
        <div className="ListItemsContainer">
            <Tabs
                selectedIndex={selectedTabIdx}
                onSelect={setSelectedTabIdx}
                className="ListItemsTabs"
            >
                <TabList>
                    <Tab>Segments ({numQuerySegments})</Tab>
                    <Tab>Comparisons ({numQueryGroups})</Tab>
                </TabList>
                <TabPanel>
                    <ScrollAreaWrapper ref={scrollWrapperRef}>
                        <SegmentsDropdownContent segments={segments} selectItem={selectSegment} />
                    </ScrollAreaWrapper>
                </TabPanel>
                <TabPanel>
                    <ScrollAreaWrapper ref={scrollWrapperRef}>
                        <GroupsDropdownContent groups={groups.myGroups} selectItem={selectGroup} />
                    </ScrollAreaWrapper>
                </TabPanel>
            </Tabs>
        </div>
    );
};
const makeDropdownItemsContent = (props) => <DropdownItemsContent {...props} />;

interface ISegmentsQueryBarAutocompleteProps {
    mySegments: ICustomSegment[];
    accountSegments: ICustomSegmentAccount[];
    myGroups: ICustomSegmentsGroup[];
    navigateChangeEntity: (mode: string, entity: ICustomSegment | ICustomSegmentsGroup) => void;
    defaultTab?: string;
    closeFn: () => void;
}

export const SegmentsQueryBarAutocomplete = (props: ISegmentsQueryBarAutocompleteProps) => {
    const {
        mySegments,
        accountSegments,
        myGroups,
        navigateChangeEntity,
        defaultTab,
        closeFn,
    } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

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

    const selectEntity = React.useCallback(
        (mode, entity) => {
            navigateChangeEntity(mode, entity);
            closeFn();
        },
        [navigateChangeEntity, closeFn],
    );

    const getItemsStructured = React.useCallback(
        (query) => {
            const defaultTabIndex = { segments: 0, groups: 1 }[defaultTab];
            const items = {
                _PROPS_: { query, selectEntity, defaultTabIndex },
                segments: {
                    mySegments: mySegments.filter((segment) =>
                        SegmentsUtils.matchSegments.byQuery(segment, query),
                    ),
                    accountSegments: accountSegments.filter((segment) =>
                        SegmentsUtils.matchSegments.byQuery(segment, query),
                    ),
                },
                groups: {
                    myGroups: myGroups.filter((group) =>
                        SegmentsUtils.matchSegmentsGroups.byQuery(group, query),
                    ),
                },
            };
            return items;
        },
        [mySegments, accountSegments, myGroups],
    );

    return (
        <QueryBarAutocompleteContainer onKeyUpCapture={preventKeyUp}>
            <QueryBarAutocomplete
                className="QueryBarAutocomplete"
                floating={true}
                resetValueOnSelect={true}
                preventTruncateUnlessForced={true}
                getListItems={getItemsStructured}
                debounce={AUTOCOMPLETE_DEBOUNCE}
                placeholder={services.i18n("segments.querybar.autocomplete.placeholder")}
                renderItems={makeDropdownItemsContent}
                isFocused={true}
            />
        </QueryBarAutocompleteContainer>
    );
};
