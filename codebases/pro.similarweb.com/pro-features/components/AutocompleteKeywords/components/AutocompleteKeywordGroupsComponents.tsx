import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import {
    NoResultsContainer,
    InnerTitleContainer,
} from "components/AutocompleteKeywords/styles/AutocompleteKeywordStyles";
import { SWReactIcons } from "@similarweb/icons";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import {
    IAutocompleteKeyword,
    IAutocompleteKeywordGroup,
} from "components/AutocompleteKeywords/types/AutocompleteKeywordGroupTypes";
import {
    ListItemKeyword,
    ListItemKeywordGroup,
    ListItemKeywordGroupShared,
} from "@similarweb/ui-components/dist/list-item";

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{ maxHeight: 400, minHeight: 0 }}
            verticalScrollbarStyle={{ borderRadius: 5 }}
            horizontal={false}
            smoothScrolling={true}
            minScrollSize={48}
            {...rest}
        >
            {children}
        </ScrollArea>
    );
};

export const NoKeywordResults = (props: { title: string }) => {
    return (
        <NoResultsContainer>
            <SWReactIcons iconName={"no-search-results"} size={"sm"} />
            <span>{props.title}</span>
        </NoResultsContainer>
    );
};

export const KeywordsSection = (props: {
    keywords: IAutocompleteKeyword[];
    isRecentSearches: boolean;
    renderOnItemClick: (item: IAutocompleteKeyword) => (e) => void;
    translate: (key: string) => string;
}) => {
    const { keywords, isRecentSearches, translate, renderOnItemClick } = props;

    if (!keywords || keywords.length === 0) {
        return <NoKeywordResults title={translate("autocompleteKeywordsGroup.noKeywordsFound")} />;
    }

    const TitleComponent = isRecentSearches ? (
        <InnerTitleContainer>
            {translate("autocompleteKeywordsGroup.keywordsTab.recentSearches")}
        </InnerTitleContainer>
    ) : null;

    const KeywordsComponent = keywords.map((item) => {
        return (
            <ListItemKeyword
                key={item.name}
                text={item.name}
                iconName={"search-keywords"}
                isActive={false}
                onClick={renderOnItemClick(item)}
            />
        );
    });

    return (
        <ScrollAreaWrap>
            {TitleComponent}
            {KeywordsComponent}
        </ScrollAreaWrap>
    );
};

export const KeywordsGroupSection = (props: {
    keywordGroups: IAutocompleteKeywordGroup[];
    sharedKeywordGroups: IAutocompleteKeywordGroup[];
    translate: (key: string) => string;
    renderOnItemClick: (item) => (e) => void;
    onEditClick: (item) => void;
    onShareClick: (item) => void;
}) => {
    const {
        keywordGroups,
        sharedKeywordGroups,
        translate,
        renderOnItemClick,
        onEditClick,
        onShareClick,
    } = props;

    const hasKeywordGroups = keywordGroups && keywordGroups.length > 0;
    const hasSharedKeywordGroups = sharedKeywordGroups && sharedKeywordGroups.length > 0;

    const hasGroupsData = hasKeywordGroups || hasSharedKeywordGroups;
    if (!hasGroupsData) {
        return (
            <NoKeywordResults title={translate("autocompleteKeywordsGroup.noKeywordGroupsFound")} />
        );
    }

    const renderGroupComponent = (item: IAutocompleteKeywordGroup) => {
        const Component = item.SharedWithMe ? ListItemKeywordGroupShared : ListItemKeywordGroup;
        return (
            <Component
                key={item.Name}
                text={item.Name}
                isActive={false}
                onClick={renderOnItemClick(item)}
                hasEditButton={!item.SharedWithMe}
                hasShareButton={!item.SharedWithMe}
                onEditButtonClick={() => onEditClick(item)}
                onShareButtonClick={() => onShareClick(item)}
            />
        );
    };

    const myGroupsComponent = hasKeywordGroups ? (
        <FlexColumn>
            <InnerTitleContainer>
                {translate("autocompleteKeywordsGroup.keywordsGroupTab.myGroups")}
            </InnerTitleContainer>
            {keywordGroups.map(renderGroupComponent)}
        </FlexColumn>
    ) : null;

    const sharedGroupsComponent = hasSharedKeywordGroups ? (
        <FlexColumn>
            <InnerTitleContainer>
                {translate("autocompleteKeywordsGroup.keywordsGroupTab.sharedGroups")}
            </InnerTitleContainer>
            {sharedKeywordGroups.map(renderGroupComponent)}
        </FlexColumn>
    ) : null;

    return (
        <ScrollAreaWrap>
            {myGroupsComponent}
            {sharedGroupsComponent}
        </ScrollAreaWrap>
    );
};
