import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import { CircularLoader } from "components/React/CircularLoader/CircularLoader";
import * as _ from "lodash";

import { ListItems } from "./ListItems";
import { ListItemsTitle } from "./ListItemsTitle";
import { ListItemsInput } from "./ListItemsInput";
const Loader = (
    <CircularLoader
        options={{
            svg: {
                stroke: "#dedede",
                strokeWidth: "4",
                r: 21,
                cx: "50%",
                cy: "50%",
            },
            style: {
                width: 46,
                height: 46,
                position: "absolute",
                top: "calc(50% - 23px)",
                left: "calc(50% - 23px)",
            },
        }}
    />
);
export class ListItemsManager extends React.Component<any, any> {
    private _itemsInput: any;

    constructor(props, state) {
        super(props, state);
        this.onAddItem = this.onAddItem.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.state = {
            originalItems: props.list.items,
            focusAddNewItem: false,
            loader: false,
        };
    }

    onAddItem(text, trackAction = true) {
        if (text.split(/\s*,\s*/).length > 1) {
            return this.onPaste(text);
        } else {
            this.props.addItem({ text });
        }
        if (trackAction) {
            this.props.tracker.onAdd({ text });
        }
    }

    onPaste(rawText) {
        const { maxItems } = this.props;
        this.setState(
            {
                loader: true,
            },
            () => {
                setTimeout(() => {
                    const itemsFromPaste = _.trim(rawText)
                        .split(/\r\n?|\n|\s*,\s*/)
                        .slice(0, maxItems)
                        .sort()
                        .map((text) => ({ text }));
                    this.props.tracker.onPaste(itemsFromPaste);
                    this.props.addItems(itemsFromPaste);
                    this.setState({ loader: false });
                }, 500);
            },
        );
    }

    focusInput() {
        let $addNewItem = $(ReactDOM.findDOMNode(this._itemsInput)).find(".add-new-list-item");
        if (!$addNewItem.is(":focus")) {
            $addNewItem.focus();
        }
    }

    render() {
        const {
            list,
            itemsListTitle,
            maxItems,
            itemsListType,
            removeItem,
            validateExistingItem,
            onItemTextChanged,
            ListItemComponent,
            itemHeight,
            tracker,
        } = this.props;
        const currentListLength = list.items.length;
        const { items, isValid, errorMessage } = list;
        return (
            <div
                className={classNames("customCategoriesWizard-editor-container", {
                    "invalid-list": !isValid,
                })}
            >
                <ListItemsTitle
                    {...{
                        items,
                        itemsListTitle,
                        maxItems,
                        itemsListType,
                        currentListLength,
                        isValid,
                        errorMessage,
                    }}
                    tracker={tracker}
                />
                <div className="items-editor-box customCategoriesWizard-editor u-alignLeft">
                    <ListItemsInput
                        ref={(itemsInput) => (this._itemsInput = itemsInput)}
                        itemsListType={itemsListType}
                        onPaste={this.onPaste}
                        onAddItem={this.onAddItem}
                        tracker={tracker}
                    />
                    <ListItems
                        items={items}
                        removeItem={removeItem}
                        validateExistingItem={validateExistingItem}
                        onItemTextChanged={onItemTextChanged}
                        ListItemComponent={ListItemComponent}
                        itemHeight={itemHeight}
                        tracker={tracker}
                    />
                    <div className="bottom-shade customCategoriesWizard-bottom-shade"></div>
                    {this.state.loader && Loader}
                </div>
            </div>
        );
    }
}
