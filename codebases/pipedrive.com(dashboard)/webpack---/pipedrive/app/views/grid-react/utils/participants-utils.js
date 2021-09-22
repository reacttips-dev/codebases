const _ = require('lodash');
const MODEL_ATTRIBUTE = 'participants';
const addRelatedParticipants = ({ model, participants, relatedModels }) => {
	return _.reduce(
		participants,
		(relatedModels, participant) => {
			const personId = participant.person_id;
			const relatedModel = model.getRelatedModel('person', personId);

			if (relatedModel) {
				relatedModels[`person.${personId}`] = model.getRelatedModel('person', personId);
			}

			return relatedModels;
		},
		relatedModels
	);
};
const calculateParticipantsAttribute = ({ model, relatedModels }) => {
	const participants = model.get(MODEL_ATTRIBUTE) || [];

	return participants
		.map((person) => {
			const participant = relatedModels ? relatedModels[`person.${person.person_id}`] : null;
			const name = participant ? participant.get('name') || '' : '';

			return `${person.primary_flag}#${person.person_id}#${name}`;
		})
		.join('##');
};

module.exports = {
	addRelatedParticipants,
	calculateParticipantsAttribute,
	fieldType: 'participants',
	modelAttribute: MODEL_ATTRIBUTE
};
