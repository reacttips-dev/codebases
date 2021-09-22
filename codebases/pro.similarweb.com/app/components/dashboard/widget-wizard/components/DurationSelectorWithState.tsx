import ContactUsLink from "components/React/ContactUs/ContactUsLink";
import * as _ from "lodash";
import { SWReactIcons } from "@similarweb/icons";
import {
    DurationSelectorStateless,
    DurationSelectorDropdown,
    createDayjs,
    DurationSelectorStatelessCompactView,
} from "@similarweb/ui-components/dist/duration-selector";
import { DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { IPopupConfig } from "@similarweb/ui-components/dist/popup";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import autobind from "autobind-decorator";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";
import { Component } from "react";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { getComponentByWebSource } from "../utils/dashboardWizardUtils";

export class DurationSelectorWithState extends Component<
    {
        minDate;
        maxDate;
        isDisabled;
        presets;
        initialPreset;
        initialComparedDuration;
        onSubmit;
        customDashboardState;
        compactMode;
    },
    {
        compareSelected;
        selectedPreset;
        compareDurationSelected;
        compareTypesSelected;
        compareTypeList;
        compareAllowed;
        compareEnabled;
        isOpen;
        simpleDropdown;
    }
> {
    private _popService;
    private _componentName;
    private popupClickContainerRef;

    constructor(props) {
        super(props);
        this._componentName = getComponentByWebSource(
            this.props.customDashboardState,
            this.props.customDashboardState.widget.webSource,
            this.props.customDashboardState.widget.metric,
            this.props.customDashboardState.widget.family,
        );

        this._popService = periodOverPeriodService;

        this.state = this._getState(props);
    }

    public componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState(this._getState(this.props));
        }
    }

    private onSubmit = () => {
        const {
            selectedPreset,
            compareDurationSelected,
            compareSelected,
            compareTypesSelected,
        } = this.state;
        allTrackers.trackEvent(
            "Drop Down",
            "click",
            `Date Range/${selectedPreset ? selectedPreset : "Custom"}`,
        );
        this.props.onSubmit(
            selectedPreset
                ? selectedPreset
                : `${compareDurationSelected.primary.from.format(
                      "YYYY.MM",
                  )}-${compareDurationSelected.primary.to.format("YYYY.MM")}`,
            compareSelected !== false
                ? compareTypesSelected === "previous year"
                    ? "12m"
                    : DurationService.getDiffSymbol(
                          compareDurationSelected.primary.from,
                          compareDurationSelected.primary.to,
                          "months",
                      )
                : false,
        );
    };

    private onCancel = () => {
        this.setState(this._getState(this.props));
    };

    private _getState = (props) => {
        const compareSelected = props.initialComparedDuration;
        const selectedPreset =
            props.initialPreset.indexOf("-") === -1 ? props.initialPreset : false;
        const compareTypeList = this.getCompareTypeList();
        // compare to previous year by default
        const isComparedYear =
            (props.initialComparedDuration === false || props.initialComparedDuration === "12m") &&
            !compareTypeList.find((item) => item.id === "previous year").disabled;
        const compareTypesSelected = isComparedYear ? "previous year" : "previous period";
        const compareAllowed = this.isCompareAllowed();
        const compareEnabled = this.isCompareEnabled(
            this.convertInitialPresetToDuration(props.initialPreset),
            props.initialPreset === "28d",
        );
        const compareDurationSelected = this.getCompareDurationSelected(
            //from preset, from custom, + compare => convert to duration
            this.convertInitialPresetToDuration(props.initialPreset),
            compareSelected && compareAllowed && compareEnabled,
            compareTypesSelected,
        );

        return {
            compareSelected,
            selectedPreset,
            compareDurationSelected,
            compareTypesSelected,
            compareTypeList,
            compareAllowed,
            compareEnabled,
            isOpen: false,
            //Use simple duration dropdown if compare-to-priod is not allowed and the duration is not Custom Range
            simpleDropdown: !compareAllowed && selectedPreset,
        };
    };

    private getPresetById(presets, id) {
        const matchPreset = presets.find((preset: any) => preset.id === id);
        return matchPreset || presets.find((preset: any) => preset.id === "3m");
    }

    private isCompare() {
        return this.state.compareSelected && this.state.compareEnabled && this.state.compareAllowed;
    }

    private getCompareDurationSelected = (duration, isCompare, compareType) => {
        let secondaryDuration = null;
        if (isCompare && this.isCompareEnabled(duration, false)) {
            switch (compareType) {
                case "previous period":
                    const durationSize = duration.to.diff(duration.from, "month");
                    secondaryDuration = {
                        from: duration.from.clone().subtract(durationSize + 1, "month"),
                        to: duration.from.clone().subtract(1, "month"),
                    };
                    break;
                case "previous year":
                    secondaryDuration = {
                        from: duration.from.clone().subtract(1, "year"),
                        to: duration.to.clone().subtract(1, "year"),
                    };
                    break;
                default:
                    secondaryDuration = null;
                    break;
            }
        }
        return { primary: duration, secondary: secondaryDuration };
    };

    public onCompareDropdownClick = () => {
        this.setState({
            compareTypeList: this.getCompareTypeList(),
        });
    };

    public getDurationSelectorStateless = () => {
        let DurationSelector;

        if (this.props.compactMode && !this.state.simpleDropdown && this.state.selectedPreset) {
            DurationSelector = DurationSelectorStatelessCompactView;
        } else {
            DurationSelector = !this.state.selectedPreset
                ? DurationSelectorStateless
                : DurationSelectorStatelessCompactView;
        }

        return (
            <DurationSelector
                presets={this.props.presets}
                selectedPreset={this.state.selectedPreset}
                presetsLabel="Date Range"
                cancelButtonText="Cancel"
                submitButtonText="Apply"
                customPresetText="Custom range"
                compareAllowed={this.state.compareAllowed}
                compareLabel="Compare to"
                compareDisabledTooltipText="Time comparison analysis is only available for last 1-12 months while analyzing a single website"
                compareSelected={this.state.compareSelected}
                compareEnabled={this.state.compareEnabled}
                compareTypesList={this.state.compareTypeList}
                compareTypesSelected={this.state.compareTypesSelected}
                compareDurationSelected={this.state.compareDurationSelected}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                compareToggle={this.onCompareToggle}
                compareSelect={this.onCompareSelect}
                durationChange={this.onDurationChange}
                presetSelect={this.onPresetSelect}
                selectorCancel={this.onCancel}
                selectorSubmit={this.onSubmit}
                onDropdownButtonClick={this.onCompareDropdownClick}
                renderContactUs={() => (
                    <ContactUsLink label="Drop Down">
                        <SWReactIcons iconName="upgrade" />
                    </ContactUsLink>
                )}
                itemWrapper={({ children }) => (
                    <ContactUsLink label="Drop Down">{children}</ContactUsLink>
                )}
            />
        );
    };

    private onCompareToggle = () => {
        this.setState({
            compareSelected: !this.state.compareSelected,
            compareDurationSelected: this.getCompareDurationSelected(
                this.state.compareDurationSelected.primary,
                !this.isCompare(),
                this.state.compareTypesSelected,
            ),
        });
    };

    private clearCompare = (cb) => {
        this.setState(
            {
                compareSelected: false,
                compareDurationSelected: this.getCompareDurationSelected(
                    this.state.compareDurationSelected.primary,
                    false,
                    this.state.compareTypesSelected,
                ),
            },
            cb,
        );
    };

    private getDropDownButtonTitle = () => {
        if (this.props.compactMode || this.state.simpleDropdown) {
            if (!this.state.selectedPreset) {
                const compareDurationSelected = this.state.compareDurationSelected.primary;
                return `${compareDurationSelected.from.format(
                    "MMM YYYY",
                )}-${compareDurationSelected.to.format("MMM YYYY")}`;
            } else {
                return (_.find(this.props.presets, { id: this.state.selectedPreset }) as any).text;
            }
        }
        if (this.state.selectedPreset === "28d") {
            return this.props.presets.filter((preset) => preset.id === "28d")[0].text;
        } else {
            const compareDurationSelected = this.state.compareDurationSelected.primary;
            return `${compareDurationSelected.from.format(
                "MMM YYYY",
            )}-${compareDurationSelected.to.format("MMM YYYY")}`;
        }
    };

    private isCompareAllowed = () => {
        return this._popService.periodOverPeriodEnabledForMetric(
            this.props.customDashboardState.widget.metric,
            this.props.customDashboardState.widget.key.length > 1,
            this.props.customDashboardState.widget.family,
        );
    };

    private getCompareTypeList = () => {
        const _items = this._popService
            .getPeriodOverPeriodDropdownItems(
                this.state?.selectedPreset || this.props.initialPreset,
                this.props.customDashboardState.widget.key,
                this._componentName,
            )
            .map((item, index) => {
                return {
                    id: item.id,
                    text: item.text,
                    value: index,
                    disabled: item.disabled,
                };
            });
        return _items;
    };

    private convertInitialPresetToDuration = (initialPreset) => {
        if (initialPreset.indexOf("-") > 1) {
            const _splittedPreset = initialPreset.split("-");
            return {
                from: createDayjs(
                    _splittedPreset[0].split(".")[0],
                    _splittedPreset[0].split(".")[1] - 1,
                ),
                to: createDayjs(
                    _splittedPreset[1].split(".")[0],
                    _splittedPreset[1].split(".")[1] - 1,
                ),
            };
        } else {
            return this.getPresetById(this.props.presets, initialPreset).value;
        }
    };

    private isCompareEnabled = (duration, isWindow) => {
        const _durationSymbol = DurationService.getDiffSymbol(
            duration.from,
            duration.to,
            isWindow ? "days" : "months",
        );
        const _periodOverPeriodEnabled = this._popService.periodOverPeriodEnabled(
            _durationSymbol,
            this.props.customDashboardState.widget.comparedDuration,
            this.props.customDashboardState.widget.key,
            this._componentName,
        );
        return _periodOverPeriodEnabled;
    };

    private onDurationChange = (duration) => {
        this.setState({
            compareDurationSelected: this.getCompareDurationSelected(
                duration,
                this.isCompare(),
                this.state.compareTypesSelected,
            ),
            selectedPreset: null,
            compareEnabled: this.isCompareEnabled(duration, false),
            compareSelected: this.isCompareEnabled(duration, false) && this.state.compareSelected,
        });
    };

    private setStateAfterPresetChange = (preset, compareEnabled) => {
        const switchToSimpleDropdown = !this.state.compareAllowed && preset.id;
        this.setState({
            compareDurationSelected: this.getCompareDurationSelected(
                preset.value,
                this.isCompare(),
                this.state.compareTypesSelected,
            ),
            selectedPreset: preset.id,
            compareEnabled,
            simpleDropdown: switchToSimpleDropdown,
        });
        if (switchToSimpleDropdown) {
            this.props.onSubmit(preset.id);
        }
    };

    private onPresetSelect = (preset) => {
        const compareEnabled = this.isCompareEnabled(preset.value, preset.id === "28d");
        if (this.state.compareEnabled !== compareEnabled) {
            this.clearCompare(() => {
                //callback required because setStateAfterPresetChange() depends on changed state after clearCompare()
                this.setStateAfterPresetChange(preset, compareEnabled);
            });
        } else {
            this.setStateAfterPresetChange(preset, compareEnabled);
        }
        setTimeout(() => {
            this.popupClickContainerRef && this.popupClickContainerRef.reposition();
        });
    };

    private dropdownOnPresetSelect = (preset) => {
        const compareEnabled = this.isCompareEnabled(preset.value, preset.id === "28d");

        if (!preset.id) {
            this.setStateAfterPresetChange(preset, compareEnabled);
            this.setState({ simpleDropdown: false });
            //Assure that the render() is being called before using popupClickContainerRef
            setTimeout(() => {
                this.popupClickContainerRef.openPopup();
                this.popupClickContainerRef.reposition();
            });
            return;
        }
        if (this.state.compareEnabled !== compareEnabled) {
            this.clearCompare(() => {
                //callback required because setStateAfterPresetChange() depends on changed state after clearCompare()
                this.setStateAfterPresetChange(preset, compareEnabled);
            });
        }
        this.setStateAfterPresetChange(preset, compareEnabled);
    };

    private onCompareSelect = (compareType) => {
        this.setState({
            compareTypesSelected: compareType.id,
            compareDurationSelected: this.getCompareDurationSelected(
                this.state.compareDurationSelected.primary,
                this.isCompare(),
                compareType.id,
            ),
        });
    };

    private _onDropdownButtonClick = () => {
        //todo when supported onlick on PopupClickContainer or DropdownButton
        allTrackers.trackEvent("Drop Down", "open", `Date Range`);
    };

    @autobind
    private setPopupClickContainerRef(ref) {
        this.popupClickContainerRef = ref;
    }

    public render() {
        const config: IPopupConfig = {
            placement: "bottom-left",
            cssClassContainer: "DropdownButton-popup-container",
            enabled: !this.props.isDisabled,
            onToggle: (isOpen) => {
                this.setState({ isOpen });
            },
        };
        if (this.state.simpleDropdown) {
            return (
                <DurationSelectorDropdown
                    key="DurationSelectorPresets"
                    items={this.props.presets}
                    onSelect={this.dropdownOnPresetSelect}
                    selectedId={this.state.selectedPreset}
                    buttonWidth="100%"
                    noItemSelectedText={"Custom Range"}
                    itemWrapper={({ children }) => (
                        <ContactUsLink label="Drop Down">{children}</ContactUsLink>
                    )}
                    disabled={this.props.isDisabled}
                />
            );
        }
        return (
            <PopupClickContainer
                ref={this.setPopupClickContainerRef}
                config={config}
                content={this.getDurationSelectorStateless}
            >
                <div>
                    <DropdownButton
                        disabled={this.props.isDisabled}
                        width={"100%"}
                        hasValue={true}
                        isOpen={this.state.isOpen}
                    >
                        {this.getDropDownButtonTitle()}
                        {this.isCompare() && (
                            <span className="duration-selector-compare-bullet"></span>
                        )}
                    </DropdownButton>
                </div>
            </PopupClickContainer>
        );
    }
}
