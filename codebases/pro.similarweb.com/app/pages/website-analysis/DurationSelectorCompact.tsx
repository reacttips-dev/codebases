import React from "react";
import { Dayjs } from "dayjs";
import { Component } from "react";
import {
    convertInitialPresetToDuration,
    getCompareDurationSelected,
    getDropDownButtonTitle,
    isCompareDuration,
} from "pages/website-analysis/DurationSelectorUtils";
import autobind from "autobind-decorator";
import DurationService from "services/DurationService";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { allTrackers } from "../../services/track/track";
import { IDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import {
    IComparedDuration,
    DurationSelectorStatelessCompact,
} from "@similarweb/ui-components/dist/duration-selector";
import { SWReactIcons } from "@similarweb/icons";
import { IUnlockModalConfigTypes } from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { UnlockModalHookWrapperBind } from "../../../.pro-features/components/Modals/src/UnlockModal/UnlockModalHookWrapper";
import UnlockModalHookWrapper from "../../../.pro-features/components/Modals/src/UnlockModal/UnlockModalHookWrapper";
import LocationService from "../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";

interface DurationSelectorCompactPropTypes {
    minDate: Dayjs;
    maxDate: Dayjs;
    presets: IDropdownItem[];
    initialPreset: string;
    initialComparedDuration?: string;
    compareAllowed: boolean;
    compareLabel?: string;
    compareDisabledTooltipText?: string;
    durationPaymentHook?: boolean;
    componentName: string;
    keys: string;
    onClick?: (durationProps?) => void;
    onSubmit: (duration, comparedDuration) => void;
    disableCalendar?: boolean;
    disablePresetsDropdown?: boolean;
    dropdownAppendTo?: string;
}

interface DurationSelectorCompactState {
    selectedPreset: string; // id of IDropdownItem of presets
    compareSelected: boolean;
    compareEnabled: boolean;
    compareTypeList: IDropdownItem[];
    compareTypesSelected: string; // id of IDropdownItem of compareTypesList
    compareDurationSelected: IComparedDuration;
    hasLineSeparator: boolean;
    calendarsToShow: number;
}

export class DurationSelectorCompact extends Component<
    DurationSelectorCompactPropTypes,
    DurationSelectorCompactState
> {
    private _popService;
    private _swNavigator;
    private _componentName;

    constructor(props) {
        super(props);

        this._componentName = props.componentName;
        this._popService = periodOverPeriodService;
        this._swNavigator = Injector.get("swNavigator");
        this.state = this._getState(this.props);
    }

    public UNSAFE_componentWillReceiveProps(props) {
        this.setState(this._getState(props));
    }

    public componentDidMount() {
        this.handleWindowDimensions();
        window.addEventListener("resize", this.handleWindowDimensions, { capture: true });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowDimensions, { capture: true });
    }

    public render() {
        const {
            minDate,
            maxDate,
            presets,
            compareAllowed,
            dropdownAppendTo,
            durationPaymentHook,
            compareLabel,
            compareDisabledTooltipText,
            disableCalendar,
            disablePresetsDropdown,
        } = this.props;
        const { selectedPreset, compareDurationSelected } = this.state;
        return (
            <div className="DurationSelectorCompactWrap">
                <div className="DurationSelectorCompact-button">
                    {getDropDownButtonTitle(
                        selectedPreset
                            ? selectedPreset
                            : `${compareDurationSelected.primary.from.format(
                                  "YYYY.MM",
                              )}-${compareDurationSelected.primary.to.format("YYYY.MM")}`,
                        presets,
                    )}
                    {this.state.compareSelected && <span className="isCompareBullet" />}
                </div>
                <DurationSelectorStatelessCompact
                    dropdownAppendTo={dropdownAppendTo}
                    presets={presets}
                    selectedPreset={this.state.selectedPreset}
                    presetsLabel="Date Range"
                    customPresetText="Custom"
                    compareAllowed={compareAllowed}
                    compareLabel={compareLabel}
                    compareDisabledTooltipText={compareDisabledTooltipText}
                    compareSelected={this.state.compareSelected}
                    compareEnabled={this.state.compareEnabled}
                    compareTypesList={this.state.compareTypeList}
                    compareTypesSelected={this.state.compareTypesSelected}
                    compareDurationSelected={this.state.compareDurationSelected}
                    minDate={minDate}
                    maxDate={maxDate}
                    compareToggle={this.onCompareToggle}
                    compareSelect={this.onCompareSelect}
                    durationChange={this.onDurationChange}
                    presetSelect={this.onPresetSelect}
                    hasLineSeparator={this.state.hasLineSeparator}
                    hasPermissionsLock={durationPaymentHook}
                    selectorCancel={this.onCancel}
                    selectorSubmit={this.onClickItem}
                    cancelButtonText="Cancel"
                    submitButtonText="Apply"
                    calendarsToShow={this.state.calendarsToShow}
                    disableCalendar={disableCalendar}
                    disablePresetsDropdown={disablePresetsDropdown}
                    renderContactUs={() => (
                        <UnlockModalHookWrapper
                            slide={"TimeRanges" as IUnlockModalConfigTypes["TimeRangeFilters"]}
                            location={`${LocationService.getCurrentLocation()}/Time Ranges`}
                            modal="TimeRangeFilters"
                            componentId="Prev button"
                        >
                            <SWReactIcons iconName="upgrade" />
                        </UnlockModalHookWrapper>
                    )}
                    itemWrapper={UnlockModalHookWrapperBind({
                        slide: "TimeRanges" as IUnlockModalConfigTypes["TimeRangeFilters"],
                        location: `${LocationService.getCurrentLocation()}/Time Ranges`,
                        modal: "TimeRangeFilters",
                    })}
                />
            </div>
        );
    }

    @autobind
    private onClickItem(event) {
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
        this.props.onClick({
            initialDuration: selectedPreset
                ? selectedPreset
                : `${compareDurationSelected.primary.from.format(
                      "YYYY.MM",
                  )}-${compareDurationSelected.primary.to.format("YYYY.MM")}`,
            presets: this.props.presets,
            compareSelected,
        });
    }

    @autobind
    private onCancel() {
        this.props.onClick();
    }

    @autobind
    private _getState(props) {
        const compareSelected = !!props.initialComparedDuration;
        const selectedPreset = props.initialPreset.indexOf("-") === -1 ? props.initialPreset : null;
        const compareTypeList = this.getCompareTypeList(
            this.props.initialPreset,
            this.props.keys,
            this._componentName,
        );
        // compare to previous year by default
        const isComparedYear =
            (props.initialComparedDuration === false || props.initialComparedDuration === "12m") &&
            !compareTypeList.find((item) => item.id === "previous year").disabled;
        const compareTypesSelected = isComparedYear ? "previous year" : "previous period";
        const calendarsToShow = 2;
        const hasLineSeparator = true;

        const compareEnabled = this.isCompareDurationEnabled(
            convertInitialPresetToDuration(props.initialPreset, props.presets),
            props.initialPreset === "28d",
            this.props.initialComparedDuration,
            this.props.keys,
            this._componentName,
        );
        const compareDurationSelected: IComparedDuration = getCompareDurationSelected(
            //from preset, from custom, + compare => convert to duration
            convertInitialPresetToDuration(props.initialPreset, props.presets),
            compareSelected && compareEnabled,
            compareTypesSelected,
        );

        return {
            compareSelected,
            selectedPreset,
            compareDurationSelected,
            compareTypesSelected,
            compareTypeList,
            compareEnabled,
            isOpen: false,
            calendarsToShow,
            hasLineSeparator,
        };
    }

    @autobind
    private getCompareTypeList(initialPreset, keys, componentName) {
        const _items = this._popService
            .getPeriodOverPeriodDropdownItems(initialPreset, keys, componentName)
            .map((item, index) => {
                return {
                    id: item.id,
                    text: item.text,
                    value: index,
                    disabled: item.disabled,
                };
            });
        return _items;
    }

    @autobind
    private onCompareToggle() {
        this.setState({
            compareSelected: !this.state.compareSelected,
            compareDurationSelected: getCompareDurationSelected(
                this.state.compareDurationSelected.primary,
                !isCompareDuration(
                    this.state.compareSelected,
                    this.state.compareEnabled,
                    this.props.compareAllowed,
                ),
                this.state.compareTypesSelected,
            ),
        });
    }

    @autobind
    private isCompareDurationEnabled(
        duration,
        isWindow,
        initialComparedDuration,
        keys,
        componentName,
    ) {
        const _durationSymbol = DurationService.getDiffSymbol(
            duration.from,
            duration.to,
            isWindow ? "days" : "months",
        );
        const _periodOverPeriodEnabled = this._popService.periodOverPeriodEnabled(
            _durationSymbol,
            initialComparedDuration,
            keys,
            componentName,
        );
        return _periodOverPeriodEnabled;
    }

    private onPresetSelect = (preset) => {
        const compareEnabled = this.isCompareDurationEnabled(
            preset.value,
            preset.id === "28d",
            this.props.initialComparedDuration,
            this.props.keys,
            this._componentName,
        );
        if (this.state.compareEnabled !== compareEnabled) {
            this.clearCompare(() => {
                //callback required because setStateAfterPresetChange() depends on changed state after clearCompare()
                this.setStateAfterPresetChange(preset, compareEnabled);
            });
        } else {
            this.setStateAfterPresetChange(preset, compareEnabled);
        }
    };

    private onCompareSelect = (compareType) => {
        this.setState({
            compareTypesSelected: compareType.id,
            compareDurationSelected: getCompareDurationSelected(
                this.state.compareDurationSelected.primary,
                isCompareDuration(
                    this.state.compareSelected,
                    this.state.compareEnabled,
                    this.props.compareAllowed,
                ),
                compareType.id,
            ),
        });
    };

    private clearCompare = (cb) => {
        this.setState(
            {
                compareSelected: false,
                compareDurationSelected: getCompareDurationSelected(
                    this.state.compareDurationSelected.primary,
                    false,
                    this.state.compareTypesSelected,
                ),
            },
            cb,
        );
    };

    private setStateAfterPresetChange = (preset, compareEnabled) => {
        this.setState({
            compareDurationSelected: getCompareDurationSelected(
                preset.value,
                isCompareDuration(
                    this.state.compareSelected,
                    this.state.compareEnabled,
                    this.props.compareAllowed,
                ),
                this.state.compareTypesSelected,
            ),
            selectedPreset: preset.id,
            compareEnabled,
        });
    };

    @autobind
    private onLockIconClick() {
        console.log("Lock clicked");
    }

    private onDurationChange = (duration) => {
        this.setState({
            compareDurationSelected: getCompareDurationSelected(
                duration,
                isCompareDuration(
                    this.state.compareSelected,
                    this.state.compareEnabled,
                    this.props.compareAllowed,
                ),
                this.state.compareTypesSelected,
            ),
            selectedPreset: null,
            compareEnabled: this.isCompareDurationEnabled(
                duration,
                false,
                this.props.initialComparedDuration,
                this.props.keys,
                this._componentName,
            ),
        });
    };

    private handleWindowDimensions = () => {
        const breakPointHeight = this.props.compareAllowed ? 930 : 850;
        const hasLineSeparator = window.innerHeight > breakPointHeight;
        const calendarsToShow = hasLineSeparator ? 2 : 1;
        this.setState({
            hasLineSeparator,
            calendarsToShow,
        });
    };
}
