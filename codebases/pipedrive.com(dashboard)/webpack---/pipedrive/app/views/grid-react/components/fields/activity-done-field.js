const React = require('react');
const ConventionUI = require('@pipedrive/convention-ui-react');
const _ = require('lodash');
const PropTypes = require('prop-types');
const modelUtils = require('views/grid-react/utils/model-utils');
const compareUtils = require('views/grid-react/utils/compare-utils');
const ActivityAnalytics = require('utils/analytics/activity-analytics');
const displayName = 'ActivityDoneFieldWrapper';

class ActivityDoneFieldWrapper extends React.Component {
	constructor(props) {
		super();

		const { model, field } = props;

		this.state = {
			id: modelUtils.getModelAttribute(model, 'id'),
			checked: modelUtils.getModelAttribute(model, field.key),
			disabled: false
		};
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		this.setState({
			id: modelUtils.getModelAttribute(nextProps.model, 'id'),
			checked: modelUtils.getModelAttribute(nextProps.model, nextProps.field.key),
			// fix for double click on activity done checkbox
			disabled: nextProps.model && _.has(nextProps.model.changed, 'done')
		});
	};

	shouldComponentUpdate(nextProps, nextState) {
		return compareUtils.hasDifference(this.state, nextState, 'checked', 'id', 'disabled');
	}

	handleChange = () => {
		const { model, field } = this.props;
		const isChecked = modelUtils.getModelAttribute(model, field.key);

		if (model) {
			if (_.hasIn(model.changed, 'done')) {
				return;
			}

			model.toggleDoneState({
				success: () => {
					this.setState({
						disabled: false
					});

					ActivityAnalytics.trackActivityMarkedAsDoneAndUndone({
						model,
						action: isChecked ? 'marked_undone' : 'marked_done'
					});
				}
			});
		}

		this.setState({
			checked: isChecked,
			disabled: true
		});
	};

	render() {
		const { field } = this.props;
		const { checked, disabled } = this.state;
		const dataTest = `${field.key}-label`;
		const tooltip = this.state.checked
			? _.gettext('Mark as not done')
			: _.gettext('Mark as done');

		return (
			<div data-test={dataTest}>
				<ConventionUI.Tooltip
					className={`${field.key}-label__tooltip`}
					placement="top-start"
					content={tooltip}
					portalTo={document.body}
					popperProps={{
						positionFixed: true
					}}
				>
					<ConventionUI.Checkbox
						type="round"
						checked={checked}
						onChange={this.handleChange}
						disabled={disabled}
					/>
				</ConventionUI.Tooltip>
			</div>
		);
	}
}

ActivityDoneFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired
};

ActivityDoneFieldWrapper.displayName = displayName;

module.exports = ActivityDoneFieldWrapper;
