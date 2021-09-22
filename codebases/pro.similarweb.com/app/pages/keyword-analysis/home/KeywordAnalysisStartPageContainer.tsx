import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { IconButton } from "@similarweb/ui-components/dist/button";
import HomepageKeywordGroupItem from "@similarweb/ui-components/dist/homepages/common/UseCaseHomepageItems/HomepageKeywordListItem";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import I18n from "components/WithTranslation/src/I18n";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { KeywordAnalysisStartPage } from "pages/module start page/src/keyword analysis/KeywordAnalysisStartPage";
import { string } from "prop-types";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { Tab, TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import { KeywordsGroupEditorModal } from "../KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const DEFAULT_PAGE_STATE = "keywordAnalysis_overview";

interface IKeywordAnalysisStartPageContainer {
    pageState?: string;
    subtitlePosition?: string;
    title: string;
    subtitle: string;
    bodyText?: string;
    ctaButtonText?: string;
}

const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

const TabsContainer = styled.span`
    > div {
        display: inline-block;
    }
`;

const KeywordAnalysisStartPageContainer: FunctionComponent<IKeywordAnalysisStartPageContainer> = ({
    pageState,
    subtitlePosition,
    title,
    subtitle,
    ctaButtonText,
}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [keywordGroups, setKeywordGroups] = useState([]);
    const [sharedKeywordGroups, setSharedKeywordGroups] = useState([]);
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();

    const onSelectedTabChange = (index) => {
        setSelectedTab(index);
    };

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<any>("swNavigator"),
            keywordsGroupsService: keywordsGroupsService,
            i18n: i18nFilter(),
        };
    }, []);

    const homepageProps = {
        subtitlePosition,
        title,
        subtitle,
        bodyText: (
            <TabsContainer>
                <Tabs selectedIndex={selectedTab} onSelect={onSelectedTabChange}>
                    <TabList>
                        <Tab>
                            {services.i18n(
                                "marketintelligence.marketresearch.keywordmarket.home.mylists",
                                { count: keywordGroups.length },
                            )}
                        </Tab>
                        <Tab>
                            {services.i18n(
                                "marketintelligence.marketresearch.keywordmarket.home.sharedlists",
                                { count: sharedKeywordGroups.length },
                            )}
                        </Tab>
                    </TabList>
                </Tabs>
            </TabsContainer>
        ),
    };

    useEffect(() => {
        setKeywordGroups(services.keywordsGroupsService.userGroups.sort(sortGroups));
        setSharedKeywordGroups(services.keywordsGroupsService.getSharedGroups().sort(sortGroups));
    }, [services.keywordsGroupsService.userGroups]);

    const PlaceholderComponent = () => (
        <PlaceholderText>
            {services.i18n("marketintelligence.marketresearch.keywordmarket.home.searchText")}{" "}
            <BoldPlaceholderText>
                {services.i18n("marketintelligence.marketresearch.keywordmarket.home.searchItem")}
            </BoldPlaceholderText>
        </PlaceholderText>
    );

    const sortGroups = (a, b) => {
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
            return -1;
        }
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
            return 1;
        }
        return 0;
    };

    const replaceGroup = (currentGroupIndex, modifiedGroup) => {
        const firstHalfWithoutGroup = keywordGroups.slice(0, currentGroupIndex);
        const secondHalfWithoutGroup = keywordGroups.slice(currentGroupIndex + 1);
        setKeywordGroups([...firstHalfWithoutGroup, modifiedGroup, ...secondHalfWithoutGroup]);
    };

    const mergeNewGroupIntoList = (newGroup) => {
        const clone = keywordGroups.map((group) => group);
        const groupsSortedByName = _.concat(clone, newGroup).sort(sortGroups);
        setKeywordGroups(groupsSortedByName);
    };

    const handleSave = (modifiedOrNewGroup) => {
        const index = keywordGroups.findIndex((kw) => kw.Id === modifiedOrNewGroup.Id);
        // the group existed and was edited
        if (index !== -1) {
            replaceGroup(index, modifiedOrNewGroup);
        } else {
            // a new group was created
            mergeNewGroupIntoList(modifiedOrNewGroup);
        }
    };

    const handleEditClick = (item) => {
        setKeywordGroupToEdit(item);
        setIsOpen(true);
    };

    const onNewKeywordGroupClick = () => {
        handleEditClick({});
        TrackWithGuidService.trackWithGuid(
            "solutions2.marketintelligence.marketresearch.keywordmarket.home.createNewGroup",
            "open",
        );
    };

    const handleHomepageItemClick = (item) => () => {
        TrackWithGuidService.trackWithGuid(
            "solutions2.marketintelligence.marketresearch.keywordmarket.home.select",
            "click",
            { keywordOrGroup: item.Id ? `*${item.Name}` : item.name, type: item.type },
        );
        onItemClick(item);
    };

    const handleSearchItemClick = (item) => () => {
        TrackWithGuidService.trackWithGuid(
            "marketintelligence.marketresearch.keywordmarket.home.select.search.bar",
            "click",
            { keywordOrGroup: item.Id ? `*${item.Name}` : item.name, type: item.type },
        );
        onItemClick(item);
    };
    const onItemClick = (item) => {
        const defaultParams =
            swSettings.components[services.swNavigator.getState(pageState).configId].defaultParams;
        services.swNavigator.go(pageState, {
            ...defaultParams,
            keyword: item.Id ? `*${item.Id}` : item.name,
            webSource: "Total",
        });
    };

    const createHomepageItems = () => {
        const list = selectedTab === 0 ? keywordGroups : sharedKeywordGroups;
        const type = selectedTab === 0 ? "My List" : "Shared List";
        return list?.map((item) => {
            return (
                <HomepageKeywordGroupItem
                    key={item.Id}
                    id={item.Id}
                    groupName={item.Name}
                    keywordCount={item.Keywords.length}
                    onItemClick={handleHomepageItemClick({ ...item, type })}
                    onEditClick={selectedTab === 0 ? handleEditClick.bind(null, item) : null}
                />
            );
        });
    };

    const ctaButton = [
        <IconButton key="button-1" type="outlined" iconName="add" onClick={onNewKeywordGroupClick}>
            <I18n>{ctaButtonText}</I18n>
        </IconButton>,
    ];

    return (
        <TranslationProvider translate={services.i18n}>
            <KeywordAnalysisStartPage
                listButtons={ctaButton}
                listItems={createHomepageItems()}
                handleItemClick={handleSearchItemClick}
                autocompletePlaceholder={PlaceholderComponent()}
                {...homepageProps}
            />
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onSave={handleSave}
            />
        </TranslationProvider>
    );
};

KeywordAnalysisStartPageContainer.propTypes = {
    pageState: string,
    subtitlePosition: string,
    title: string,
    subtitle: string,
    bodyText: string,
    ctaButtonText: string,
};

KeywordAnalysisStartPageContainer.defaultProps = {
    pageState: DEFAULT_PAGE_STATE,
    subtitlePosition: "left-aligned",
    bodyText: "marketintelligence.marketresearch.keywordmarket.home.listTitle",
    ctaButtonText: "marketintelligence.marketresearch.keywordmarket.cta.button",
};

export default SWReactRootComponent(
    connect(null, null)(KeywordAnalysisStartPageContainer),
    "KeywordAnalysisStartPageContainer",
);
