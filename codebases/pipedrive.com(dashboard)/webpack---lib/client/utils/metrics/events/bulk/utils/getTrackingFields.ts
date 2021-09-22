type SupportedTrackingFieldNames = 'label' | 'value' | 'title' | 'owner' | 'visibility';
export type SupportedTrackingFields = Array<SupportedTrackingFieldNames>;

const map = new Map<string, SupportedTrackingFieldNames>([
	// key -> tracking key
	['labels', 'label'],
	['ownerLegacyId', 'owner'],
	['title', 'title'],
	['value', 'value'],
	['visibleTo', 'visibility'],
]);

export function getEmptiedFields<T>(object: T): SupportedTrackingFields {
	const supportedFields: SupportedTrackingFields = [];

	for (const [key, value] of Object.entries(object)) {
		const trackingKey = map.get(key);
		if (value == null && trackingKey != null) {
			supportedFields.push(trackingKey);
		}
	}

	return supportedFields;
}

export function getReplacedFields<T>(object: T): SupportedTrackingFields {
	const supportedFields: SupportedTrackingFields = [];

	for (const [key, value] of Object.entries(object)) {
		const trackingKey = map.get(key);
		if (value != null && trackingKey != null) {
			supportedFields.push(trackingKey);
		}
	}

	return supportedFields;
}

// Edited fields are fields which are either emptied OR replaced OR both.
export function getEditedFields(
	emptiedFields: SupportedTrackingFields,
	replacedFields: SupportedTrackingFields,
): SupportedTrackingFields {
	return Array.from(new Set([...emptiedFields, ...replacedFields]));
}
