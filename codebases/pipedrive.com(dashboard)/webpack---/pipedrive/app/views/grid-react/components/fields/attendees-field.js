const React = require('react');
const _ = require('lodash');
const PropTypes = require('prop-types');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'AttendeesFieldWrapper';

const nameAndEmail = (attendee) =>
	attendee.name ? `${attendee.name} (${attendee.email_address})` : attendee.email_address;

class AttendeesFieldWrapper extends React.Component {
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
		const { model } = props;
		const attendees = modelUtils.getModelAttribute(model, 'attendees');

		if (!attendees || !attendees.length) {
			return { firstAttendee: null, attendees: [] };
		}

		return {
			firstAttendee: nameAndEmail(attendees[0]),
			attendees: attendees.map(nameAndEmail)
		};
	};

	attendees = () => {
		const { visualValue } = this.state;

		if (visualValue && visualValue.firstAttendee) {
			const attendees = visualValue.attendees.join('\n');
			const count = visualValue.attendees.length;

			return (
				<span
					className="gridCell__label gridCell__label--defaultCursor cui-tooltip"
					data-tooltip={attendees}
					data-tooltip-position="bottom"
					data-tooltip-lines="multiple"
				>
					{visualValue.firstAttendee} {count > 1 ? `+${count - 1}` : ''}
				</span>
			);
		}
	};

	render() {
		const { field } = this.props;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--set`;
		const dataTest = 'attendees-label';

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{this.attendees()}
			</div>
		);
	}
}

AttendeesFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	relatedModels: PropTypes.object
};

AttendeesFieldWrapper.displayName = displayName;

module.exports = AttendeesFieldWrapper;
