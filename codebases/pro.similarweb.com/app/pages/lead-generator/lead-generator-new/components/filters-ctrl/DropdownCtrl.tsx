import { Dropdown, CheckboxDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { Component } from "react";

interface IDropdownCtrlProps {
    filters: any;
    onToggle?(isOpen): void;
    onChange?(item): void;
}

interface IDropdownCtrlState {
    selectedFilters: any;
}

class DropdownCtrl extends Component<IDropdownCtrlProps, IDropdownCtrlState> {
    constructor(props) {
        super(props);

        const selectedFilters = {};
        props.filters.forEach((filter) => {
            if (filter.getValue() !== filter.initValue) {
                selectedFilters[filter.stateName] = true;
                filter.hideInBox = false;
            } else {
                filter.hideInBox = true;
            }
            filter.setValue({ [filter.stateName]: filter.getValue() });
        });

        this.state = {
            selectedFilters,
        };
    }

    public static defaultProps = {
        onToggle: _.noop,
        onChange: _.noop,
    };

    private onClickFilter = (clickedItem) => {
        const clickedFilterSelected = !this.state.selectedFilters[clickedItem.id];
        this.setState({
            selectedFilters: {
                ...this.state.selectedFilters,
                [clickedItem.id]: clickedFilterSelected,
            },
        });
        const clickedFilter = this.props.filters.find(
            (filter) => filter.stateName === clickedItem.id,
        );
        clickedFilter.hideInBox = !clickedFilterSelected;
        clickedFilter.setValue({ [clickedFilter.stateName]: clickedFilter.initValue });
        this.props.onChange({
            id: clickedItem.id,
            type: clickedFilterSelected ? "add" : "remove",
        });
    };

    public render() {
        return (
            <Dropdown
                selectedIds={this.state.selectedFilters}
                itemsComponent={CheckboxDropdownItem}
                onClick={this.onClickFilter}
                closeOnItemClick={false}
                onToggle={this.props.onToggle}
                buttonWidth="auto"
            >
                {[
                    <IconButton key="CountryButton1" type="flat" iconName="add">
                        {i18nFilter()("grow.lead_generator.new.demographic.age_group.add")}
                    </IconButton>,
                    ...this.props.filters.map((crrAge) => ({
                        id: crrAge.stateName,
                        text: i18nFilter()(crrAge.title),
                    })),
                ]}
            </Dropdown>
        );
    }
}

export default DropdownCtrl;
