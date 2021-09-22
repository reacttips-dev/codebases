const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const displayName = 'PlainFieldWrapper';

const { Badge } = require('@pipedrive/convention-ui-react');

class PlainFieldWrapper extends React.Component {
	constructor(props) {
		super();

		const { visualRenderer } = props;

		this.state = {
			visualValue: visualRenderer(props, {})
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const { visualRenderer } = nextProps;
		const newVisualValue = visualRenderer(nextProps);

		this.setState({
			visualValue: newVisualValue
		});
	};

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(this.state.visualValue, nextState.visualValue);
	}

	getValueElement(field, visualValue) {
		if (field.key === 'marketing_status') {
			const marketingStatusOption =
				field.options.find((option) => option.label === visualValue) ||
				field.options.find((option) => option.id === 'no_consent') ||
				{};

			return (
				<Badge outline color={marketingStatusOption.color}>
					{marketingStatusOption.label}
				</Badge>
			);
		}

		return visualValue;
	}

	render() {
		const { field } = this.props;
		const visualValue = this.state.visualValue;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item`;
		const dataTest = `${field.key}-label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{this.getValueElement(field, visualValue)}
			</div>
		);
	}
}

PlainFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	visualRenderer: PropTypes.func.isRequired
};

PlainFieldWrapper.displayName = displayName;

module.exports = PlainFieldWrapper;
