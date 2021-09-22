/**
 * Created by dannyr on 30/11/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import { IAutoCompleteItemProps, IAutoCompleteValue } from "./AutoComplete";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";

interface IAutoCompletePopupProps {
    itemComponent: React.ReactType;
    emphasisComponent: React.ReactType;
    onSelect: (item: IAutoCompleteItemProps) => void;
    items: IAutoCompleteValue[];
    query: string;
    popupClass: string;
    width: number;
    selectedItem: number;
    inputElem: HTMLInputElement;
}

interface IAutoCompletePopupState {
    top: number;
    left: number;
}

export class AutoCompletePopup<T> extends InjectableComponentClass<
    IAutoCompletePopupProps,
    IAutoCompletePopupState
> {
    static propTypes = {
        itemComponent: PropTypes.func.isRequired,
        emphasisComponent: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired,
        query: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        popupClass: PropTypes.string,
        selectedItem: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
        inputElem: PropTypes.instanceOf(HTMLInputElement),
    };

    private $position: any;
    private popupElem: HTMLUListElement;

    constructor(props, state) {
        super(props, state);
        this.state = { top: -500, left: -500 };
        this.$position = this.injector.get("$position");
    }

    onSelect(item: IAutoCompleteItemProps) {
        return (evt) => this.props.onSelect(item);
    }

    reposition() {
        const appendToBody = true;
        const posResult: {
            top: number;
            left: number;
            placement: string;
        } = this.$position.positionElements(
            this.props.inputElem,
            this.popupElem,
            "auto bottom",
            appendToBody,
        );
        this.setState({ top: posResult.top, left: posResult.left });
    }

    componentDidMount() {
        this.reposition();
    }

    createItemContent(props: IAutoCompleteItemProps) {
        const regExp = new RegExp(`(${props.query})`, "g");
        let current = 0;
        const res = [];

        // traverse occurrences
        props.value.replace(regExp, (match: string, group: string, offset: number) => {
            res.push(props.value.substring(current, offset));
            res.push(
                <this.props.emphasisComponent key={offset} value={props.value} query={props.query}>
                    {props.query}
                </this.props.emphasisComponent>,
            );
            current = offset + props.query.length;
            return "";
        });

        // add rest
        res.push(props.value.substring(current));

        return res;
    }

    render() {
        let items = this.props.items.map((item, i) => {
            let classes = classNames("js-dropdown-menu-item", {
                active: this.props.selectedItem == i + 1,
            });
            return (
                <li
                    className={classes}
                    key={item}
                    tabIndex={i + 1}
                    onClick={this.onSelect({ value: item, query: this.props.query })}
                >
                    <this.props.itemComponent value={item} query={this.props.query}>
                        {this.createItemContent({ value: item, query: this.props.query })}
                    </this.props.itemComponent>
                </li>
            );
        });
        return (
            <ul
                className={"typeahead dropdown-menu " + this.props.popupClass}
                ref={(e) => (this.popupElem = e)}
                style={{
                    position: "absolute",
                    top: this.state.top,
                    left: this.state.left,
                    width: this.props.width,
                }}
            >
                {items}
            </ul>
        );
    }
}
