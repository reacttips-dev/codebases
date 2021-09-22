const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const displayName = 'ContactFieldWrapper';

class ContactFieldWrapper extends React.Component {
	constructor(props) {
		super();

		const { visualRenderer } = props;

		this.state = {
			visualValue: visualRenderer(props, {})
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const { visualRenderer } = nextProps;

		this.setState({
			visualValue: visualRenderer(nextProps, {})
		});
	};

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValue, newState.visualValue);
	}

	getValueElement = (visualValue, valueKey) => {
		const label = this.getLabelElement(visualValue.label);
		const valueClassName = `gridCell__label`;
		const linkClassName = `gridCell__link`;

		if (visualValue.value && visualValue.linkAttributes) {
			return (
				<a {...visualValue.linkAttributes} key={valueKey} className={linkClassName}>
					<span className={`${valueClassName} gridCell__label--interactive`}>
						{visualValue.value}
						{label}
					</span>
				</a>
			);
		} else if (visualValue.value) {
			return (
				<span key={valueKey} className={valueClassName}>
					{visualValue.value}
					{label}
				</span>
			);
		}
	};

	getLabelElement = (label) => {
		return label ? <span className="gridCell__valueRemark">{label}</span> : '';
	};

	render() {
		const { field } = this.props;
		const visualValues = this.state.visualValue;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--set`;
		const dataTest = `${field.key}-label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{visualValues.map((visualValue, i) => {
					const key = `${field.key}-${i}`;

					return this.getValueElement(visualValue, key);
				})}
			</div>
		);
	}
}

ContactFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	visualRenderer: PropTypes.func.isRequired
};

ContactFieldWrapper.displayName = displayName;

module.exports = ContactFieldWrapper;
