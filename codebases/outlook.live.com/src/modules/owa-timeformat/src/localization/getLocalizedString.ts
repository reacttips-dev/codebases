import { Culture, LocalizationFunction, loadTranslations } from 'owa-shared-localization';
import type stringIds from './locale/localizedStringIds.json';

export type OwaTimeformatLocalizedStringResourceId = keyof typeof stringIds;

let translationFunction: LocalizationFunction<OwaTimeformatLocalizedStringResourceId> | undefined;

export function getLocalizedString(resourceId: OwaTimeformatLocalizedStringResourceId): string {
    if (!translationFunction) {
        throw new Error('Localization has not yet been initialized');
    }

    return translationFunction(resourceId);
}

export async function initializeTranslations(culture: Culture): Promise<void> {
    if (process.env.__OWA_LOCALIZE__) {
        throw new Error('Do not initialize with culture within Outlook Web');
    } else {
        translationFunction = await loadTranslations(
            culture,
            culture => import(`./locale/${culture.toLowerCase()}.locstrings.json`)
        );
    }
}

export function initializeTranslationsWithFunc(
    localizationFunction: LocalizationFunction<OwaTimeformatLocalizedStringResourceId>
): void {
    translationFunction = localizationFunction;
}
