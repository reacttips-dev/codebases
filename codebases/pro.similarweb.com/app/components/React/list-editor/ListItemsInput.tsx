import * as React from "react";
import * as _ from "lodash";
import { ISuggestionProvider, AutoComplete } from "../Tooltip/AutoComplete/AutoComplete";
import { KeywordItem } from "../Tooltip/AutoComplete/Stateless";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { AddItemInputTitle } from "./AddItemInputTitle";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";

const WizardAddButtonContainer: any = styled.div`
    position: absolute;
    top: 10px;
    right: 12px;
    width: 24px;
    transition: color 0.2s linear;
    cursor: pointer;
`;

export class ListItemsInput extends InjectableComponent {
    private keywordsSuggestionProvider: ISuggestionProvider;

    constructor(props, state) {
        super(props, state);
        this.keywordsSuggestionProvider = this.injector.get("keywordsSuggestionProvider");
        this.onChange = this.onChange.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuggestionSelect = this.onSuggestionSelect.bind(this);
        this.state = {
            inputText: "",
        };
    }

    onChange(e) {
        this.setState({
            inputText: e.target.value,
        });
    }

    private addItem(text) {
        if (text.length) {
            this.props.onAddItem(_.trim(text));
            this.setState({
                inputText: "",
            });
        }
    }

    onSubmit(e) {
        this.addItem(this.state.inputText);
        e.preventDefault();
    }

    onPaste(e) {
        this.props.onPaste(_.trim(e.clipboardData.getData("Text")));
        e.preventDefault();
    }

    onSuggestionSelect(item) {
        this.addItem(item.value);
    }

    render() {
        const { itemsListType } = this.props;
        const { inputText } = this.state;
        const emptyText = inputText.length === 0;

        return (
            <div className="customCategoriesWizard-editor-add-domain add-list-item">
                <form onSubmit={(e) => e.preventDefault()} style={{ margin: 0 }}>
                    <AutoComplete
                        suggestionProvider={this.keywordsSuggestionProvider}
                        itemComponent={KeywordItem}
                        popupClass="keyword-suggestions"
                        onSelect={this.onSuggestionSelect}
                    >
                        <input
                            className="add-new-list-item"
                            onChange={this.onChange}
                            onPaste={this.onPaste}
                            tabIndex={2}
                            value={this.state.inputText}
                            type="text"
                        />
                    </AutoComplete>
                    {emptyText ? (
                        <AddItemInputTitle itemsListType={itemsListType} />
                    ) : (
                        <WizardAddButtonContainer onClick={this.onSubmit}>
                            <SWReactIcons iconName="add" size="sm" />
                        </WizardAddButtonContainer>
                    )}
                    <div className="customCategoriesWizard-add-domain-bar" />
                </form>
            </div>
        );
    }
}
