import * as React from "react";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { IAutoCompleteItemProps, AutoComplete } from "./AutoComplete";
import { StaticSuggestionProvider } from "./StaticSuggestionProvider";
export class InputWithSuggestions extends InjectableComponentClass<{}, { value: string }> {
    constructor(props) {
        super(props);
    }

    onSelect = (item: IAutoCompleteItemProps) => {
        this.setState({ value: item.value });
    };

    render() {
        return (
            <div>
                <label htmlFor="autocomplete1">Input with suggestions</label>
                <AutoComplete
                    suggestionProvider={new StaticSuggestionProvider(["one", "two", "three"])}
                    onSelect={this.onSelect}
                    minSize={1}
                >
                    <input id="autocomplete1" style={{ width: 350 }} type="text" />
                </AutoComplete>
            </div>
        );
    }
}

InputWithSuggestions.register();
