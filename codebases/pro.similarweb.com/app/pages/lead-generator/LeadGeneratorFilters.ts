import _ from "lodash";
import { availableGrowthFilters } from "./lead-generator-new/availableGrowthFilters";
import {
    ChipsBoxFilter,
    ChipsSummaryFilter,
} from "./lead-generator-new/components/filters/ChipsFilter";
import {
    CountryBoxFilter,
    CountrySummaryFilter,
} from "./lead-generator-new/components/filters/CountryFilter";
import {
    FUNCTIONAL_FLAG_ALL,
    FUNCTIONAL_FLAG_INCLUDE,
    FunctionalFlagBoxFilter,
    FunctionalFlagSummary,
} from "./lead-generator-new/components/filters/FunctionalFlagBoxFilter";
import {
    FLAG_INCLUDE,
    FunctionalFlagBoxRadioBtnFilter,
    FunctionalFlagBoxRadioBtnSummary,
} from "./lead-generator-new/components/filters/FunctionalFlagBoxRadioBtnFilter";

import { GrowthBoxFilter } from "./lead-generator-new/components/filters/GrowthFilters";
import {
    InputComboBoxFilter,
    InputComboSummaryFilter,
} from "./lead-generator-new/components/filters/InputComboFilter";
import {
    OnOffBoxFilter,
    OnOffSummaryFilter,
} from "./lead-generator-new/components/filters/OnOffFilter";
import {
    RangeNumberBoxFilter,
    RangeNumberSummaryFilter,
} from "./lead-generator-new/components/filters/RangeNumberFilter";
import {
    RangePercentBoxFilter,
    RangePercentSummaryFilter,
} from "./lead-generator-new/components/filters/RangePercentFilter";
import {
    SliderBoxFilter,
    SliderSummaryFilter,
} from "./lead-generator-new/components/filters/SliderFilter";
import {
    SwitcherBoxFilter,
    SwitcherSummaryFilter,
} from "./lead-generator-new/components/filters/SwitcherFilter";
import { IBoxFilterProps } from "./lead-generator-new/components/filters/types";
import { GrowthSummary } from "./lead-generator-new/components/summary/GrowthSummary";

export interface IBaseFilter {
    component: React.StatelessComponent<IBoxFilterProps>;
    summaryComponent: React.StatelessComponent<IBoxFilterProps>;
    stateName: string;
    title: string;
    initValue: any;
    hideInBox: boolean;
    hideInSummary: boolean;

    getValue?(): any;

    setValue?(any): void;

    hasValue(): boolean;

    getReportValue(filterState, allStates);
}

abstract class BaseFilter<T> implements IBaseFilter {
    public hideInBox = false;
    public hideInSummary = false;

    constructor(
        public component: React.StatelessComponent<IBoxFilterProps>,
        public summaryComponent: React.StatelessComponent<IBoxFilterProps>,
        public stateName: string,
        public title: string,
        public initValue: T,
        public isLocked: boolean = false,
        public trialHookName: string = "",
    ) {}

    public getValue() {
        return this.initValue;
    }

    // This one here is being overwritten in <ReportQuery />
    public setValue(val: T) {}

    public getReportValue(filterState, allStates) {
        return filterState;
    }

    public hasValue() {
        return !_.isEqual(this.getValue(), this.initValue);
    }
}

export interface ISliderFilter extends IBaseFilter {
    numberOptions: number[];
    formatDescription?(v: number): string;
}

export class SliderFilter extends BaseFilter<number> implements ISliderFilter {
    public numberOptions: number[];

    constructor(stateName, title, numberOptions) {
        super(SliderBoxFilter, SliderSummaryFilter, stateName, title, numberOptions[0]);
        this.numberOptions = numberOptions;
    }
}

export interface ISwitcherFilter extends IBaseFilter {
    textOptions: string[];
}

export class SwitcherFilter extends BaseFilter<number> implements ISwitcherFilter {
    public textOptions: string[];

    constructor(stateName, title, textOptions) {
        super(
            SwitcherBoxFilter,
            SwitcherSummaryFilter,
            stateName,
            title,
            textOptions[0].split(".").pop(),
        );
        this.textOptions = textOptions;
    }
}

export class RangeNumberFilter extends BaseFilter<string> implements ISliderFilter {
    public numberOptions: number[];

    constructor(stateName, title, numberOptions, public formatDescription?: (v: number) => string) {
        super(
            RangeNumberBoxFilter,
            RangeNumberSummaryFilter,
            stateName,
            title,
            `${numberOptions[0]}...${numberOptions[numberOptions.length - 1]}`,
        );
        this.numberOptions = numberOptions;
    }
}

export interface IRangePercentFilter extends IBaseFilter {
    suffix: string;
    shouldDisable: string;
}

export class RangePercentFilter extends BaseFilter<string> implements IRangePercentFilter {
    public suffix: string;
    public shouldDisable: string;

    constructor(stateName, title, suffix?, shouldDisable?) {
        super(RangePercentBoxFilter, RangePercentSummaryFilter, stateName, title, "0...1");
        this.suffix = suffix;
        this.shouldDisable = shouldDisable;
    }
}

export class OnOffFilter extends BaseFilter<boolean> {
    constructor(stateName, title, hideInBox = false) {
        super(OnOffBoxFilter, OnOffSummaryFilter, stateName, title, false);
        this.hideInBox = hideInBox;
    }
}

export interface IChipsFilter extends IBaseFilter {
    type: string;
    placeholder: string;
}

export class ChipsFilter extends BaseFilter<string[] | number[]> implements IChipsFilter {
    public type: string;
    public placeholder: string;

    constructor(stateName, title, placeholder) {
        super(ChipsBoxFilter, ChipsSummaryFilter, stateName, title, []);
        this.type = stateName;
        this.placeholder = placeholder;
    }
}

export interface IInputComboFilter extends IBaseFilter {
    placeholder?: string;
    iconName?: string;
    disabled?: boolean;
    disabledMsg?: string;
    errorMsg?: string;
    trackCategoryEvent?: string;
    dataAutomationAttrName?: string;
    searchIconTooltipText?: string;
}

export class InputComboFilter extends BaseFilter<string[] | number[]> implements IInputComboFilter {
    public placeholder?: string;
    public iconName?: string;
    public disabled?: boolean;
    public disabledMsg?: string;
    public errorMsg?: string;
    public trackCategoryEvent?: string;
    public dataAutomationAttrName?: string;
    public searchIconTooltipText?: string;

    constructor(
        stateName,
        title,
        placeholder,
        iconName,
        disabledMsg,
        errorMsg,
        trackCategoryEvent = "Input Combo",
        dataAutomationAttrName?,
        searchIconTooltipText?,
    ) {
        super(InputComboBoxFilter, InputComboSummaryFilter, stateName, title, []);
        this.placeholder = placeholder;
        this.iconName = iconName;
        this.disabledMsg = disabledMsg;
        this.errorMsg = errorMsg;
        this.trackCategoryEvent = trackCategoryEvent;
        this.dataAutomationAttrName = dataAutomationAttrName;
        this.searchIconTooltipText = searchIconTooltipText;
    }
}

export class CountryFilter extends BaseFilter<number> {
    constructor(stateName, title, hideUI = false) {
        super(CountryBoxFilter, CountrySummaryFilter, stateName, title, 0);
        this.hideInBox = hideUI;
        this.hideInSummary = hideUI;
    }
}

export interface IGrowthFilter extends IBaseFilter {
    availableMetrics: any;
}

export class GrowthFilter extends BaseFilter<any[]> implements IGrowthFilter {
    public availableMetrics: any;

    constructor(stateName) {
        super(GrowthBoxFilter, GrowthSummary, stateName, "", []);
        this.availableMetrics = availableGrowthFilters;
    }
}

export class CustomFilter<T = string[]> extends BaseFilter<T> implements IChipsFilter {
    public type: string;
    public placeholder: string;

    constructor({ stateName, title, placeholder, boxComponent, summaryComponent, initialValue }) {
        super(boxComponent, summaryComponent, stateName, title, initialValue);
        this.type = stateName;
        this.placeholder = placeholder;
    }
}

export interface IFunctionalFlagFilter {
    type?: string;
    inclusion: string;
}

export class FunctionalFlagFilter extends BaseFilter<IFunctionalFlagFilter> {
    constructor(stateName, isLocked, trialHookName) {
        super(
            FunctionalFlagBoxFilter,
            FunctionalFlagSummary,
            stateName,
            "",
            { type: FUNCTIONAL_FLAG_ALL, inclusion: FUNCTIONAL_FLAG_INCLUDE },
            isLocked,
            trialHookName,
        );
    }
}

export class FunctionalFlagFilterRadioBtn extends BaseFilter<IFunctionalFlagFilter> {
    constructor(stateName, isLocked, trialHookName) {
        super(
            FunctionalFlagBoxRadioBtnFilter,
            FunctionalFlagBoxRadioBtnSummary,
            stateName,
            "",
            { inclusion: FLAG_INCLUDE },
            isLocked,
            trialHookName,
        );
    }

    hasValue(): boolean {
        return false;
    }
}
