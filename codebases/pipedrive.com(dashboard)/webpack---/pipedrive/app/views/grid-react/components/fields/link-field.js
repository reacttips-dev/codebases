const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const {
	default: QuickInfoCardWrapper
} = require('views/grid-react/components/quick-info-card-wrapper');

const displayName = 'LinkFieldWrapper';

class LinkFieldWrapper extends React.Component {
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

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValue, newState.visualValue);
	}

	getElementLink = () => {
		const { visualValue } = this.state;

		if (!_.isEmpty(visualValue.linkAttributes)) {
			return <a {...visualValue.linkAttributes}>{visualValue.value}</a>;
		}

		return visualValue.value;
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
		const { visualValue } = this.state;
		const elementLink = this.getElementLink();
		const linkClassName = _.isEmpty(visualValue.linkAttributes) ? '' : ' gridCell__item--link';
		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item${linkClassName}`;
		const dataTest = `${field.key}-label`;
		const newBadge = this.getNewBadge();

		return (
			<div className={fieldClassName} data-test={dataTest}>
				<QuickInfoCardWrapper type={visualValue.type} id={visualValue.id} source="list">
					{elementLink}
				</QuickInfoCardWrapper>

				{newBadge}
			</div>
		);
	}
}

LinkFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	relatedModels: PropTypes.object,
	visualRenderer: PropTypes.func.isRequired
};

LinkFieldWrapper.displayName = displayName;

module.exports = LinkFieldWrapper;
