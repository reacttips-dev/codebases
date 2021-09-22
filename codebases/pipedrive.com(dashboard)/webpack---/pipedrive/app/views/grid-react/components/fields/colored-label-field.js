const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const enumValueProducer = require('./value-producers/enum');
const displayName = 'ColoredLabelField';

require('react-dom');

class ColoredLabelField extends React.Component {
	constructor(props) {
		super();

		this.state = {
			visualValue: enumValueProducer(props, { returnFieldObject: true })
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const newVisualValue = enumValueProducer(nextProps, { returnFieldObject: true });

		this.setState({
			visualValue: newVisualValue
		});
	};

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(this.state.visualValue, nextState.visualValue);
	}

	render() {
		const visualValue = this.state.visualValue;

		return (
			<div className="gridCell__item">
				{visualValue && (
					<div className={`cui4-badge cui4-badge--${visualValue.color}`}>
						<div className="cui4-badge__label">{visualValue.label}</div>
					</div>
				)}
			</div>
		);
	}
}

ColoredLabelField.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

ColoredLabelField.displayName = displayName;

module.exports = ColoredLabelField;
