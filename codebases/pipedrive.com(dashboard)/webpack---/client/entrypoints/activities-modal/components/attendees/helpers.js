import { useEffect } from 'react';
import { unionWith } from 'lodash';

import { getDealParticipants, getOrganizationPeople } from '../../../../api';

const generateAttendeeId = () => {
	return `attendee_${Date.now()}`;
};

export const getNameFromEmail = (email) => {
	return email
		? email
				.split('@')[0]
				.split('.')
				.map((namePart) => `${namePart[0].toUpperCase()}${namePart.substr(1)}`)
				.join(' ')
		: '';
};

const EMAIL_REGEX = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isValidEmail = (email) => {
	return !!email && EMAIL_REGEX.test(email);
};

export const convertInputValueToAttendee = (inputValue) => {
	const isValid = isValidEmail(inputValue);

	return {
		email_address: inputValue,
		generatedUniqueKey: generateAttendeeId(),
		...(isValid ? { name: getNameFromEmail(inputValue) } : {}),
	};
};

export const getMatch = (searchResult, inputValue) => {
	const startIndex = searchResult.toLowerCase().indexOf(inputValue.toLowerCase());
	const length = inputValue.length;

	if (startIndex === -1) {
		return [{ value: searchResult, match: false }];
	}

	return [
		{ value: searchResult.substr(0, startIndex), match: false },
		{ value: searchResult.substr(startIndex, length), match: true },
		{ value: searchResult.substr(startIndex + length), match: false },
	];
};

const convertPersonToAttendee = (person, email) => {
	return {
		person_id: person.id,
		name: person.name,
		email_address: email,
	};
};

export const findAttendeeWithSameEmail = (searchResult, attendees) => {
	return attendees.find(
		(attendee) =>
			searchResult !== attendee &&
			searchResult &&
			attendee &&
			searchResult.email_address === attendee.email_address,
	);
};

export const getSearchResultsAsAttendees = (searchResults, selectedAttendees) => {
	const existingEmails = selectedAttendees.map(({ email_address: email }) => email);

	return searchResults.reduce((attendees, person) => {
		const personMultipleResults = person.emails
			.filter((value) => !!value && existingEmails.indexOf(value) === -1)
			.map((value) => convertPersonToAttendee(person, value));

		return attendees.concat(personMultipleResults);
	}, []);
};

export const getSearchResultKey = (person) => {
	return `${person.person_id}_${person.email_address}`;
};

export const getRecommendationKey = (person) => {
	return `${person.person_id}_${person.email_address}`;
};

export const getAttendeeTagKey = (attendee) => {
	if (!attendee) {
		return generateAttendeeId();
	}

	const attendeeId =
		attendee.person_id ||
		attendee.user_id ||
		attendee.generatedUniqueKey ||
		generateAttendeeId();

	return `${attendeeId}_${attendee.email_address}`;
};

export const isValidAttendee = (attendee, existingAttendees) => {
	if (!attendee) {
		return false;
	}

	const duplicate = findAttendeeWithSameEmail(attendee, existingAttendees);
	const hasValidEmail = isValidEmail(attendee.email_address);

	return !duplicate && hasValidEmail;
};

export const useScrollToBottomEffect = (visible, fieldRef, attendees) => {
	useEffect(() => {
		const field = fieldRef.current;

		if (visible && field && field.scrollHeight > field.clientHeight) {
			field.scrollTop = field.scrollHeight;
		}
	}, [attendees]);
};

export const useUniqueRecommendationsEffect = ({
	selectedAttendees,
	recommendedParticipants,
	recommendedDealPeople,
	recommendedOrgPeople,
	setRecommendations,
}) => {
	useEffect(() => {
		const existingEmails = selectedAttendees.map(({ email_address: email }) => email);
		const recommendations = unionWith(
			recommendedParticipants,
			recommendedDealPeople,
			recommendedOrgPeople,
			(a, b) => a.person_id === b.person_id && a.email_address === b.email_address,
		);

		const uniqueRecommendations = recommendations.filter(
			({ email_address: email }) => !!email && existingEmails.indexOf(email) === -1,
		);

		setRecommendations(uniqueRecommendations);
	}, [recommendedParticipants, recommendedDealPeople, recommendedOrgPeople, selectedAttendees]);
};

const attendeeRecommendations = {
	participants: (participants) => {
		if (!participants || !participants.length) {
			return [];
		}

		return participants.map((person) => ({ ...person, reason: 'participant' }));
	},
	deal: async (deal) => {
		if (!deal) {
			return [];
		}

		const { id: dealId, title: dealName } = deal.toJS();
		const { data: dealParticipants } = await getDealParticipants(dealId);

		return (dealParticipants || []).map((person) => ({
			...person.person,
			reason: 'deal',
			dealName,
		}));
	},
	organization: async (organization) => {
		if (!organization) {
			return [];
		}

		const { id: orgId, name: orgName } = organization.toJS();
		const { data: orgPeople } = await getOrganizationPeople(orgId).catch(() => ({ data: [] }));

		return (orgPeople || []).map((person) => ({ ...person, reason: 'organization', orgName }));
	},
};

const getRecommendationReason = (person, translator) => {
	switch (person.reason) {
		case 'participant':
			return translator.gettext('Linked to activity');
		case 'deal':
			return `${translator.gettext('Participant')} · ${person.dealName}`;
		case 'organization':
			return person.orgName;
		default:
			return null;
	}
};

const isHiddenPerson = (person) => {
	const { email } = person;

	return email.length === 1 && email[0].value === 'email';
};

export const convertPersonToRecommendations = (person, translator) => {
	const { email } = person;

	// FIX_ME: determine why email is string when activity modal is opened outside of detailed view
	if (!email || !Array.isArray(email) || isHiddenPerson(person)) {
		return null;
	}

	return email.reduce((recommendations, email) => {
		const { value } = email;

		if (!value) {
			return recommendations;
		}

		const recommendation = convertPersonToAttendee(person, value);

		recommendation.reason = getRecommendationReason(person, translator);

		return [...recommendations, recommendation];
	}, []);
};

export const useRecommendedPeopleEffect = ({
	relatedObjectType,
	relatedObject,
	setRecommendedPeople,
	translator,
}) => {
	useEffect(() => {
		(async () => {
			const recommendedPeople = await attendeeRecommendations[relatedObjectType](
				relatedObject,
			);
			const recommendations = recommendedPeople
				.map((person) => convertPersonToRecommendations(person, translator))
				.flat()
				.filter((person) => person);

			setRecommendedPeople(recommendations);
		})();
	}, [relatedObject]);
};
