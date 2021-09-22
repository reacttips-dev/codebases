const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const { Badge } = require('@pipedrive/convention-ui-react');
const displayName = 'ColoredSetFieldWrapper';

const getVisualValues = ({ model, field }) => {
	const fieldValue = modelUtils.getModelAttribute(model, field.key, '');

	return _.reduce(
		fieldValue.split(','),
		(result, value) => {
			const id = isNaN(value) ? value : Number(value);
			const option = _.find(field.options, { id });

			if (option) {
				result.push(option);
			}

			return result;
		},
		[]
	);
};

class ColoredSetFieldWrapper extends React.Component {
	constructor(props) {
		super();

		this.state = {
			visualValues: getVisualValues(props)
		};
	}

	static getDerivedStateFromProps(nextProps) {
		return {
			visualValues: getVisualValues(nextProps)
		};
	}

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValues, newState.visualValues);
	}

	render() {
		const { field } = this.props;
		const { visualValues } = this.state;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--set`;
		const dataTest = `${field.key}-label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{visualValues.map((visualValue, i) => {
					const valueKey = `${field.key}-${i}`;

					return (
						<Badge
							color={visualValue.color}
							key={valueKey}
							className="gridCell__label--set"
						>
							{visualValue.label}
						</Badge>
					);
				})}
			</div>
		);
	}
}

ColoredSetFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

ColoredSetFieldWrapper.displayName = displayName;

module.exports = ColoredSetFieldWrapper;
