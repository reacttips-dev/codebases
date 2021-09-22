import * as React from "react";
import * as _ from "lodash";
import { Component } from "react";
import { TubeSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip.tsx";
import * as classNames from "classnames";
import { i18nFilter } from "filters/ngFilters";
//todo: interfaces + types + tests
const iconsSet = {
    MobileWeb: "icon-mobile-web",
    Desktop: "icon-desktop",
    Total: "icon-combined",
    BarChart: "icon-chart-bar",
    Graph: "icon-chart-line",
    PieChart: "icon-chart-pie",
    Table: "icon-list",
    SingleMetric: "icon-single-metric",
};

export interface IStatefullIconSwitcherItem {
    text: string;
    id: string;
    disabled: boolean;
    upgrade: boolean;
}

export class StatefullIconSwitcher extends Component<any, any> {
    public static defaultProps = {
        clickItemTracking: (item) => null,
        clickedItemProperty: (item) => item.id,
    };

    public static getDerivedStateFromProps(props, state) {
        const newSelection = _.findIndex(props.items, (item: any) => item.id === props.selected);
        if (state.selected !== newSelection) {
            return {
                selected: newSelection,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            selected: _.findIndex(props.items, (item: any) => item.id === props.selected),
        };
    }

    public onItemClicked = (item) => {
        this.props.clickItemTracking(item);
        let _item = this.props.items[item];
        if (_item.disabled) return;
        this.setState({
            selected: item,
        });
        this.props.onItemClicked(this.props.clickedItemProperty(_item));
    };

    public render() {
        return (
            <Switcher
                customClass="TubeSwitcher"
                onItemClick={this.onItemClicked}
                selectedIndex={this.state.selected}
            >
                {this.props.items.map((item: IStatefullIconSwitcherItem, index) => (
                    <PlainTooltip
                        key={index}
                        placement={"top"}
                        text={i18nFilter()(item.text)}
                        cssClass="plainTooltip-element"
                    >
                        <div>
                            <TubeSwitcherItem
                                customClass={classNames("icon", iconsSet[item.id], {
                                    upgrade: item.upgrade,
                                })}
                                selected={index === this.state.selected}
                                disabled={item.disabled}
                            />
                        </div>
                    </PlainTooltip>
                ))}
            </Switcher>
        );
    }
}
