const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'SetFieldWrapper';

class SetFieldWrapper extends React.Component {
	constructor(props) {
		super();

		this.state = {
			visualValues: this.visualValues(props)
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const newVisualValues = this.visualValues(nextProps);

		this.setState({
			visualValues: newVisualValues
		});
	};

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValues, newState.visualValues);
	}

	visualValues = (props) => {
		const { model, field } = props;
		const fieldValue = modelUtils.getModelAttribute(model, field.key, '');

		return _.reduce(
			fieldValue.split(','),
			(result, value) => {
				const id = isNaN(value) ? value : Number(value);
				const option = _.find(field.options, { id });

				if (option) {
					result.push(option.label);
				}

				return result;
			},
			[]
		);
	};

	render() {
		const { field } = this.props;
		const { visualValues } = this.state;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--set`;
		const dataTest = `${field.key}-label`;
		const fieldItemClassName = `gridCell__label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{visualValues.map((visualValue, i) => {
					const valueKey = `${field.key}-${i}`;

					return (
						<span className={fieldItemClassName} key={valueKey}>
							{visualValue}
						</span>
					);
				})}
			</div>
		);
	}
}

SetFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

SetFieldWrapper.displayName = displayName;

module.exports = SetFieldWrapper;
