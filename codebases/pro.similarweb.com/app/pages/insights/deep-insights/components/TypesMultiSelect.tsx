import * as PropTypes from "prop-types";
import * as React from "react";
import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";

import {
    Dropdown,
    DropdownButton,
    CheckboxDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { IReportType, ReportType } from "pages/insights/deep-insights/types";
import { SwTrack } from "services/SwTrack";

export class TypesMultiSelect extends InjectableComponentClass<any, any> {
    private defaultLabel: string;
    private allKey = "ALL";

    public static propTypes = {
        initialSelection: PropTypes.object,
        reportsTypes: PropTypes.array,
    };

    constructor(props: any) {
        super(props);
        this.defaultLabel = this.i18n("DeepInsights.Filters.ReportType.DropdownLabel");
        const items: IReportType[] = props.reportsTypes.map((t) => new ReportType(t.Key, t.Name));
        const allItemInArray: IReportType[] = new Array<IReportType>(
            new ReportType(this.allKey, "All Report Types"),
        );

        this.state = {
            selectedIds: props.initialSelection || {},
            selectedTypeName: this.defaultLabel,
            reporTypes: allItemInArray.concat(items),
            skipUrlParams: false,
        };
        this.onClick = this.onClick.bind(this);
    }

    public getItems = () => {
        return this.state.reporTypes;
    };

    UNSAFE_componentWillReceiveProps(newProps: any, oldProps: any): void {
        if (
            !this.state.skipUrlParams &&
            newProps.selectedTypeId &&
            newProps.selectedTypeId.length
        ) {
            const stateSelection: any = {};
            newProps.selectedTypeId.forEach((item) => {
                stateSelection[item] = true;
            });

            const label: string = this.getCheckboxLabel(newProps.selectedTypeId);

            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectedIds: stateSelection,
                    selectedTypeName: label,
                    skipUrlParams: true,
                };
            });
        }
    }

    public unselectAllTypes = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedIds: {},
                selectedTypeName: this.defaultLabel,
            };
        });
    };

    public onClick = (newItem) => {
        const selectedIds: string[] = this.state.selectedIds;
        const isChecked = !selectedIds[newItem.id];
        const trackingText = `filter/reports type/${newItem.children}`;
        SwTrack.all.trackEvent("Drop down", isChecked ? "add" : "remove", trackingText);
        if (newItem.id === this.allKey) {
            const stateSelection: any = {};

            this.getItems().forEach((item: IReportType) => {
                stateSelection[item.Id] = isChecked;
            });

            const newLabel: string = isChecked ? newItem.children : this.defaultLabel;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectedTypeName: newLabel,
                    selectedIds: stateSelection,
                };
            });

            return;
        }

        const _allKey: string = this.allKey;
        const countOfSelectedItems: number =
            Object.keys(selectedIds).filter((key: string) => {
                return selectedIds[key] && key !== _allKey;
            }).length + (!selectedIds[newItem.id] ? 1 : -1);

        let newLabel: string = countOfSelectedItems === 0 ? this.defaultLabel : newItem.children;

        if (countOfSelectedItems > 1) {
            newLabel = `${countOfSelectedItems} selected`;
        }

        const isCheckedAll: boolean = countOfSelectedItems >= this.getItems().length - 1;

        this.setState((prevState) => {
            return {
                ...prevState,
                selectedTypeName: newLabel,
                selectedIds: {
                    ...this.state.selectedIds,
                    [newItem.id]: !selectedIds[newItem.id],
                    [this.allKey]: isCheckedAll,
                },
            };
        });
    };

    private getCheckboxLabel = (selectedIds) => {
        let newTitle = "";
        if (selectedIds.length === 1) {
            const item: IReportType[] = this.getItems().filter((i: IReportType) => {
                return i.Id === selectedIds[0];
            });
            newTitle = item[0].Title;
        }

        const _allKey: string = this.allKey;
        const countOfSelectedItems: number = selectedIds.filter((i: string) => {
            return i && i !== _allKey;
        }).length;

        let newLabel: string = countOfSelectedItems === 0 ? this.defaultLabel : newTitle;
        if (countOfSelectedItems > 1) {
            newLabel = `${countOfSelectedItems} selected`;
        }

        return newLabel;
    };

    public getCurrentReportTypes = () => {
        const _selectedIds: any = this.state.selectedIds;
        const keys: string[] = Object.keys(_selectedIds);
        if (
            !keys ||
            !keys.length ||
            (keys.indexOf(this.allKey) !== -1 && _selectedIds[this.allKey])
        ) {
            return null;
        }

        return keys.filter((key) => {
            return _selectedIds[key];
        });
    };

    public onToggle = (isOpen) => {
        if (isOpen) {
            SwTrack.all.trackEvent("Drop down", "open", "filter/reports type");
        } else {
            this.props.applyFilters();
        }
    };

    private renderItems = () => {
        const dropDownItemInArray: JSX.Element[] = new Array(
            (
                <DropdownButton key="type-drp-btn" width={180}>
                    {this.state.selectedTypeName}
                </DropdownButton>
            ),
        );

        const items: JSX.Element[] = this.getItems().map((item: IReportType, index: number) => (
            <CheckboxDropdownItem key={index} id={item.Id}>
                {item.Title}
            </CheckboxDropdownItem>
        ));
        return dropDownItemInArray.concat(items);
    };

    public render(): JSX.Element {
        return (
            <div>
                <Dropdown
                    selectedIds={this.state.selectedIds}
                    onClick={this.onClick}
                    onToggle={this.onToggle}
                    cssClassContainer="DropdownContent-container ReportTypesDropdownContent-container"
                    closeOnItemClick={false}
                    {...this.props}
                >
                    {this.renderItems()}
                </Dropdown>
            </div>
        );
    }
}
