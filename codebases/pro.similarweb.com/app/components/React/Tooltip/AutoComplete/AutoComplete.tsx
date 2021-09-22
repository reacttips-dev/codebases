import * as React from "react";
import * as PropTypes from "prop-types";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import * as ItemComponents from "./Stateless";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { AutoCompletePopup } from "./AutoCompletePopup";
import { ComponentsUtils } from "../../../ComponentsUtils";
import { ReactElement } from "react";

export interface SuggestionPromise {
    then: (resolve: (res: any) => void, reject?: (reason: string) => void) => void;
}
export interface ISuggestionProvider {
    getSuggestions(query: string): SuggestionPromise;
}
export type IAutoCompleteValue = string;
export interface IAutoCompleteItemProps {
    value: IAutoCompleteValue;
    query: string;
}

export interface IAutoCompleteItemComponentProps extends IAutoCompleteItemProps {
    children?: React.ReactNode;
}

export interface IAutoCompleteProps {
    itemComponent?: React.ReactType;
    emphasisComponent?: React.ReactType;
    onSelect: (item: IAutoCompleteItemProps) => void;
    suggestionProvider: ISuggestionProvider;
    debounce?: number;
    minSize?: number;
    width?: number;
    popupClass?: string;
}

/**
 * the component props
 */
interface IAutoCompleteState {
    selectedItem: number;
    data: IAutoCompleteValue[];
}
export class AutoComplete extends InjectableComponentClass<IAutoCompleteProps, IAutoCompleteState> {
    static propTypes = {
        itemComponent: PropTypes.func,
        emphasisComponent: PropTypes.func,
        onSelect: PropTypes.func.isRequired,
        suggestionProvider: PropTypes.object.isRequired,
        debounce: PropTypes.number,
        minSize: PropTypes.number,
        width: PropTypes.number,
        popupClass: PropTypes.string,
    };

    static defaultProps = {
        itemComponent: ItemComponents.SimpleItem,
        emphasisComponent: ItemComponents.StrongEmphasisComponent,
        debounce: 300,
        minSize: 2,
        popupClass: "",
    };

    private _autocompleteRoot;
    private get autocompleteRoot() {
        if (this._autocompleteRoot) {
            return this._autocompleteRoot;
        } else {
            this._autocompleteRoot = ComponentsUtils.createDomRoot("_autocompleteRootID");
            return this._autocompleteRoot;
        }
    }

    private inputElem: HTMLInputElement;

    constructor(props, state) {
        super(props, state);
        this.state = { selectedItem: 1, data: [] };
    }

    moveSelectedItem(up: boolean) {
        return up
            ? this.state.selectedItem === 0
                ? this.state.data.length
                : this.state.selectedItem - 1
            : this.state.selectedItem === this.state.data.length
            ? 0
            : this.state.selectedItem + 1;
    }

    onKeyUp(event: React.KeyboardEvent<any>) {
        switch (event.key) {
            case "ArrowDown":
                this.setState({
                    selectedItem: this.moveSelectedItem(false),
                    data: this.state.data,
                });
                event.preventDefault();
                return;
            case "ArrowUp":
                this.setState({ selectedItem: this.moveSelectedItem(true), data: this.state.data });
                event.preventDefault();
                return;
            case "Enter":
                const selectedValue = _.trim(
                    this.state.data[this.state.selectedItem - 1] || this.inputElem.value,
                );
                if (selectedValue) {
                    this.onSelect({ value: selectedValue });
                }
                event.preventDefault();
                return;
            case "Escape":
                this.setState({ selectedItem: 1, data: [] });
                return;
        }

        const value = this.inputElem.value;
        if (!value || value.length < this.props.minSize) return;
        this.getSuggestions();
    }

    getSuggestions = _.debounce(() => {
        this.props.suggestionProvider.getSuggestions(this.inputElem.value).then((res) => {
            if (res.query && res.query !== this.inputElem.value) return;
            this.setState({ data: res, selectedItem: 1 });
        });
    }, this.props.debounce);

    onBlur(event: React.FocusEvent<any>) {
        // blur event does not always provide relatedTarget
        const origin = (event.relatedTarget || document.activeElement) as HTMLElement;
        if (origin && origin.classList.contains("js-dropdown-menu-item")) return;
        this.setState({ selectedItem: 1, data: [] });
    }

    onSelect = (item) => {
        // this.inputElem.value = item.value;
        // this.inputElem.focus();
        this.setState({ selectedItem: 1, data: [] });
        this.props.onSelect(item);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.data.length && this.inputElem.value) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
    }

    showPopup() {
        const input = this.inputElem;
        const inputSize = input.getBoundingClientRect();
        const popupWidth = this.props.width || inputSize.width;

        const popup = (
            <AutoCompletePopup
                items={this.state.data}
                query={input.value}
                itemComponent={this.props.itemComponent}
                emphasisComponent={this.props.emphasisComponent}
                popupClass={this.props.popupClass}
                selectedItem={this.state.selectedItem}
                onSelect={this.onSelect}
                width={popupWidth}
                inputElem={input}
            />
        );

        ReactDOM.render(popup, this.autocompleteRoot);
    }

    hidePopup() {
        ReactDOM.unmountComponentAtNode(this.autocompleteRoot);
    }

    componentWillUnmount() {
        this.hidePopup();
    }

    render() {
        // attach listeners
        const inputElem: ReactElement = React.Children.only(this.props.children as ReactElement);
        if (inputElem.type != "input") {
            this.swLog.error("Autocomplete requires an input element");
        }

        return this.extendComponent(inputElem, {
            onKeyUp: this.onKeyUp,
            onBlur: this.onBlur,
            ref: (e) => (this.inputElem = e),
        });
    }

    private extendComponent(component, props) {
        const newProps = {};
        _.forEach(props, (newProp, prop) => {
            const origProp = component.props[prop];
            if (_.isFunction(newProp)) {
                newProps[prop] = function () {
                    const args = Array.prototype.slice.call(arguments);
                    origProp && origProp.apply(component, args);
                    newProp.apply(this, args);
                }.bind(this);
            } else {
                newProps[prop] = newProp;
            }
        });
        return React.cloneElement(component, newProps);
    }
}
