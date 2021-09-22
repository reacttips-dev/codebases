import { mapFieldType } from '@pipedrive/form-fields';
import TranslatorClient from '@pipedrive/translator-client';
import { getFirstStageId } from 'components/AddModal/AddDealModal/AddDealModal.utils';
import { isContactField, isTitleField } from 'components/Fields/FormField/Form.field.utils';
import { isString, isNil, orderBy, isNumber } from 'lodash';
import {
	Field,
	Fields,
	FieldsByType,
	FormFieldsOnChange,
	ModalConfig,
	ModalState,
	ModalType,
	ParsedWebappApi,
	Prefill,
	RelatedEntityState,
	Settings,
	User,
} from 'Types/types';
import { getOwnerFieldKey } from '../Fields/Fields.utils';

export const getInitialState = (
	settings: Settings,
	prefill: {
		[key: string]: string | number;
	},
	fieldsByType: FieldsByType,
	modalType: ModalType,
	modalConfig: ModalConfig,
	translator: TranslatorClient,
	parsedWebappApi: ParsedWebappApi,
	// eslint-disable-next-line max-params
): ModalState => {
	const { pipelines, stages, users, currentUserId } = parsedWebappApi;

	const fields: Fields = fieldsByType[modalType];

	let initialState = getPrefilledState(prefill, fields.allFields);

	if (['deal', 'lead'].includes(modalType)) {
		initialState = prefillTitle(initialState, translator);

		if (fields.visibleFields.some((field: Field) => field.key === 'renewal_type')) {
			initialState = {
				...initialState,
				renewal_type: {
					key: 'renewal_type',
					value: 'one_time',
					type: 'enum',
					isManualChange: true,
				},
			};
		}
	}

	if (modalConfig.defaultVisibilitySettingsKey && !initialState.visible_to) {
		initialState.visible_to = {
			key: 'visible_to',
			value: settings[modalConfig.defaultVisibilitySettingsKey],
			type: 'visibility',
		};
	}

	if (modalType === 'deal') {
		const defaultPipelineId = settings.currentPipelineId || orderBy(pipelines, 'order_nr')[0].id;

		if (!initialState.pipeline_id) {
			initialState.pipeline_id = {
				key: 'pipeline_id',
				value: defaultPipelineId,
				type: 'pipeline_id',
			};
		}

		if (!initialState.stage_id) {
			initialState.stage_id = {
				key: 'stage_id',
				value: getFirstStageId(stages, defaultPipelineId),
				type: 'stage_id',
			};
		}
	}

	const ownerFieldKey = getOwnerFieldKey(modalType);

	initialState = prefillOwnerField(initialState, fields.visibleFields, users, currentUserId, ownerFieldKey);

	return initialState;
};

export const getInitialRelatedEntityState = (
	prefillRelatedEntities: RelatedEntityState,
	fields: FieldsByType,
	parsedWebappApi: ParsedWebappApi,
): RelatedEntityState => {
	const { users, currentUserId } = parsedWebappApi;

	const relatedEntityState = {
		deal: {},
		person: {},
		organization: {},
		product: {
			products: {
				value: [],
			},
		},
	};

	relatedEntityState.person = prefillOwnerField(
		relatedEntityState.person,
		fields.person.visibleFields,
		users,
		currentUserId,
	);

	relatedEntityState.organization = prefillOwnerField(
		relatedEntityState.organization,
		fields.organization.visibleFields,
		users,
		currentUserId,
	);

	if (!prefillRelatedEntities) {
		return relatedEntityState;
	}

	return Object.keys(prefillRelatedEntities).reduce((state, key) => {
		state[key] = getPrefilledState(prefillRelatedEntities[key], fields[key].allFields);

		return state;
	}, relatedEntityState);
};

export const getAdditionalParams = (changedValue: FormFieldsOnChange, key: string) => {
	if (isContactField(key)) {
		return { isNew: isNewContact(changedValue) };
	}

	if (isTitleField(key)) {
		return { isManualChange: !!changedValue };
	}

	return {};
};

const getPrefilledState = (prefill: Prefill, fields: Field[]) => {
	return Object.keys(prefill).reduce((state: any, key: string) => {
		const currentField = fields.find((field: Field) => field.key === key);

		if (!currentField) {
			return state;
		}

		return {
			...state,
			[key]: {
				key,
				value: prefill[key],
				// @ts-ignore
				type: mapFieldType(currentField.key, currentField.field_type),
				...getAdditionalParams(prefill[key], key),
			},
		};
	}, {});
};

export const isNewContact = (value: any) => {
	return isString(value);
};

const getName = (state: ModalState, type: string): string => {
	const value = state[type].value;

	if (isNil(value)) {
		return '';
	}

	if (isString(value) || isNumber(value)) {
		return String(value);
	}

	return (value as unknown as { name: string }).name;
};

const prefillTitle = (state: ModalState, translator: TranslatorClient) => {
	// In case it was already prefilled!
	if (state.title) {
		return state;
	}

	const createTitleField = (title: string) => ({
		key: 'title',
		value: title,
		type: 'varchar',
		isManualChange: true,
	});

	if (state.person_id && state.person_id.value) {
		state.title = createTitleField(
			translator.pgettext(
				'Default value for deal title, e.g. "My person deal"',
				'%s deal',
				getName(state, 'person_id'),
			),
		);
	}

	if (state.related_person_id && state.related_person_id.value) {
		state.title = createTitleField(
			translator.pgettext(
				'Default value for lead title, e.g. "My person lead"',
				'%s lead',
				getName(state, 'related_person_id'),
			),
		);
	}

	if (state.org_id && state.org_id.value) {
		state.title = createTitleField(
			translator.pgettext(
				'Default value for deal title, e.g. "My organization deal"',
				'%s deal',
				getName(state, 'org_id'),
			),
		);
	}

	if (state.related_org_id && state.related_org_id.value) {
		state.title = createTitleField(
			translator.pgettext(
				'Default value for lead title, e.g. "My organization lead"',
				'%s lead',
				getName(state, 'related_org_id'),
			),
		);
	}

	return state;
};

const prefillOwnerField = (
	state: ModalState,
	visibleFields: Field[] = [],
	users: User[],
	currentUserId: number,
	ownerFieldKey = 'user_id',
) => {
	const alreadyHasOwner = state[ownerFieldKey] !== undefined;

	if (alreadyHasOwner) {
		return state;
	}

	const hasOwnerField = visibleFields.some((field: Field) => field.key === ownerFieldKey);

	if (hasOwnerField) {
		const currentUser = users.find((user) => user.id === currentUserId);

		state[ownerFieldKey] = {
			key: ownerFieldKey,
			value: currentUser ? currentUser.id : null,
			type: 'user_id',
		};
	}

	return state;
};
