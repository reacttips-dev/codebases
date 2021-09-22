import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";

const DEFAULT_CPC_PREFIX = "$";
const DECIMAL_POINT = ".";
const CPC_DIGITS_AMOUNT_AFTER_DECIMAL = 2;
const i18n = i18nFilter();
const i18nKeys = {
    VOLUME: {
        VOLUME: "common.volume",
        UP_TO: "common.filters.volume.range.filter.up.to",
        AT_LEAST: "common.filters.volume.range.filter.at.least",
    },
    CPC: {
        CPC: "common.cpc",
        UP_TO: "common.filters.cpc.range.filter.up.to",
        AT_LEAST: "common.filters.cpc.range.filter.at.least",
    },
};

export const INITIAL_RANGE_VALUES = { fromValue: undefined, toValue: undefined };

export const closeChipDown = (chipDownRef) => chipDownRef?.current?.closePopup();

export const onDoneCallback = (reducer, chipDownRef) => ({ fromValue, toValue }) => {
    const zero = Number();
    reducer({ fromValue: fromValue > zero ? fromValue : zero, toValue });
    closeChipDown(chipDownRef);
};

const isValidVolumeRangeValue = (value) => {
    const valueNumber = value ? Number(value) : Number();
    const valueString = String(value);
    return (
        !(valueString.length > 1 && valueString?.startsWith(String(Number()))) &&
        Number.isInteger(valueNumber) &&
        (value === String() || !valueString.includes(DECIMAL_POINT))
    );
};
export const isValidVolumeRangeValues = (fromValue, toValue) =>
    isValidVolumeRangeValue(fromValue) && isValidVolumeRangeValue(toValue);

const isValidCpcRangeValue = (value) =>
    value.substring(value.indexOf(DECIMAL_POINT)).length < CPC_DIGITS_AMOUNT_AFTER_DECIMAL + 2 &&
    !(value?.length > 1 && value[0] === String(Number()) && value[1] !== DECIMAL_POINT);

export const isValidCpcRangeValues = (fromValue, toValue) =>
    isValidCpcRangeValue(fromValue) && isValidCpcRangeValue(toValue);

export const onContainerKeyDown = (chipDownRef) => (event) => {
    const { keyCode } = event;
    const ESC_KEY_CODE = 27;
    if (keyCode === ESC_KEY_CODE) {
        closeChipDown(chipDownRef);
    }
};

export const resetRangeValues = (reducer) => () => reducer(INITIAL_RANGE_VALUES);

export const cpcValuesFormatter = (value) => value && DEFAULT_CPC_PREFIX + value;

export const cpcValuesParser = (value) => value && value.replace(DEFAULT_CPC_PREFIX, String());

export const getCpcSelectedText = (cpcValue) => {
    const toValue = Number(cpcValue.toValue);
    const fromValue = Number(cpcValue.fromValue);
    if (!toValue && !fromValue) {
        return undefined;
    }
    if (!toValue && fromValue) {
        return `${i18n(i18nKeys.CPC.AT_LEAST)} ${DEFAULT_CPC_PREFIX}${fromValue}`;
    }
    if (toValue && !fromValue) {
        return `${i18n(i18nKeys.CPC.UP_TO)} ${DEFAULT_CPC_PREFIX}${toValue}`;
    }
    return `${i18n(
        i18nKeys.CPC.CPC,
    )} ${DEFAULT_CPC_PREFIX}${fromValue} - ${DEFAULT_CPC_PREFIX}${toValue}`;
};
export const getVolumeSelectedText = (volumeValue) => {
    const toValue = Number(volumeValue.toValue);
    const fromValue = Number(volumeValue.fromValue);
    const abbrNumber = abbrNumberFilter();
    if (!toValue && !fromValue) {
        return undefined;
    }
    if (!toValue && fromValue) {
        return `${i18n(i18nKeys.VOLUME.AT_LEAST)} ${abbrNumber(fromValue)}`;
    }
    if (toValue && !fromValue) {
        return `${i18n(i18nKeys.VOLUME.UP_TO)} ${abbrNumber(toValue)}`;
    }
    return `${i18n(i18nKeys.VOLUME.VOLUME)} ${abbrNumber(fromValue)} - ${abbrNumber(toValue)}`;
};

const createRangeFilterQueryParamValue = (queryParamPrefix, fromValue, toValue) => {
    const SECTION_DELIMITER = ",";
    if (!fromValue && !toValue) {
        return null;
    }
    return (
        queryParamPrefix +
        SECTION_DELIMITER +
        (fromValue ?? String()) +
        SECTION_DELIMITER +
        (toValue ?? String())
    );
};
export const getRangeFilterQueryParamValue = (config: IRangeFilter[] = []) => {
    const RANGE_FILTER_QUERY_PARAMS_DELIMITER = "|";
    const ranges = config
        .map((item) => {
            return createRangeFilterQueryParamValue(item.name, item.fromValue, item.toValue);
        })
        .filter((range) => range);
    if (ranges.length === 0) {
        return null;
    }
    return ranges.join(RANGE_FILTER_QUERY_PARAMS_DELIMITER);
};

interface IRangeFilter {
    name: string;
    fromValue: string | number;
    toValue: string | number;
}

export const createCpcFilter: (
    fromValue: string,
    toValue: string,
    name?: string,
) => IRangeFilter = (fromValue, toValue, name = "cpc") => {
    return {
        name,
        fromValue,
        toValue,
    };
};
export const createVolumeFilter: (
    fromValue: string,
    toValue: string,
    name?: string,
) => IRangeFilter = (fromValue, toValue, name = "kwvolume") => {
    return {
        name,
        fromValue,
        toValue,
    };
};
export const createPositionFilter: (
    fromValue: string,
    toValue: string,
    name?: string,
) => IRangeFilter = (fromValue, toValue, name = "position") => {
    return {
        name,
        fromValue,
        toValue,
    };
};
