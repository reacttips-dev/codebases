import { RelatedObjects } from '../types/apollo-query-types';
import localState from './localState';

export const findRelatedObject = (id: number, type: keyof RelatedObjects) => {
	const { getCurrentUserSettings } = localState();
	const { relatedObjects } = getCurrentUserSettings();

	return relatedObjects?.[type]?.find(
		(relatedObject) => relatedObject.id === id,
	);
};
