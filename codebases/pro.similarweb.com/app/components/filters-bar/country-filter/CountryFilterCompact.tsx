import * as React from "react";
import { PureComponent } from "react";
import { ICountryObject } from "../../../services/CountryService";
import autobind from "autobind-decorator";
import "./CountryFilter.scss";
import { SidebarListCompactElement } from "@similarweb/ui-components/dist/responsive-filters-bar";
import { CountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";

export interface ICountryFilterCompactProps {
    onChange?: (item, cb) => () => void;
    onChangeCallBack?: (country) => void;
    countries: ICountryObject[];
    onClick?: (params?) => void;
    selectedCountry?: { [id: number]: boolean };
    countryItemHeight?: number;
}
export const CountryFilterCompactItem = (props) => (
    <div
        className="CountryFilterCompactItem"
        onClick={
            props.onClick &&
            props.onClick({
                onChange: props.onChange,
            })
        }
    >
        <CountryDropdownItem
            {...props.country}
            selected={props.selectedCountry[props.country.id]}
            wrapper={ContactUsItemWrap}
        />
    </div>
);

export class CountryFilterCompact extends PureComponent<ICountryFilterCompactProps, any> {
    static defaultProps = {
        onChange: () => null,
        countryItemHeight: 48,
    };

    private scrollAreaElement: any;

    constructor(props, context) {
        super(props, context);

        this.state = {
            searchTerm: "",
            shouldScrollToSelected: true,
        };
    }

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
    }

    componentDidMount() {
        this.scrollToSelectedCountry();
    }

    componentDidUpdate() {
        this.scrollToSelectedCountry();
    }

    render() {
        return [
            <div
                key="country-filter-compact-0"
                className="CountryFilterCompact DropdownContent-searchContainer u-flex-row"
            >
                <input
                    className="DropdownContent-search"
                    onChange={this.onSearch}
                    placeholder="Search"
                />
                <span className="DropdownContent-searchIcon u-flex-row u-flex-center">
                    <i className="icon icon-search" />
                </span>
            </div>,
            <SidebarListCompactElement
                hasScroll={true}
                scrollAreaRef={this.setScrollAreaRef}
                minScrollHeight={48}
                shouldScrollToSelected={this.state.shouldScrollToSelected}
                onClick={this.props.onClick}
                key="country-filter-compact-1"
            >
                {this.getItems(this.state.searchTerm)}
            </SidebarListCompactElement>,
        ];
    }

    @autobind
    private setScrollAreaRef(ref) {
        this.scrollAreaElement = ref;
    }

    @autobind
    private scrollToSelectedCountry() {
        if (this.state.shouldScrollToSelected) {
            const countryItemHeight = this.props.countryItemHeight;
            const ids = this.getItemsIds();
            const currentActiveIndex = Object.keys(this.props.selectedCountry)[0];
            const newActiveId = ids.indexOf(+currentActiveIndex);

            setTimeout(() => {
                this.scrollAreaElement.scrollYTo(newActiveId * countryItemHeight);
            }, 20);
        }
    }

    @autobind
    private onSearch(event) {
        this.scrollAreaElement.scrollTop();
        const searchTerm = event.target.value;
        this.setState({
            searchTerm,
        });
    }

    private getItems(term?: string) {
        return (
            this.props.countries
                // search filter
                .filter(
                    (country: ICountryObject) =>
                        !term || country.text.toLowerCase().indexOf(term.toLowerCase()) > -1,
                )
                // convert object items to JSX
                .map((country: ICountryObject, index) => (
                    <CountryFilterCompactItem
                        country={country}
                        key={index}
                        onChange={this.props.onChange(country, this.props.onChangeCallBack)}
                        selectedCountry={this.props.selectedCountry}
                    />
                ))
        );
    }

    private getItemsIds() {
        return this.props.countries.map((country) => {
            return country.id;
        });
    }
}
