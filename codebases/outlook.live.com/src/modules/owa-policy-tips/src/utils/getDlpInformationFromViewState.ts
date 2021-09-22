import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type PolicyTipsViewState from '../store/schema/PolicyTipsViewState';

const DISTINGUISHED_PROPERTY_SET_INTERNET_HEADERS = 'InternetHeaders';
const DLP_SENDER_OVERRIDE_JUSTIFICATION_WELL_KNOWN_PROPERTY_NAME =
    'X-Ms-Exchange-Organization-Dlp-SenderOverrideJustification';
const DLP_FALSE_POSITIVE_WELL_KNOWN_PROPERTY_NAME = 'X-Ms-Exchange-Organization-Dlp-FalsePositive';

export function getDlpInformationFromViewState(
    viewState: PolicyTipsViewState
): ExtendedPropertyType[] {
    const extendedProperties: ExtendedPropertyType[] = [];
    if (viewState.isReportedFalsePositive) {
        const extendedProperty: ExtendedPropertyType = {
            ExtendedFieldURI: {
                PropertyName: DLP_FALSE_POSITIVE_WELL_KNOWN_PROPERTY_NAME,
                PropertyType: 'String',
                DistinguishedPropertySetId: DISTINGUISHED_PROPERTY_SET_INTERNET_HEADERS,
            },
            Value: '', //Field is typed to string here, we provide an empty string by default.
        };
        extendedProperties.push(extendedProperty);
    }

    if (viewState.isOverridden) {
        const extendedProperty: ExtendedPropertyType = {
            ExtendedFieldURI: {
                PropertyName: DLP_SENDER_OVERRIDE_JUSTIFICATION_WELL_KNOWN_PROPERTY_NAME,
                PropertyType: 'String',
                DistinguishedPropertySetId: DISTINGUISHED_PROPERTY_SET_INTERNET_HEADERS,
            },
            Value: viewState.overrideJustification,
        };
        extendedProperties.push(extendedProperty);
    }

    return extendedProperties;
}
