import React from "react";
import { QueryBarGroupItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarGroupItem";
import { IKeywordGroup } from "components/compare/KeywordsQueryBar/KeywordsQueryBarTypes";
import { ItemContainer, KeywordContainer } from "../KeywordsQueryBarStyles";
import { useState } from "react";
import { SwNavigator } from "common/services/swNavigator";
import { EditGroupButton } from "./EditGroup";
import { KEYWORD, KEYWORD_GROUP } from "../constants";
import { AddToGroupButton } from "./AddToGroup";
import { OpenLinkButton } from "./OpenLinkButton";

export type ServicesType = {
    translate: (key: string, obj?: any, defaultValue?: string) => string;
    swNavigator: SwNavigator;
};
interface IKeywordsQueryBarItemProps {
    keyword?: string;
    keywordGroup?: IKeywordGroup;
    isKeywordMode: boolean;
    secondaryText?: string;
    onItemClick: () => void;
    showButtons: boolean;
    showSearch: boolean;
    services: {
        translate: (key: string, obj?: any, defaultValue?: string) => string;
        swNavigator: SwNavigator;
    };
}

export const KeywordsQueryBarItem = ({
    keyword,
    keywordGroup,
    isKeywordMode,
    showButtons,
    onItemClick,
    services,
    secondaryText,
    showSearch,
}: IKeywordsQueryBarItemProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const googleLink = `https://www.google.com/search?q=${keyword}`;

    const renderButtons = () => {
        // In case we selected a keyword - show keyword action buttons
        if (isKeywordMode) {
            return (
                <>
                    {
                        <AddToGroupButton
                            isDropdownOpen={isDropdownOpen}
                            keyword={keyword}
                            services={services}
                            setIsDropdownOpen={setIsDropdownOpen}
                        />
                    }
                    {showSearch && <OpenLinkButton googleLink={googleLink} />}
                </>
            );
        }

        // otherwise - show edit keyword group button, in case
        // where the group is my group. (not a shared group);
        return keywordGroup?.isShared ? null : (
            <EditGroupButton services={services} keywordGroup={keywordGroup} />
        );
    };

    return (
        <ItemContainer>
            <KeywordContainer>
                <QueryBarGroupItem
                    text={isKeywordMode ? keyword : keywordGroup?.text}
                    icon={isKeywordMode ? "search" : "nav-keyword-group"}
                    onItemClick={onItemClick}
                    // Either display secondaryText from props or decide by isKeywordMode prop
                    secondaryText={
                        !!secondaryText ? secondaryText : isKeywordMode ? KEYWORD : KEYWORD_GROUP
                    }
                />
            </KeywordContainer>
            {showButtons && renderButtons()}
        </ItemContainer>
    );
};
