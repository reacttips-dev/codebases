const React = require('react');
const modelUtils = require('views/grid-react/utils/model-utils');
const PropTypes = require('prop-types');
const _ = require('lodash');
const User = require('models/user');
const Company = require('collections/company');
const {
	default: QuickInfoCardWrapper
} = require('views/grid-react/components/quick-info-card-wrapper');
const displayName = 'UserFieldWrapper';

class UserFieldWrapper extends React.Component {
	constructor(props) {
		super();

		this.state = {
			visualValue: this.valueVisual(props)
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		this.setState({
			visualValue: this.valueVisual(nextProps)
		});
	};

	shouldComponentUpdate(newProps, newState) {
		return !_.isEqual(this.state.visualValue, newState.visualValue);
	}

	valueVisual = (props) => {
		const { field, model } = props;
		const fieldValueId = Number(modelUtils.getModelAttribute(model, field.key)) || null;
		const showUserLink = this.doShowUserLink(fieldValueId);
		const user = this.getCompanyUserName(fieldValueId);

		return {
			fieldValueId,
			label: user,
			link: showUserLink ? `/users/details/${fieldValueId}` : null
		};
	};

	doShowUserLink = (fieldValueId) => {
		return (
			User.settings.get('can_see_other_users') &&
			User.settings.get('can_see_other_users_statistics') &&
			fieldValueId > 0
		);
	};

	getCompanyUserName = (userId) => {
		if (!userId) {
			return '';
		}

		const userModel = Company.get(userId);

		return userModel ? userModel.get('name') : _.gettext('(hidden)');
	};

	getElementLink = () => {
		const { visualValue } = this.state;

		if (visualValue.link) {
			return <a href={visualValue.link}>{visualValue.label}</a>;
		}

		return visualValue.label;
	};

	render() {
		const { field } = this.props;
		const { visualValue } = this.state;

		const fieldClassName = `value ${field.field_type} valueWrap gridCell__item gridCell__item--link`;
		const dataTest = `${field.key}-label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				<QuickInfoCardWrapper type="user" id={visualValue.fieldValueId} source="list">
					{this.getElementLink()}
				</QuickInfoCardWrapper>
			</div>
		);
	}
}

UserFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

UserFieldWrapper.displayName = displayName;

module.exports = UserFieldWrapper;
