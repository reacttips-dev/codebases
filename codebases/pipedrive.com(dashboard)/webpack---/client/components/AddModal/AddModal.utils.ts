import TranslatorClient from '@pipedrive/translator-client';
import { getConfig as getDealModalConfig } from 'components/AddModal/AddDealModal/AddDealModal.config';
import { getConfig as getLeadModalConfig } from 'components/AddModal/AddLeadModal/AddLeadModal.config';
import { getConfig as getOrgModalConfig } from 'components/AddModal/AddOrgModal/AddOrgModal.config';
import { getConfig as getPersonModalConfig } from 'components/AddModal/AddPersonModal/AddPersonModal.config';
import { getConfig as getProductModalConfig } from 'components/AddModal/AddProductModal/AddProductModal.config';
import { getConfig as getProjectModalConfig } from 'components/AddModal/AddProjectModal/AddProjectModal.config';
import { getOrgFieldKey, getPersonFieldKey } from 'components/Fields/Fields.utils';
import _, { cloneDeep, isEmpty } from 'lodash';
import { Router, SocketHandler, UserSelf } from 'Types/@pipedrive/webapp';
import {
	APIResponse,
	Deal,
	Lead,
	ModalConfig,
	ModalError,
	ModalField,
	ModalState,
	ModalType,
	ModalUpdateState,
	Organization,
	Person,
	RelatedEntityFields,
	RelatedEntityFieldIds,
	RelatedEntityState,
	RelatedEntityType,
	RequiredFields,
	ShowFields,
} from 'Types/types';

import { isRequiredField } from './AddModal.error';

export const CUSTOM_FIELDS_COACHMARK_TAG = 'emnt_customFields_addDataModal';

export const openDetailsPageIfNeeded = (
	id: string | number,
	modalConfig: ModalConfig,
	userSelf: UserSelf,
	router: Router,
) => {
	if (modalConfig.openDetailsSettingsKey && userSelf.settings.get(modalConfig.openDetailsSettingsKey)) {
		router.go(null, modalConfig.createDetailsUrl(String(id)));
	}
};

export const getModalConfig = (modalType: ModalType, translator: TranslatorClient): ModalConfig => {
	const modalTypes = {
		organization: () => getOrgModalConfig(translator),
		person: () => getPersonModalConfig(translator),
		deal: () => getDealModalConfig(translator),
		lead: () => getLeadModalConfig(translator),
		product: () => getProductModalConfig(translator),
		project: () => getProjectModalConfig(translator),
	};

	if (!modalTypes[modalType]) {
		throw new Error(`Requested modal config with invalid modalType: ${modalType}`);
	}

	return modalTypes[modalType]();
};

export const getModalTypes = (): ModalType[] => {
	return ['organization', 'person', 'deal', 'lead', 'product', 'project'];
};

export const mapRelatedEntityFields = (
	modalType: ModalType,
	relatedEntityFieldIds: RelatedEntityFieldIds,
	showFields: ShowFields,
	userSelf: UserSelf,
): RelatedEntityFields => {
	const createRelatedEntityFields = (type: 'organization' | 'person') => {
		return _(relatedEntityFieldIds[type] || [])
			.map((fieldId) => userSelf.fields.attributes[type].find((field) => field.id === fieldId))
			.concat(
				(showFields[type] || []).map((fieldKey) =>
					userSelf.fields.attributes[type].find((field) => field.key === fieldKey),
				),
			)
			.filter((x) => x)
			.uniqBy('id')
			.value();
	};

	if (modalType === 'person') {
		const organizationFields = createRelatedEntityFields('organization');

		return {
			organization: organizationFields,
			hasFields: organizationFields.length > 0,
		};
	}

	if (modalType === 'deal' || modalType === 'lead') {
		const personFields = createRelatedEntityFields('person');
		const organizationFields = createRelatedEntityFields('organization');

		return {
			person: personFields,
			organization: organizationFields,
			hasFields: personFields.length > 0 || organizationFields.length > 0,
		};
	}

	return {
		hasFields: false,
	};
};

export const getUpdateModalState = (
	{ key, value, type, ...rest }: ModalUpdateState,
	modalType: ModalType,
	translator: TranslatorClient,
) => {
	const updateableTitleFields = [getOrgFieldKey(modalType), getPersonFieldKey(modalType)];

	const shouldUpdateTitle = ['lead', 'deal'].includes(modalType) && updateableTitleFields.includes(key);

	if (value === '' || value === null) {
		return (prevState: ModalState) => {
			const clonedState = {
				...prevState,
			};

			if (shouldUpdateTitle) {
				const title = updateTitle(clonedState, { key, value, type }, translator, modalType);

				if (isEmpty(title)) {
					delete clonedState.title;
				} else {
					clonedState.title = title;
				}
			}

			delete clonedState[key];

			return clonedState;
		};
	}

	return (prevState: ModalState) => {
		const clonedState = {
			...prevState,
		};

		if (shouldUpdateTitle) {
			clonedState.title = updateTitle(clonedState, { key, value, type }, translator, modalType);
		}

		clonedState[key] = {
			key,
			value,
			type,
			...rest,
		};

		return clonedState;
	};
};

const updateTitle = (
	state: ModalState,
	{ key, value }: ModalUpdateState,
	translator: TranslatorClient,
	modalType: ModalType,
): ModalField => {
	const personFieldKey = getPersonFieldKey(modalType);
	const organizationFieldKey = getOrgFieldKey(modalType);

	const isPersonFieldChangeAndOrgExist = key === personFieldKey && !!state[organizationFieldKey]?.value;
	const isOrgFieldChangeAndPersonExist = key === organizationFieldKey && !!state[personFieldKey]?.value;

	if (state.title) {
		if (isPersonFieldChangeAndOrgExist) {
			return state.title;
		}

		if (state.title.isManualChange) {
			return state.title;
		}
	}

	if (!value) {
		if (isPersonFieldChangeAndOrgExist) {
			return createTitle(
				translator,
				state[organizationFieldKey]?.value as unknown as { name: string },
				modalType,
			);
		}

		if (isOrgFieldChangeAndPersonExist) {
			return createTitle(translator, state[personFieldKey]?.value as unknown as { name: string }, modalType);
		}

		return {} as ModalField;
	}

	return createTitle(translator, value, modalType);
};

const createTitle = (translator: TranslatorClient, value: string | { name: string }, modalType: ModalType) => {
	if (!value) {
		return {} as ModalField;
	}

	const name = value.hasOwnProperty('name') ? (value as { name: string }).name : (value as string);

	const dealTitle = translator.pgettext('Default value for deal title, e.g. "My organization deal"', '%s deal', name);

	const leadTitle = translator.pgettext('Default value for lead title, e.g. "My organization lead"', '%s lead', name);

	const translatedTitle = modalType === 'deal' ? dealTitle : leadTitle;

	return {
		key: 'title',
		value: translatedTitle,
		type: 'varchar',
	};
};

export const getUpdateRelatedEntityState = (
	prevState: RelatedEntityState,
	relatedEntityType: RelatedEntityType,
	{ key, value, type, ...rest }: ModalUpdateState,
) => {
	return {
		...prevState,
		[relatedEntityType]: {
			...prevState[relatedEntityType],
			[key]: {
				key,
				value,
				type,
				...rest,
			},
		},
	};
};

interface CheckRequiredFieldsInStateProps {
	state: ModalState;
	fieldKeyMap: { [key: string]: string };
	entityRequiredFields?: RequiredFields;
	errors: ModalError;
	translator: TranslatorClient;
}

export const checkRequiredFieldsInState = ({
	state,
	fieldKeyMap,
	entityRequiredFields = {},
	errors,
	translator,
}: CheckRequiredFieldsInStateProps): ModalError => {
	Object.keys(fieldKeyMap).forEach((key) => {
		const requiredFieldConfig = entityRequiredFields[key];

		if (!requiredFieldConfig) {
			return;
		}

		const isEmptyField =
			!state[key] ||
			state[key].value === '' ||
			(state[key].type === 'enum' && state[key].value !== null && (state[key].value as number) === 0);

		if (isEmptyField && isRequiredField(state, key, entityRequiredFields)) {
			errors[key] = translator.gettext('%s is required', fieldKeyMap[key]);
		}
	});

	return errors;
};

export const sendSocketMessage = (
	modalType: ModalType,
	socketHandler: SocketHandler,
	response: APIResponse<Lead | Deal | Person | Organization>,
) => {
	if (!socketHandler?.notify) {
		return;
	}

	const meta = cloneDeep(response.additional_data) as { matches_filters?: any };

	if (meta && meta.matches_filters) {
		meta.matches_filters = {
			current: meta.matches_filters,
		};
	}

	socketHandler.notify(modalType, 'added', {
		meta,
		current: cloneDeep(response.data),
		related_objects: cloneDeep(response.related_objects),
		previous: null,
	});
};
