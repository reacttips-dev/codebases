import React, { FunctionComponent, useMemo } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { ItemContainer } from "components/compare/KeywordsQueryBar/KeywordsQueryBarStyles";
import { Injector } from "common/ioc/Injector";
import { KeywordsQueryBar } from "components/compare/KeywordsQueryBar/KeywordsQueryBar";
import { SwNavigator } from "common/services/swNavigator";

interface IKeywordResearchHeaderProps {
    keyword: string;
    secondaryText: string;
}

const KeywordResearchHeader: FunctionComponent<IKeywordResearchHeaderProps> = ({
    keyword,
    secondaryText,
}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const translate = useMemo(i18nFilter, []);

    const onSearchItemClick = (item: string) => {
        swNavigator.go(swNavigator.current(), {
            keyword: item,
        });
    };
    return (
        <ItemContainer>
            <KeywordsQueryBar
                showKeywordGroups={false}
                onSearchItemClick={onSearchItemClick}
                isKeywordMode
                isLoading={false}
                secondaryText={translate(secondaryText)}
                selectedKeyword={keyword}
                showButtons={false}
                preventCloseOnEmptyValue={true}
            />
        </ItemContainer>
    );
};

SWReactRootComponent(KeywordResearchHeader, "KeywordResearchHeader");
export default KeywordResearchHeader;
