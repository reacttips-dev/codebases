import type { Culture } from './Culture';

export type LocalizationFunction<StringResourceIds extends string> = (
    resourceId: StringResourceIds
) => string;

export type LocalizedStringLookup<StringResourceIds extends string> = {
    [K in StringResourceIds]: string;
};

export async function loadTranslations<StringResourceIds extends string>(
    culture: Culture,
    asyncImport: (culture: Culture) => Promise<LocalizedStringLookup<StringResourceIds>>
): Promise<LocalizationFunction<StringResourceIds>> {
    const translations = await asyncImport(culture);

    return (resourceId: StringResourceIds) => translations[resourceId];
}
