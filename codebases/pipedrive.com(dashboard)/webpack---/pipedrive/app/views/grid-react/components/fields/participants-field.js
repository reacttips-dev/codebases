const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const { getLinkAttribute, isContextualViewFullEnabled } = require('utils/contextual-view');
const displayName = 'ParticipantsFieldWrapper';

const getParticipantData = (model, field, participantId, relatedModels) => {
	const relatedModelType = fieldWrapperUtils.BASIC_RELATED_FIELD_TYPES['person_id'];
	const relatedModelTypeKey = `${relatedModelType}.${participantId}`;
	const displayAttribute = fieldWrapperUtils.getRelatedModelDisplayAttribute(field);
	const relatedModel = relatedModelType
		? relatedModels[relatedModelTypeKey]
		: model.getRelatedModel('person', Number(participantId));
	const participantData = {
		value: ''
	};

	if (relatedModel) {
		participantData.value = relatedModel.get(displayAttribute);
		participantData.linkAttributes = {
			'data-contextual-view': isContextualViewFullEnabled(model?.collection?.type),
			'href': getLinkAttribute(
				'person',
				relatedModel.get('id'),
				model?.collection?.type,
				model?.get('id')
			)
		};
	} else {
		participantData.value = _.gettext('(hidden)');
	}

	return participantData;
};

class ParticipantsFieldWrapper extends React.Component {
	constructor(props) {
		super();

		this.state = {
			visualValue: this.visualValue(props)
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const newVisualValue = this.visualValue(nextProps);

		this.setState({
			visualValue: newVisualValue
		});
	};

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValue, newState.visualValue);
	}

	visualValue = (props) => {
		const { model, field, relatedModels } = props;
		const fieldValues = modelUtils.getModelAttribute(model, 'participants');
		const primaryParticipant = _.find(fieldValues, { primary_flag: true });
		const secondaryParticipants = _.without(fieldValues, primaryParticipant);
		const secondaryParticipantsCount = fieldValues.length - 1;

		let visualValue = { value: '' };

		if (primaryParticipant) {
			const primaryParticipantId = primaryParticipant.person_id;

			visualValue = getParticipantData(model, field, primaryParticipantId, relatedModels);

			if (secondaryParticipantsCount > 0) {
				visualValue.count = secondaryParticipantsCount;
				visualValue.participants = secondaryParticipants.map((participant) => {
					const participantData = getParticipantData(
						model,
						field,
						participant.person_id,
						relatedModels
					);

					return participantData.value;
				});
			}
		}

		return visualValue;
	};

	mainPerson = () => {
		const { visualValue } = this.state;

		if (visualValue.value) {
			const mainPersonValue = (
				<span className="gridCell__label gridCell__label--interactive">
					{visualValue.value}
				</span>
			);

			if (!_.isEmpty(visualValue.linkAttributes)) {
				return <a {...visualValue.linkAttributes}>{mainPersonValue}</a>;
			}

			return mainPersonValue;
		}
	};

	participants = () => {
		const { visualValue } = this.state;

		if (visualValue.count) {
			const participants = visualValue.participants.join('\n');

			return (
				<span
					className="gridCell__label gridCell__label--defaultCursor cui-tooltip"
					data-tooltip={participants}
					data-tooltip-position="bottom"
					data-tooltip-lines="multiple"
				>
					+{visualValue.count}
				</span>
			);
		}
	};

	render() {
		const { field } = this.props;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--set`;
		const dataTest = 'participants-label';

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{this.mainPerson()}
				{this.participants()}
			</div>
		);
	}
}

ParticipantsFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	relatedModels: PropTypes.object
};

ParticipantsFieldWrapper.displayName = displayName;

module.exports = ParticipantsFieldWrapper;
