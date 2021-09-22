import React from "react";
import dayjs from "dayjs";
import _ from "lodash";

import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";
import { DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { IPopupConfig } from "@similarweb/ui-components/dist/popup";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { DurationSelectorStateless } from "@similarweb/ui-components/dist/duration-selector";
import { IPeriod, ITwoPeriods, IPreset } from "pages/insights/deep-insights/types";
import { SWReactIcons } from "@similarweb/icons";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import ContactUsLink from "components/React/ContactUs/ContactUsLink";
import { SwTrack } from "services/SwTrack";

export class PeriodSelector extends InjectableComponentClass<any, any> {
    private durationOptions: any;
    private presets: IPreset[];
    private _allKey = "ALL";

    constructor(props: any) {
        super();
        this.presets = [
            {
                id: "1m",
                text: this.i18n("DeepInsights.Period.OneMonth"),
                value: {
                    from: dayjs().subtract(1, "month"),
                    to: dayjs().subtract(1, "month").endOf("month"),
                },
            },
            {
                id: "3m",
                text: this.i18n("DeepInsights.Period.3Months"),
                value: {
                    from: dayjs().subtract(3, "months"),
                    to: dayjs().subtract(1, "months").endOf("month"),
                },
            },
            {
                id: "6m",
                text: this.i18n("DeepInsights.Period.6Months"),
                value: {
                    from: dayjs().subtract(6, "months"),
                    to: dayjs().subtract(1, "months").endOf("month"),
                },
            },
        ];

        const compareSelected = false;
        const selectedPresetIndex = 0;
        const selectedPreset: string = this.getPresets()[selectedPresetIndex].id;
        const selectedCompareType: string = this.getCompareTypes()[0].id;
        const compareDurationSelected: ITwoPeriods = this.compareDurationSelected(
            this.getPresets()[selectedPresetIndex].value,
            compareSelected,
            selectedCompareType,
        );

        this.state = {
            compareSelected,
            selectedPreset,
            compareDurationSelected,
            selectedCompareType,
            appliedDuration: compareDurationSelected.primary,
        };

        this.toggle = this.toggle.bind(this);
        this.onApply = this.onApply.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    public onDurationChange = (duration) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                compareDurationSelected: this.compareDurationSelected(
                    duration,
                    this.state.compareSelected,
                    this.state.selectedCompareType,
                ),
                selectedPreset: null,
            };
        });
    };

    public getPresets = () => {
        return this.presets;
    };

    public getCompareTypes = () => {
        return [
            { id: "year", text: "Previous Year" },
            { id: "period", text: "Previous Period" },
        ];
    };

    public onPresetSelect = (preset) => {
        this.setState({
            compareDurationSelected: this.compareDurationSelected(
                preset.value,
                this.state.compareSelected,
                this.state.selectedCompareType,
            ),
            selectedPreset: preset.id,
        });
    };

    public compareDurationSelected = (duration, isCompare, compareType) => {
        let secondaryDuration: IPeriod = null;
        if (isCompare) {
            switch (compareType) {
                case "period":
                    const durationSize: number = duration.to.diff(duration.from, "month");
                    secondaryDuration = {
                        from: duration.from.clone().subtract(durationSize + 1, "month"),
                        to: duration.from.clone().subtract(1, "month"),
                    };
                    break;
                case "year":
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,  @typescript-eslint/no-empty-function
    public onCompareToggle = () => {};

    public onApply = (): void => {
        const duration: IPeriod = { from: null, to: null };
        Object.assign(duration, this.state.compareDurationSelected.primary);
        duration.from = duration.from.startOf("month");
        duration.to = duration.to.endOf("month");

        const trackMessage = `Date range/${duration.from.toString()} - ${duration.to.toString()}`;
        SwTrack.all.trackEvent("Drop down", "click", trackMessage);

        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    appliedDuration: duration,
                };
            },
            () => {
                this.props.applyFilters();
            },
        );
    };

    public onCancel = (): void => {
        const compareDurationSelected: ITwoPeriods = this.state.compareDurationSelected;
        compareDurationSelected.primary = this.state.appliedDuration;
        this.setState((prevState) => {
            return {
                ...prevState,
                compareDurationSelected,
            };
        });
    };

    public getDropDownButtonTitle = (): string => {
        const compareDurationSelected: IPeriod = this.state.compareDurationSelected.primary;
        if (this.state.selectedPreset === "ALL") {
            return this.i18n("DeepInsights.Period.AllPeriods");
        }

        return `${compareDurationSelected.from.format(
            "MMM YY",
        )}-${compareDurationSelected.to.format("MMM YY")}`;
    };

    public setDurationRange = (minDate, maxDate, isCustom = false): void => {
        const _range: IPeriod = {
            from: minDate,
            to: maxDate,
        };

        const newPreset: IPreset = {
            id: "ALL",
            text: this.i18n("DeepInsights.Period.AllPeriods"),
            value: {
                from: minDate,
                to: maxDate,
            },
        };

        this.presets.push(newPreset);

        this.setState((prevState) => {
            return {
                ...prevState,
                compareDurationSelected: this.compareDurationSelected(
                    _range,
                    this.state.compareSelected,
                    "",
                ),
                appliedDuration: _range,
                selectedPreset: !isCustom ? this._allKey : null,
            };
        });
    };

    public clearAll = (): void => {
        const compareSelected = false;
        const selectedPresetId: string = this._allKey;
        const selectedCompareType: string = this.getCompareTypes()[0].id;
        const selectedPreset = _.find(this.getPresets(), { id: selectedPresetId });
        const compareDurationSelected = this.compareDurationSelected(
            selectedPreset.value,
            compareSelected,
            selectedCompareType,
        );

        this.setState((prevState) => {
            return {
                ...prevState,
                compareDurationSelected,
                appliedDuration: compareDurationSelected.primary,
                selectedPreset: selectedPresetId,
            };
        });
    };

    public getCurrentDuration = () => {
        return this.state.appliedDuration;
    };

    public getDefaultDuration = () => {
        return this.state.initialDuration;
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onCompareSelect = (compareType) => {};

    private toggle = (isOpen): void => {
        if (isOpen) {
            SwTrack.all.trackEvent("Drop down", "open", "filter/Date range");
        }
    };

    public getDurationSelectorStateless = (): JSX.Element => (
        <DurationSelectorStateless
            presets={this.getPresets()}
            selectedPreset={this.state.selectedPreset}
            presetsLabel={this.i18n("DeepInsights.Period.DateRange")}
            cancelButtonText={this.i18n("DeepInsights.Period.Cancel")}
            submitButtonText={this.i18n("DeepInsights.Period.Apply")}
            customPresetText={this.i18n("DeepInsights.Period.Custom")}
            compareAllowed={false}
            compareLabel="Compare to"
            compareDisabledTooltipText="Time comparison analysis is only available for last 1-12 months while analyzing a single website"
            compareSelected={this.state.compareSelected}
            compareEnabled={true}
            compareTypesList={this.getCompareTypes()}
            compareTypesSelected={this.state.selectedCompareType}
            compareDurationSelected={this.state.compareDurationSelected}
            minDate={this.props.filterOptions.from}
            maxDate={this.props.filterOptions.to}
            compareToggle={this.onCompareToggle}
            compareSelect={this.onCompareSelect}
            durationChange={this.onDurationChange}
            presetSelect={this.onPresetSelect}
            selectorCancel={this.onCancel}
            selectorSubmit={this.onApply}
            renderContactUs={(): JSX.Element => (
                <ContactUsLink label="Drop Down">
                    <SWReactIcons iconName="upgrade" />
                </ContactUsLink>
            )}
            itemWrapper={ContactUsItemWrap}
        />
    );

    render(): JSX.Element {
        const config: IPopupConfig = {
            placement: "bottom-left",
            cssClassContainer: "DropdownButton-popup-container",
            enabled: true,
            onToggle: this.toggle,
        };

        return (
            <PopupClickContainer config={config} content={this.getDurationSelectorStateless}>
                <div>
                    <DropdownButton disabled={false} hasValue={true} width={170}>
                        {this.getDropDownButtonTitle()}
                    </DropdownButton>
                </div>
            </PopupClickContainer>
        );
    }
}
