export interface CustomPropertiesResult {
    errorMessage: string;
    wasSuccessful: boolean;
    customProperties?: string;
}

export function createCustomPropertiesResult(
    errorMessage: string,
    wasSuccessful: boolean,
    customProperties?: string
): CustomPropertiesResult {
    return { errorMessage, wasSuccessful, customProperties };
}
