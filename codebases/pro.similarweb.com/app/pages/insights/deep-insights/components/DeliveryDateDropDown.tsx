import React from "react";
import dayjs from "dayjs";
import _ from "lodash";

import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";

import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { DeliveryDateItem } from "pages/insights/deep-insights/types";
import { SwTrack } from "services/SwTrack";

export class DeliveryDateDropDown extends InjectableComponentClass<any, any> {
    private items: DeliveryDateItem[];
    private defaultTitle: string;

    constructor() {
        super();
        this.defaultTitle = this.i18n("DeepInsights.DeliveryDropDown.Title");

        this.state = {
            selectedItem: {
                title: this.defaultTitle,
                id: null,
                value: null,
                item: {},
            },
        };

        this.select = this.select.bind(this);
        this.toggle = this.toggle.bind(this);
        this.unselect = this.unselect.bind(this);

        this.items = new Array<DeliveryDateItem>(
            new DeliveryDateItem("ALL", 0, "", this.i18n("DeepInsights.DeliveryDropDown.AllDates")),
            new DeliveryDateItem(
                "TM",
                dayjs().date(),
                "d",
                this.i18n("DeepInsights.DeliveryDropDown.ThisMonth"),
            ),
            new DeliveryDateItem(
                "LM",
                1,
                "M",
                this.i18n("DeepInsights.DeliveryDropDown.LastMonth"),
            ),
        );
    }

    componentDidMount(): void {
        this.preselect(this.props.initialType);
    }

    public preselect = (itemId) => {
        const item: DeliveryDateItem = _.find<DeliveryDateItem>(this.items, { id: itemId });
        if (item == null) {
            return;
        }
        const { title, id } = item;
        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    selectedItem: {
                        title: title,
                        id: id,
                        item: { [id]: true },
                    },
                };
            },
            () => {
                this.props.applyFilters(this.getCurrentSelectedItem());
            },
        );
    };

    public select = (newItem) => {
        SwTrack.all.trackEvent(
            "Drop down",
            "click",
            `filter/Delivery date/${newItem.children.props.children}`,
        );

        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    selectedItem: {
                        title: newItem.children,
                        id: newItem.id,
                        item: { [newItem.id]: true },
                    },
                };
            },
            () => {
                this.props.applyFilters(this.getCurrentSelectedItem());
            },
        );
    };

    public getCurrentSelectedItem = () => {
        const selectedId: string = this.state.selectedItem.id;
        if (selectedId === "ALL") {
            return new DeliveryDateItem();
        }

        const item: DeliveryDateItem = _.find(this.items, (obj: DeliveryDateItem) => {
            return obj.id === selectedId;
        });

        return item || new DeliveryDateItem();
    };

    public unselect = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedItem: {
                    title: this.defaultTitle,
                    item: {},
                },
            };
        });
    };

    private toggle = (isOpen) => {
        if (isOpen) {
            SwTrack.all.trackEvent("Drop down", "open", "filter/Delivery date");
        }
    };

    private renderItems = () => {
        const simpleDropdownItems = this.items.map((item, index) => {
            return (
                <SimpleDropdownItem key={index} id={item.id}>
                    <I18n>{item.title}</I18n>
                </SimpleDropdownItem>
            );
        });
        return [
            <DropdownButton key="delivery-date-drp-btn" width={180}>
                {this.state.selectedItem.title}
            </DropdownButton>,
        ].concat(simpleDropdownItems);
    };

    render(): JSX.Element {
        return (
            <section>
                <Dropdown
                    selectedIds={this.state.selectedItem.item}
                    onClick={this.select}
                    onToggle={this.toggle}
                >
                    {this.renderItems()}
                </Dropdown>
            </section>
        );
    }
}
