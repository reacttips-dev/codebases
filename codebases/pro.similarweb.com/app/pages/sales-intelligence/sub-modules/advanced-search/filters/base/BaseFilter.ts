import { TranslateFunction } from "app/@types/I18nInterfaces";
import {
    AdvancedSearchFilter,
    AdvancedSearchFilterDeps,
    SupportedFilterKey,
} from "../../types/filters";

export default class BaseFilter<V> implements AdvancedSearchFilter<V> {
    readonly key: SupportedFilterKey;
    private currentValue: V;
    private readonly initialValue: V;
    protected readonly translate: TranslateFunction;

    constructor(deps: AdvancedSearchFilterDeps<V>) {
        const { key, translate, initialValue, preSelectedValue } = deps;

        this.key = key;
        this.translate = translate;
        this.initialValue = initialValue;
        this.currentValue = this.initCurrentValue(preSelectedValue, initialValue);
    }

    getSummary() {
        return {
            filterKey: this.key,
            value: this.getSummaryValue(),
            name: this.translate(`si.lead_gen_filters.${this.key}.summary.name`),
        };
    }

    getInitialValue() {
        return this.initialValue;
    }

    getValue() {
        return this.currentValue;
    }

    setValue(value: V) {
        this.currentValue = value;
        return this;
    }

    inDirtyState() {
        return !this.inInitialState();
    }

    inInitialState() {
        return this.initialValue === this.currentValue;
    }

    inReadyState() {
        return !this.inInitialState();
    }

    reset() {
        this.currentValue = this.initialValue;
        return this;
    }

    compareValueWithDto(dto: unknown) {
        return this.currentValue === dto;
    }

    fromDto(dto: unknown) {
        return this.setValue(dto as V);
    }

    toDto() {
        return {
            [this.key]: this.currentValue as unknown,
        };
    }

    protected initCurrentValue(preSelectedValue: V, initialValue: V) {
        return preSelectedValue ?? initialValue;
    }

    protected getSummaryValue() {
        return String(this.currentValue);
    }
}
