import { ListItemKeyword } from "@similarweb/ui-components/dist/list-item";
import * as React from "react";
import { KeywordsAutocompleteStateless } from "../../../.pro-features/components/KeywordsAutocompleteStateless/src/KeywordsAutocompleteStateless";
import TranslationProvider from "../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { Injector } from "../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../filters/ngFilters";
import { ISuggestionProvider } from "../React/Tooltip/AutoComplete/AutoComplete";

interface IKeywordsAutocompleteProps {
    onClick: (keyword) => void;
    selectedKeyword: string;
    fastEnterFunc?: (e: string) => void;
    onKeyUp?: (e: string) => void;
}

export default class KeywordsAutocomplete extends React.PureComponent<
    IKeywordsAutocompleteProps,
    any
> {
    public service = Injector.get<ISuggestionProvider>("keywordsSuggestionProvider");
    public getListItems = (query) => {
        if (query != "") {
            return this.service.getSuggestions(query).then((suggestions) => {
                return suggestions.map((name, index) => {
                    return (
                        <ListItemKeyword
                            key={index}
                            onClick={this.onKeywordClick(name)}
                            text={name}
                        />
                    );
                });
            });
        } else {
            return [];
        }
    };

    public render() {
        const { onKeyUp, selectedKeyword, fastEnterFunc } = this.props;
        return (
            <TranslationProvider translate={i18nFilter()}>
                <KeywordsAutocompleteStateless
                    getListItems={this.getListItems as any}
                    selectedKeyword={selectedKeyword}
                    onKeyUp={onKeyUp}
                    fastEnterFunc={fastEnterFunc}
                />
            </TranslationProvider>
        );
    }

    private onKeywordClick = (keyword) => () => {
        this.props.onClick(keyword);
    };
}
