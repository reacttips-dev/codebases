import { mapRelatedEntityFields } from 'components/AddModal/AddModal.utils';
import { useEffect, useState } from 'react';
import { Features, UserSelf } from 'Types/@pipedrive/webapp';
import { LeadLabels, ModalType, RelatedEntityFields, RequiredFieldsByType, ShowFields, UsageCaps, UsageCapsMapping } from 'Types/types';

import {
	getLeadLabels,
	getRelatedEntityFields,
	getRequiredFields,
	getUsageCaps,
	getUsageCapsMapping,
} from '../utils/api/api';

// Update type for getUsageCapsMapping
export function useAsyncData(
	modalType: ModalType,
	features: Features,
	showFields: ShowFields,
	userSelf: UserSelf,
): [boolean, RequiredFieldsByType, RelatedEntityFields, LeadLabels, UsageCaps, UsageCapsMapping] {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [requiredFields, setRequiredFields] = useState<RequiredFieldsByType>({});
	const [leadLabels, setLeadLabels] = useState<LeadLabels>([]);
	const [usageCaps, setUsageCaps] = useState<UsageCaps>({});
	const [usageCapsMapping, setUsageCapsMapping] = useState<UsageCapsMapping>({});
	const [relatedEntityFields, setRelatedEntityFields] = useState<RelatedEntityFields>({
		hasFields: false,
	});

	useEffect(() => {
		const loadRequiredFields = async () => {
			try {
				if (!features.requiredFields) {
					setRequiredFields({});

					return;
				}

				const requiredFieldsFromApi = await getRequiredFields(modalType);

				setRequiredFields(requiredFieldsFromApi);
			} catch (err) {
				setRequiredFields({});
			}
		};

		const loadRelatedEntityFields = async () => {
			try {
				// Organization has no related fields, so no point to make request!
				if (modalType === 'organization') {
					setRelatedEntityFields(mapRelatedEntityFields(modalType, {}, showFields, userSelf));

					return;
				}

				const relatedEntityFieldsFromApi = await getRelatedEntityFields(modalType);

				setRelatedEntityFields(
					mapRelatedEntityFields(modalType, relatedEntityFieldsFromApi, showFields, userSelf),
				);
			} catch (err) {
				setRelatedEntityFields(mapRelatedEntityFields(modalType, {}, showFields, userSelf));
			}
		};

		const loadLeadLabels = async () => {
			try {
				const labels = await getLeadLabels();

				setLeadLabels(labels);
			} catch (err) {
				setLeadLabels([]);
			}
		};

		const loadUsageCaps = async () => {
			try {
				if (!features.dealsUsageCapping) {
					setUsageCaps({});

					return;
				}

				const caps = await getUsageCaps(modalType);

				setUsageCaps(caps);
			} catch (err) {
				setUsageCaps({});
			}
		};

		const loadUsageCapsMapping = async () => {
			try {
				if (!features.dealsUsageCapping) {
					setUsageCapsMapping({});

					return;
				}

				const capsMapping = await getUsageCapsMapping();

				setUsageCapsMapping(capsMapping);
			} catch (err) {
				setUsageCapsMapping({});
			}
		};

		const loadAsyncData = async () => {
			const loaders = [loadRequiredFields(), loadRelatedEntityFields()];

			if (modalType === 'lead') {
				loaders.push(loadLeadLabels());
			}

			// Currently only added for Deal modal
			if (modalType === 'deal') {
				loaders.push(loadUsageCaps());
				loaders.push(loadUsageCapsMapping());
			}

			await Promise.all(loaders);
			setIsLoading(false);
		};

		loadAsyncData();
	}, []);

	return [isLoading, requiredFields, relatedEntityFields, leadLabels, usageCaps, usageCapsMapping];
}
