import * as React from "react";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { IAutoCompleteItemProps, AutoComplete } from "./AutoComplete";
import * as ItemComponents from "./Stateless";
export class KeywordInputWithSuggestions extends InjectableComponentClass<{}, { value: string }> {
    constructor(props) {
        super(props);
    }

    onSelect = (item: IAutoCompleteItemProps) => {
        this.setState({ value: item.value });
    };

    render() {
        return (
            <div>
                <label htmlFor="autocomplete2">Input with keyword suggestions</label>
                <AutoComplete
                    suggestionProvider={this.injector.get("keywordsSuggestionProvider")}
                    itemComponent={ItemComponents.KeywordItem}
                    popupClass="keyword-suggestions"
                    onSelect={this.onSelect}
                >
                    <input
                        id="autocomplete2"
                        style={{ width: 350 }}
                        className="add-new-list-item"
                        type="text"
                    />
                </AutoComplete>
            </div>
        );
    }
}

KeywordInputWithSuggestions.register();
