/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import SWReactRootComponent from "decorators/SWReactRootComponent";

@SWReactRootComponent
export class SearchInput extends React.Component<any, any> {
    static propTypes = {
        searchString: PropTypes.string,
        placeholder: PropTypes.string,
        onSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        searchString: "",
        placeholder: "",
    };

    render() {
        return (
            <div className="dropdown-search">
                <label className="search-icon"></label>
                <input
                    type="text"
                    className="search-input"
                    value={this.props.searchString}
                    onChange={this.props.onSearch}
                    role="combobox"
                    placeholder={this.props.placeholder}
                    onClick={(event) => event.stopPropagation()}
                />
            </div>
        );
    }
}
