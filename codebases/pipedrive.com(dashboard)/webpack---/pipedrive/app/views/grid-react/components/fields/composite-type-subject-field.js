const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const displayName = 'CompositeTypeSubjectFieldWrapper';

class CompositeTypeSubjectFieldWrapper extends React.Component {
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
		const { model, field } = props;
		const fieldKey = field.key;
		const fieldValue = modelUtils.getModelAttribute(model, fieldKey);
		const fieldLink = modelUtils.getModelLink(model, fieldKey);
		const fieldDataContextualView = modelUtils.getModelContextualViewData(model, fieldKey);
		const iconLink = `#icon-sm-ac-${model.getTypeIcon()}`;

		return {
			label: fieldValue,
			link: fieldLink,
			iconLink,
			dataContextualView: fieldDataContextualView
		};
	};

	getNewBadge = () => {
		const { field, model } = this.props;

		if (modelUtils.shouldShowNewBadge(model, field.key)) {
			const badgeText = _.gettext('New');
			const badgeClassName = `badge gridCell__badge`;

			return <span className={badgeClassName}>{badgeText}</span>;
		}
	};

	render() {
		const { field } = this.props;
		const visualValue = this.state.visualValue;
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--link`;
		const dataTest = `${field.key}-label`;
		const newBadge = this.getNewBadge();
		const iconLink = visualValue.iconLink;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				<span className="gridCell__typeIcon">
					<svg className="cui4-icon cui4-icon--s">
						<use xmlnsXlink={iconLink} xlinkHref={iconLink} href={iconLink} />
					</svg>
				</span>
				<a href={visualValue.link} data-contextual-view={visualValue.dataContextualView}>
					{visualValue.label}
				</a>
				{newBadge}
			</div>
		);
	}
}

CompositeTypeSubjectFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

CompositeTypeSubjectFieldWrapper.displayName = displayName;

module.exports = CompositeTypeSubjectFieldWrapper;
