import { has, snakeCase, get, set, negate, isNil, camelCase, isObject, cloneDeep } from 'lodash';
import {
	getActivityTypeByKey,
	handleHiddenDeal,
	handleHiddenOrg,
	handleHiddenPerson,
} from '../../../../../utils/activity';
import { reduceAsync } from '../../../../../utils/async';
import {
	createOrganization,
	createPerson,
	getDealById,
	getOrganizationById,
	getPersonById,
	getProjectById,
} from '../../../../../api';

let undef;

const ACTIVITY_FIELDS = [
	'subject',
	'type',
	'dueDate',
	'dueTime',
	'duration',
	'location',
	'locationGeocoded',
	'publicDescription',
	'busyFlag',
	'done',
	'note',
	'userId',
	'deal',
	'lead',
	'project',
	'attendees',
	'organization',
	'participants',
	'sendActivityNotifications',
	'notificationLanguageId',
	'shouldSendUpdatesToAttendees',
	'conferenceMeetingClient',
	'conferenceMeetingUrl',
	'conferenceMeetingId',
];

const relatedFields = {
	deal: {
		related: 'deal_id',
		from: (val) => val && val.id,
	},
	lead: [
		{
			related: 'lead_id',
			from: (val) => val && val.id,
		},
	],
	project: [
		{
			related: 'project_id',
			from: (val) => val && val.id,
		},
	],
	organization: {
		related: 'org_id',
		from: async (val, activity, { notifyChangesExternally }) => {
			if (!val) {
				return null;
			}

			if (val.id === null) {
				try {
					const organization = await createOrganization({ name: val.name });

					notifyChangesExternally('organization', 'added', {
						related_objects: cloneDeep(organization.related_objects),
						meta: cloneDeep(organization.additional_data),
						current: cloneDeep(organization.data),
						previous: null,
					});

					return get(organization, 'data.id', null);
				} catch (e) {
					return null;
				}
			}

			// hidden org id is sent as value
			return val.id || val.value;
		},
	},
	participants: [
		{
			related: 'participants',
			from: async (participants, activity, { notifyChangesExternally }) => {
				if (!participants) {
					return participants;
				}

				const orgId = activity && activity.org_id ? activity.org_id : null;
				const results = await Promise.all(
					participants.map(async (participant, index) => {
						if (!participant.is_new) {
							const personId =
								participant.id || participant.value || participant.person_id;

							if (!personId) {
								const error = new Error('Participant lacks person id');

								error.extra = { participant };

								throw error;
							}

							return {
								person_id: personId,
								primary_flag: index === 0,
							};
						}

						try {
							const person = await createPerson({
								name: participant.name,
								...(orgId ? { org_id: orgId } : {}),
							});

							notifyChangesExternally('person', 'added', {
								related_objects: cloneDeep(person.related_objects),
								meta: cloneDeep(person.additional_data),
								current: cloneDeep(person.data),
								previous: null,
							});

							return {
								person_id: get(person, 'data.id'),
								primary_flag: index === 0,
							};
						} catch (e) {
							return null;
						}
					}),
				);

				return results.filter(negate(isNil));
			},
		},
		{
			// When participants are not set on activity creation, but deal is, the person_id must be empty string,
			// otherwise the participant is set by the deal ¯\_(ツ)_/¯. This is how old modal works. Should be fixed in back-end,
			// and then this conversion removed. (Jira ticket SAT-388)
			related: 'person_id',
			from: (participants) => (!participants || 0 === participants.length ? '' : undef),
		},
	],
};

const undefTransformer = (value) => {
	if (!value) {
		return undef;
	}

	return value;
};

const fieldTransforms = {
	subject: {
		toField: 'subject',
		transformer: (value, state, { webappApi }) => {
			if (value) {
				return value;
			}

			const typeKey = state.form.type;

			if (!typeKey) {
				return value;
			}

			const selectedType = getActivityTypeByKey(webappApi, typeKey);

			if (!selectedType) {
				return value;
			}

			return selectedType.name;
		},
	},
	sendActivityNotifications: {
		toField: 'send_activity_notifications',
		transformer: undefTransformer,
	},
	shouldSendUpdatesToAttendees: {
		toField: '_meta.notify_attendees',
		transformer: undefTransformer,
	},
	locationGeocoded: {
		toField: 'location_geocoded',
		transformer: (value) => (value ? JSON.stringify(value) : undef),
	},
};

const TRY_FIELD_STATES = ['form', 'notifications'];

const getTransformedRelatedValues = async ({ fieldTransform, fieldTransformParams }) => {
	const fieldTransformRules = [].concat(fieldTransform);

	return reduceAsync(
		fieldTransformRules,
		async (acc, fieldTransformRules) => {
			const value = await fieldTransformRules.from(...fieldTransformParams);

			return set(acc, fieldTransformRules.related, value);
		},
		{},
	);
};

const getActivityData = (state, { webappApi, notifyChangesExternally }) =>
	reduceAsync(
		ACTIVITY_FIELDS,
		async (activity, field) => {
			const fieldState = TRY_FIELD_STATES.find((name) => has(state, `${name}.${field}`));

			if (!fieldState) {
				return activity;
			}

			const fieldTransform = fieldTransforms[field];
			const relatedFieldTransform = relatedFields[field];
			const fieldValue = get(state, `${fieldState}.${field}`);

			if (fieldTransform) {
				const values = set(
					{},
					fieldTransform.toField,
					fieldTransform.transformer(fieldValue, state, { webappApi }),
				);

				return {
					...activity,
					...values,
				};
			}

			if (relatedFieldTransform) {
				const values = await getTransformedRelatedValues({
					fieldTransform: relatedFieldTransform,
					fieldTransformParams: [fieldValue, activity, { notifyChangesExternally }],
				});

				return {
					...activity,
					...values,
				};
			}

			return {
				...activity,
				[snakeCase(field)]: fieldValue,
			};
		},
		{},
	);

// eslint-disable-next-line complexity
const extractActivityDataToFields = (activityResponse, translator, callLog) => {
	const itemHiddenText = translator.gettext('hidden');
	const { data: activity, related_objects: relatedObjects } = activityResponse;

	const deal = get(
		relatedObjects,
		`deal.${activity.deal_id}`,
		handleHiddenDeal(activity.deal_id, itemHiddenText),
	);

	const lead = activity.lead_id ? { id: activity.lead_id, title: activity.lead_title } : null;

	const organization = get(
		relatedObjects,
		`organization.${activity.org_id}`,
		handleHiddenOrg(activity.org_id, itemHiddenText),
	);
	const participants = activity.participants
		? activity.participants.map((participant) => ({
				...participant,
				...get(
					relatedObjects,
					`person.${participant.person_id}`,
					handleHiddenPerson(participant.person_id, itemHiddenText),
				),
		  }))
		: [];

	const { id: callLogId, recording_url: recordingUrl = '' } = callLog ? callLog : {};

	return {
		...Object.keys(activity).reduce(
			(fields, key) => ({ ...fields, [camelCase(key)]: activity[key] }),
			{},
		),
		participants,
		...(deal ? { deal } : {}),
		...(lead ? { lead } : {}),
		...(organization ? { organization } : {}),
		...(callLogId ? { callLogId } : {}),
		...(recordingUrl ? { recordingUrl } : {}),
	};
};

const handleHiddenRelatedItem = (related, hiddenText, hiddenWrapper) => {
	return related ? (isObject(related) ? related : hiddenWrapper(related, hiddenText)) : null;
};

const relatedObjectsFromDeal = {
	person: {
		idKey: 'person_id',
		relatedObjectKey: 'person',
	},
	org: {
		idKey: 'org_id',
		relatedObjectKey: 'organization',
	},
};

const getRelatedObjectFromDeal = (dealResponse, relatedObject) => {
	if (!dealResponse || !relatedObject) {
		return null;
	}

	const { idKey, relatedObjectKey } = relatedObject;
	const id = get(dealResponse, ['data', idKey], null);

	// there is some old legacy logic where person_id is an object
	if (isObject(id)) {
		return id;
	}

	return id && get(dealResponse, ['related_objects', relatedObjectKey, id], id);
};

const handleGetObjectByIdError = ({ objectId, dealId }) => {
	// if deal id exists, return null => gets object data from deal related objects
	// necessary when user has permission to see names of hidden objects
	return dealId ? null : { data: objectId };
};

const fetchActivityRelatedObjects = async (
	{ dealId, lead, project, personId, orgId },
	translator,
) => {
	const itemHiddenText = translator.gettext('hidden');
	const relatedObjects = {};

	const [dealResponse, personResponse, orgResponse, projectResponse] = await Promise.all([
		dealId && getDealById(dealId).catch(() => handleGetObjectByIdError({ objectId: dealId })),
		personId &&
			getPersonById(personId).catch(() =>
				handleGetObjectByIdError({ objectId: personId, dealId }),
			),
		orgId &&
			getOrganizationById(orgId).catch(() =>
				handleGetObjectByIdError({ objectId: orgId, dealId }),
			),
		project &&
			!project.title &&
			getProjectById(project.id).catch(() => {
				return { id: project.id };
			}),
	]);

	const relatedDeal = get(dealResponse, 'data', dealId);

	relatedObjects.deal = handleHiddenRelatedItem(relatedDeal, itemHiddenText, handleHiddenDeal);

	relatedObjects.lead = handleHiddenRelatedItem(lead, itemHiddenText, handleHiddenDeal);
	relatedObjects.project = project?.title ? project : get(projectResponse, 'data') || null;

	const relatedPerson = get(
		personResponse,
		'data',
		getRelatedObjectFromDeal(dealResponse, relatedObjectsFromDeal.person),
	);
	const relatedOrganization = get(
		orgResponse,
		'data',
		getRelatedObjectFromDeal(dealResponse, relatedObjectsFromDeal.org),
	);

	const participant = handleHiddenRelatedItem(relatedPerson, itemHiddenText, handleHiddenPerson);

	if (participant) {
		relatedObjects.participants = [participant];
	}

	relatedObjects.organization = handleHiddenRelatedItem(
		relatedOrganization,
		itemHiddenText,
		handleHiddenOrg,
	);

	return relatedObjects;
};

const fetchDealDependentFields = async (deal, organization, hasParticipants, translator) => {
	const { org_id: orgId, person_id: personId } = deal;

	if (!orgId && !personId) {
		return null;
	}

	const {
		organization: dealOrg,
		participants: dealParticipants,
	} = await fetchActivityRelatedObjects(
		{
			...(organization ? {} : { orgId }),
			...(hasParticipants ? {} : { personId }),
		},
		translator,
	);

	return {
		deal,
		...(!organization && dealOrg ? { organization: dealOrg } : {}),
		...(!hasParticipants && dealParticipants ? { participants: dealParticipants } : {}),
	};
};

const getParticipantOrgId = async (participant, translator) => {
	// eslint-disable-next-line camelcase
	const orgId = participant?.org_id;
	const personId = participant?.id;

	if (!orgId) {
		const { participants: dealParticipants } = await fetchActivityRelatedObjects(
			{ personId },
			translator,
		);
		const dealParticipant = dealParticipants?.[dealParticipants.length - 1];

		// eslint-disable-next-line camelcase
		return dealParticipant?.org_id?.value;
	}

	return orgId;
};

export const dependentFields = {
	deal: async (value, state, translator) => {
		const {
			form: { participants, organization },
		} = state;
		const hasParticipants = participants && participants.length;

		if (!value || (hasParticipants && organization)) {
			return null;
		}

		return await fetchDealDependentFields(value, organization, hasParticipants, translator);
	},
	// eslint-disable-next-line complexity
	participants: async (value, state, translator) => {
		const {
			form: { organization },
		} = state;
		const lastParticipant = value?.[value.length - 1];
		const orgId = await getParticipantOrgId(lastParticipant, translator);

		if (!value || !value.length || organization || !orgId) {
			return null;
		}

		const { organization: personOrg } = await fetchActivityRelatedObjects(
			{ orgId },
			translator,
		);

		return {
			participants: value,
			...(personOrg ? { organization: personOrg } : {}),
		};
	},
};

const fetchDependentFields = async (field, value, state, translator) => {
	if (!(field in dependentFields)) {
		return null;
	}

	return await dependentFields[field](value, state, translator);
};

export {
	getActivityData,
	extractActivityDataToFields,
	fetchActivityRelatedObjects,
	fetchDependentFields,
};
