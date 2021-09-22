/**
 * Created by Daniel.Danieli on 4/13/2017.
 */

import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as PropTypes from "prop-types";
import * as React from "react";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { InputTextDefault } from "../../InputTextDefault/InputTextDefault";

@SWReactRootComponent
export class TableSearch extends InjectableComponent {
    public onChangeTimer: any;

    public static propTypes = {
        onSearch: PropTypes.func.isRequired,
        inputText: PropTypes.string,
        searchInterval: PropTypes.number,
    };

    public static defaultProps = {
        inputText: "",
        searchInterval: 500,
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: this.props.inputText,
        };
    }

    public render() {
        return (
            <InputTextDefault
                inputText={this.state.inputText}
                iconName="search"
                onChange={this.onChange}
                placeholder={this.i18n("analysis.common.trafficdest.out.placeholder")}
            />
        );
    }

    public onChange = (e) => {
        //call onSearch only when user finish typing input (debounce)
        const value = e.target.value;
        this.setState({ inputText: value });
        clearTimeout(this.onChangeTimer);

        this.onChangeTimer = setTimeout(() => {
            this.props.onSearch(value);
        }, this.props.searchInterval);
    };
}
