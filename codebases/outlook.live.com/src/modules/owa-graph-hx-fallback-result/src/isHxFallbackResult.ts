import { HxFallbackReason } from './HxFallbackReason';
import type { HxFallbackResult } from './HxFallbackResult';

export const isHxFallbackResult = <TReason extends HxFallbackReason = HxFallbackReason>(
    result: any,
    code?: TReason
): result is HxFallbackResult<HxFallbackReason> => {
    return code !== undefined
        ? result?.extensions?.hxFallbackReason === code
        : result?.extensions?.hxFallbackReason !== undefined;
};

export const isHxNotSupportedResult = (
    result: any
): result is HxFallbackResult<HxFallbackReason.NotSupportedByHx> => {
    return isHxFallbackResult(result, HxFallbackReason.NotSupportedByHx);
};
