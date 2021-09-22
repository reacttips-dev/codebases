import { ShortenEventScopeType } from '../store/schema/ShortenEventScopeType';

/**
 * Normalize the shorten event scope setting string.
 */
export default function normalizeShortenEventScopeValue(
    settingValue: string
): ShortenEventScopeType | null {
    switch (settingValue.toLowerCase()) {
        case ShortenEventScopeType.EndEarly.toLowerCase():
            return ShortenEventScopeType.EndEarly;
        case ShortenEventScopeType.StartLate.toLowerCase():
            return ShortenEventScopeType.StartLate;
        case ShortenEventScopeType.None.toLowerCase():
            return ShortenEventScopeType.None;
    }

    return null;
}
