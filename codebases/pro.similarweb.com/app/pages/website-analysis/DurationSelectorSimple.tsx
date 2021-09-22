import { SWReactIcons } from "@similarweb/icons";
import { DurationSelectorStateless } from "@similarweb/ui-components/dist/duration-selector";
import { IPopupConfig } from "@similarweb/ui-components/dist/popup";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { DurationSelectorButton } from "components/duration-selectors/DurationSelectorButton";
import { PropsOf } from "helpers/types/react";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import ConnectedPopup from "pages/website-analysis/ConnectedPopup";
import { Component, CSSProperties, ReactNode } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { openUnlockModalV2, openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import TrialService from "services/TrialService";
import LocationService from "../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import UnlockModalHookWrapper, {
    UnlockModalHookWrapperBind,
} from "../../../.pro-features/components/Modals/src/UnlockModal/UnlockModalHookWrapper";
import { ISwSettings } from "../../@types/ISwSettings";
import {
    CLOSE_DURATION_FILTER,
    OPEN_DURATION_FILTER,
} from "../../action_types/website_analysis_action-types";
import TrialHook from "../../components/React/TrialHook/TrialHook";
import UnlockModal from "../../components/React/UnlockModalProvider/UnlockModalProvider";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";
import UIComponentStateService from "../../services/UIComponentStateService";
import {
    convertInitialPresetToDuration,
    getCompareDurationSelected,
    getSelectedDurationPresetId,
    isCompareDuration,
} from "./DurationSelectorUtils";

export type Presets = PropsOf<typeof DurationSelectorStateless>["presets"];

export interface IDurationSelectorSimpleProps {
    minDate: Dayjs;
    maxDate: Dayjs;
    minDailyDate?: Dayjs;
    maxDailyDate?: Dayjs;
    isDisabled: boolean;
    presets: Presets;
    weeklyPresets?: Presets;
    initialPreset: string;
    initialComparedDuration?: string | boolean;
    onSubmit: (duration: any, comparedDuration: any) => void;
    onLockedItemClick?: () => void;
    componentName: string;
    keys: any;
    compareAllowed: boolean;
    compareLabel?: string;
    compareDisabledTooltipText?: string;
    hasPermissionsLock?: boolean;
    customDashboardState?: any;
    onToggle?: (isOpen: boolean, isOutsideClick?: boolean) => void;
    appendTo?: string;
    height?: number;
    placement?: string;
    disableCalendar?: boolean;
    disableFooter?: boolean;
    isWeeklyDataAvailable?: boolean;
    showWeeklyToggle?: boolean;
    weeklyCalendarLocked?: ReactNode;
    weeklyToggleProps?: {
        weekly?: ReactNode;
        monthly?: ReactNode;
    };
    close?: (action) => void;
    isShowPoPDropdownLockModal?: boolean;
}

enum EGranularities {
    Weekly,
    Monthly,
}

export function formatDuration(duration, granularity = EGranularities.Monthly) {
    let format = "YYYY.MM";
    if (granularity === EGranularities.Weekly) {
        format = "YYYY.MM.DD";
    }
    return `${duration.from.format(format)}-${duration.to.format(format)}`;
}

export class DurationSelectorSimple extends Component<
    IDurationSelectorSimpleProps,
    {
        compareSelected;
        selectedPreset;
        compareDurationSelected;
        compareTypesSelected;
        compareTypeList;
        compareEnabled;
        isOpen;
        isUnlockOpen;
        isBubbleOpen;
        selectedGranularity?: EGranularities;
    }
> {
    private _popService;
    private _swNavigator;
    private _trialService;
    private popupContainerRef;
    private _localStorageId;
    private _swSettings: ISwSettings;
    private _userLanguage;
    private lastWeeklyPreset: string;
    private lastMonthlyPreset: string;

    public static defaultProps = {
        onToggle: (isOpen: boolean) => null,
        onLockedItemClick: () => ({}),
        height: 60,
        placement: "bottom-right",
        weeklyPresets: [],
        isWeeklyDataAvailable: false,
        weeklyCalendarLocked: null,
    };

    constructor(props) {
        super(props);

        this._popService = periodOverPeriodService;
        this._swNavigator = Injector.get("swNavigator");
        this._trialService = new TrialService();
        this._localStorageId = "duration_selector_bubble";
        this._swSettings = swSettings;
        this._userLanguage = this._swSettings.components.Home.resources.Language || "en-us";
        this.state = this._getState(props);
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
                : formatDuration(compareDurationSelected.primary, this.state.selectedGranularity),
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

    public UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState(this._getState(nextProps));
        }
    }

    protected getSelectedPreset = (props) => {
        const isCustom = props.initialPreset.indexOf("-") !== -1;
        const noAvailablePresets = props.presets.every((p) => p.locked);
        const selectedPreset = isCustom || noAvailablePresets ? null : props.initialPreset;
        return selectedPreset;
    };

    private _getState = (props: IDurationSelectorSimpleProps) => {
        const isCustom = props.initialPreset.indexOf("-") !== -1;
        const compareSelected = !!props.initialComparedDuration;
        const selectedPreset = this.getSelectedPreset(props);
        let compareTypesSelected = "";
        let compareTypeList = null;
        let compareEnabled = false;
        const duration = convertInitialPresetToDuration(props.initialPreset, [
            ...props.presets,
            ...props.weeklyPresets,
        ]);
        if (props.compareAllowed) {
            compareTypeList = this.getCompareTypeList(
                props.initialPreset,
                props.keys,
                props.componentName,
                props.initialPreset,
            );
            // compare to previous year by default
            const isComparedYear =
                (props.initialComparedDuration === false ||
                    props.initialComparedDuration === "12m") &&
                !compareTypeList.find((item) => item.id === "previous year").disabled;
            compareTypesSelected = isComparedYear ? "previous year" : "previous period";
            compareEnabled = this.isCompareDurationEnabled(
                duration,
                props.initialPreset === "28d",
                props.initialComparedDuration,
                props.keys,
                props.componentName,
                isCustom,
            );
        }

        const compareDurationSelected = getCompareDurationSelected(
            //from preset, from custom, + compare => convert to duration
            convertInitialPresetToDuration(props.initialPreset, [
                ...props.presets,
                ...props.weeklyPresets,
            ]),
            compareSelected && compareEnabled,
            compareTypesSelected,
        );
        const isBubbleOpen =
            UIComponentStateService.getItem(this._localStorageId, "localStorage", true) !== "false";
        return {
            compareSelected,
            selectedPreset,
            compareDurationSelected,
            compareTypesSelected,
            compareTypeList,
            compareEnabled,
            isOpen: false,
            isUnlockOpen: false,
            isBubbleOpen,
            selectedGranularity: duration.isDaily ? EGranularities.Weekly : EGranularities.Monthly,
        };
    };

    public trackTypeToggle = (type) => {
        TrackWithGuidService.trackWithGuid("duration.type.toggle", "switch", { type });
    };
    public onGranularityChange = (index) => {
        let state: any = {};
        // weekly
        if (index === EGranularities.Weekly) {
            this.trackTypeToggle("week");
            state = {
                selectedGranularity: EGranularities.Weekly,
                compareSelected: false,
                compareEnabled: false,
            };
        } else {
            this.trackTypeToggle("month");
            state = {
                selectedGranularity: EGranularities.Monthly,
            };
        }
        this.setState(state, () => {
            if (index === EGranularities.Weekly) {
                // try to find the initial preset in the weekly presets
                // if not, take the first one as default
                const weeklyPreset = this.props.weeklyPresets.find(
                    (p) => p.id === this.lastWeeklyPreset,
                );
                this.onPresetSelect()(weeklyPreset || this.props.weeklyPresets[0]);
            } else if (this.props.initialPreset.indexOf("-") === -1) {
                // try to find the initial preset in the presets
                // if not, take the 3m as default
                const monthlyPreset = this.props.presets.find(
                    (p) => p.id === this.lastMonthlyPreset,
                );
                this.onPresetSelect()(
                    monthlyPreset || this.props.presets.find((p) => p.id === "3m"),
                );
            }
        });
    };

    public getPresets = () => {
        if (this.state.selectedGranularity === EGranularities.Weekly) {
            return this.props.weeklyPresets;
        } else {
            return this.props.presets;
        }
    };

    public getDurationSelectorStateless = () => (
        <DurationSelectorStateless
            locale={this._userLanguage}
            presets={this.getPresets()}
            selectedPreset={this.state.selectedPreset}
            presetsLabel="Date Range"
            cancelButtonText="Cancel"
            submitButtonText="Apply"
            customPresetText="Custom"
            compareAllowed={this.props.compareAllowed}
            compareLabel={this.props.compareLabel}
            compareDisabledTooltipText={this.props.compareDisabledTooltipText}
            compareSelected={this.state.compareSelected}
            compareEnabled={this.state.compareEnabled}
            compareTypesList={this.state.compareTypeList}
            compareTypesSelected={this.state.compareTypesSelected}
            compareDurationSelected={this.state.compareDurationSelected}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            minDailyDate={this.props.minDailyDate}
            maxDailyDate={this.props.maxDailyDate}
            compareToggle={this.onCompareToggle}
            compareSelect={this.onCompareSelect}
            durationChange={this.onDurationChange}
            presetSelect={this.onPresetSelect(true)}
            selectorCancel={this.onCancel}
            selectorSubmit={this.onSubmit}
            hasPermissionsLock={this.props.hasPermissionsLock}
            disableCalendar={this.props.disableCalendar}
            disableFooter={this.props.disableFooter}
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
            itemWrapper={
                this.props.isShowPoPDropdownLockModal &&
                UnlockModalHookWrapperBind({
                    slide: "TimeRanges" as IUnlockModalConfigTypes["TimeRangeFilters"],
                    location: `${LocationService.getCurrentLocation()}/Time Ranges`,
                    modal: "TimeRangeFilters",
                })
            }
            onDropdownButtonClick={this.onDropdownButtonClick}
            footerComponent={() => {
                return (
                    this.showTrialHook() && (
                        <TrialHook
                            text="trial_hook.duration.text"
                            buttonText="trial_hook.duration.button.text"
                            iconName="daily-ranking"
                            label="Duration Selector"
                            onCtaClick={() => {
                                if (swSettings.user.hasSolution2) {
                                    openUnlockModalV2("WebAllowedDuration");
                                } else {
                                    openUnlockModal(
                                        {
                                            modal: "TimeRangeFilters",
                                        },
                                        `${LocationService.getCurrentLocation()}/Time Filter/get in touch`,
                                    );
                                }
                            }}
                        />
                    )
                );
            }}
            onGranularityToggleClick={this.onGranularityChange}
            selectedGranularity={this.state.selectedGranularity as any}
            showWeeklyToggle={this.props.showWeeklyToggle}
            isWeeklyDataAvailable={this.props.isWeeklyDataAvailable}
            weeklyCalendarLocked={this.props.weeklyCalendarLocked}
            weeklyToggleProps={this.props.weeklyToggleProps}
        />
    );

    private onCompareToggle = () => {
        allTrackers.trackEvent(
            "Checkbox",
            this.state.compareSelected ? "Remove" : "Add",
            `Date range/compare/${this.state.compareTypesSelected}`,
        );
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

    private getCompareTypeList = (initialPreset, keys, componentName, symbol) => {
        const _items = this._popService
            .getPeriodOverPeriodDropdownItems(initialPreset, keys, componentName, false, symbol)
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

    private isCompareDurationEnabled = (
        duration,
        isWindow,
        initialComparedDuration,
        keys,
        componentName,
        isCustom = false,
    ) => {
        // currently no compare allowed on daily data
        if (duration.isDaily) {
            return false;
        }
        let _durationSymbol = DurationService.getDiffSymbol(
            duration.from,
            duration.to,
            isWindow ? "days" : "months",
        );
        const _durationSymbol2 = DurationService.getDiffSymbol(
            duration.from,
            duration.to,
            isWindow ? "days" : "months",
        );
        if (isCustom) {
            _durationSymbol = formatDuration(
                duration,
                this.state?.selectedGranularity || EGranularities.Monthly,
            );
        }

        const _periodOverPeriodEnabled = this._popService.periodOverPeriodEnabled(
            _durationSymbol,
            initialComparedDuration,
            keys,
            componentName,
            _durationSymbol2,
        );
        return _periodOverPeriodEnabled;
    };

    private onDurationChange = (duration) => {
        const isCustom = true; // seems like it is called just for custom dates
        const compareDurationSelected = getCompareDurationSelected(
            duration,
            isCompareDuration(
                this.state.compareSelected,
                this.state.compareEnabled,
                this.props.compareAllowed,
            ),
            this.state.compareTypesSelected,
        );
        const state: any = {
            compareTypesSelected: this.state.compareTypesSelected,
            compareDurationSelected,
            compareEnabled: this.isCompareDurationEnabled(
                duration,
                false,
                this.props.initialComparedDuration,
                this.props.keys,
                this.props.componentName,
                isCustom,
            ),
        };
        if (state.compareEnabled) {
            const durationSymbol = DurationService.getDiffSymbol(
                duration.from,
                duration.to,
                "days",
            );
            let durationFormatted;
            if (isCustom) {
                durationFormatted = formatDuration(duration, this.state.selectedGranularity);
            }
            state.compareTypeList = this.getCompareTypeList(
                durationFormatted,
                this.props.keys,
                this.props.componentName,
                durationSymbol,
            );

            const disabledItems = _.filter(state.compareTypeList, {
                disabled: true,
            });
            // in case if we have selected period which valid for period but year selected
            // we'll select automatically wrong period
            if (disabledItems.length > 0) {
                if (disabledItems.length === 2) {
                    state.compareDurationSelected &&
                        (state.compareDurationSelected.secondary = null);
                    state.compareSelected = false;
                } else {
                    state.compareTypesSelected = _.get(
                        _.find(state.compareTypeList, { disabled: false }),
                        "id",
                    );
                    state.compareDurationSelected = getCompareDurationSelected(
                        duration,
                        isCompareDuration(
                            this.state.compareSelected,
                            this.state.compareEnabled,
                            this.props.compareAllowed,
                        ),
                        state.compareTypesSelected,
                    );
                }
            }
        } else {
            state.compareDurationSelected && (state.compareDurationSelected.secondary = null);
            state.compareSelected = false;
        }

        this.setState({
            ...state,
            selectedPreset: getSelectedDurationPresetId(
                compareDurationSelected,
                this.state.selectedGranularity === EGranularities.Weekly
                    ? this.props.weeklyPresets
                    : this.props.presets,
                "day",
            ),
        });
    };

    private setStateAfterPresetChange = (preset, compareEnabled) => {
        const { compareAllowed, keys, disableFooter, disableCalendar, componentName } = this.props;
        this.setState(
            {
                compareDurationSelected: getCompareDurationSelected(
                    preset.value,
                    isCompareDuration(
                        this.state.compareSelected,
                        this.state.compareEnabled,
                        compareAllowed,
                    ),
                    this.state.compareTypesSelected,
                ),
                compareTypeList: this.getCompareTypeList(preset.id, keys, componentName, preset.id),
                selectedPreset: preset.id,
                compareEnabled,
            },
            () => {
                if (disableFooter && disableCalendar) {
                    this.onSubmit();
                }
            },
        );
    };

    protected onPresetSelect = (shouldTrack = false) => (preset) => {
        if (shouldTrack) {
            TrackWithGuidService.trackWithGuid("duration.preset.select", "click", {
                preset: preset.id,
            });
        }
        // save the preset to we can use it when granularity changed
        switch (this.state.selectedGranularity) {
            case EGranularities.Weekly:
                this.lastWeeklyPreset = preset.id;
                break;
            case EGranularities.Monthly:
                this.lastMonthlyPreset = preset.id;
        }
        if (preset.locked) {
            if (this._swSettings.user.hasSolution2) {
                openUnlockModalV2("WebAllowedDuration");
            } else {
                this.setState({
                    isUnlockOpen: true,
                });
            }
            if (this.popupContainerRef) {
                this.props.close({ type: CLOSE_DURATION_FILTER });
            }

            allTrackers.trackEvent(
                "hook/Contact Us/Pop up",
                "click",
                `Time Filter/${preset ? preset.id : "Custom"}`,
            );
            return;
        }

        const compareEnabled = this.isCompareDurationEnabled(
            preset.value,
            preset.id === "28d",
            this.props.initialComparedDuration,
            this.props.keys,
            this.props.componentName,
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
        allTrackers.trackEvent("Drop Down", "Click", `Date range/compare/${compareType.id}`);
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

    private onDropdownButtonClick = () => {
        allTrackers.trackEvent("Drop Down", "Open", "Date range/compare");
    };

    private showTrialHook = () => {
        // TODO: liorb - use unified flag
        const Home = this._swSettings.components.Home.resources;
        const isNoTouch = Home.IsNoTouchUser;
        return this._trialService.isTrial() || isNoTouch;
    };

    public render() {
        const { initialPreset, presets, weeklyPresets, placement } = this.props;
        const trialContainerModifier = !this._trialService.isTrial()
            ? ""
            : " FiltersBarDropdown--trial";
        const config: IPopupConfig = {
            placement,
            autoPlacement: false,
            cssClassContainer: `DropdownButton-popup-container DurationSelector-popup-container FiltersBarDropdown${trialContainerModifier}`,
            enabled: !this.props.isDisabled,
            onToggle: (isOpen, isOutsideClick) => {
                if (!isOpen && isOutsideClick) {
                    // reset state when closing the popup by outside click
                    this.setState(this._getState(this.props));
                }
                this.setState({ isOpen }, () => {
                    this.props.onToggle(isOpen, isOutsideClick);
                });
            },
        };
        const style: CSSProperties = {
            textOverflow: "ellipsis",
            overflow: "hidden",
        };
        const isCompareDurationFlag = this.props.initialComparedDuration; //isCompareDuration(this.state.compareSelected, this.state.compareEnabled, this.props.compareAllowed) &&
        return (
            <ConnectedPopup
                stateKey="WebsiteAnalysisFilters.durationFilter"
                appendTo={this.props.appendTo}
                config={config}
                content={this.getDurationSelectorStateless}
                ref={(popup) => (this.popupContainerRef = popup)}
                openAction={{
                    type: OPEN_DURATION_FILTER,
                }}
                closeAction={{
                    type: CLOSE_DURATION_FILTER,
                }}
            >
                <div>
                    {this.props.children ? (
                        this.props.children
                    ) : (
                        <DurationSelectorButton
                            height={this.props.height}
                            isDisabled={this.props.isDisabled}
                            presets={[...presets, ...weeklyPresets]}
                            initialPreset={initialPreset}
                            isCompare={!!isCompareDurationFlag}
                        />
                    )}
                    <UnlockModal
                        isOpen={this.state.isUnlockOpen}
                        onCloseClick={() => {
                            this.setState({ isUnlockOpen: false });
                        }}
                        activeSlide={"TimeRanges" as IUnlockModalConfigTypes["TimeRangeFilters"]}
                        location="Hook PRO/Website Analysis/Time Ranges"
                        {...UnlockModalConfig().TimeRangeFilters}
                    />
                </div>
            </ConnectedPopup>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        close: (action) => {
            dispatch(action);
        },
    };
};

export default connect(null, mapDispatchToProps)(DurationSelectorSimple);
