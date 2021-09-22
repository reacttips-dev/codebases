const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const { Icon, Button, Tooltip, ButtonGroup } = require('@pipedrive/convention-ui-react');
const SalesPhoneUtils = require('utils/sales-phone');

const displayName = 'PhoneFieldWrapper';

class PhoneFieldWrapper extends React.Component {
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

	shouldShowSalesPhone = () => {
		return SalesPhoneUtils.isAvailable();
	};

	startQuickCall = ({ e, quickCallMethod, visualValue, source }) => {
		visualValue.linkAttributes.onClick(e, { quickCallMethod, source });
	};

	getValueElement = (visualValue, valueKey) => {
		const label = this.getLabelElement(visualValue.label);
		const quickCallMethod = SalesPhoneUtils.getQuickCallMethod();
		const valueClassName = 'gridCell__label';

		if (SalesPhoneUtils.isCaller12() && visualValue.value) {
			return (
				<div className="gridCell__salesPhoneButton--caller12" key={valueKey}>
					<span className="gridCell__salesPhoneValue">
						<Tooltip
							className="gridCell__salesPhoneTooltip"
							placement="top"
							content={SalesPhoneUtils.getQuickCallButtonTooltip(quickCallMethod)}
							portalTo={document.body}
						>
							<a
								key={valueKey}
								className="gridCell__salesPhoneNumber"
								href={visualValue.linkAttributes.href}
								onClick={(e) =>
									this.startQuickCall({
										e,
										quickCallMethod,
										visualValue,
										source: SalesPhoneUtils.SOURCE_QUICK_CALL_PHONE_NUMBER
									})
								}
							>
								{visualValue.value}
							</a>
						</Tooltip>{' '}
						{label}
					</span>
					<ButtonGroup
						className="gridCell__salesPhoneActions"
						data-test="sales-phone-actions"
					>
						<Tooltip
							className="gridCell__salesPhoneTooltip"
							placement="top"
							content={SalesPhoneUtils.getQuickCallButtonTooltip(quickCallMethod)}
							portalTo={document.body}
						>
							<Button
								size="s"
								className="gridCell__salesPhoneCallButton"
								onClick={(e) =>
									this.startQuickCall({
										e,
										quickCallMethod,
										visualValue,
										source: SalesPhoneUtils.SOURCE_QUICK_CALL
									})
								}
								data-test="sales-phone-call-btn"
							>
								<Icon icon="ac-call" size="s" />
							</Button>
						</Tooltip>
						<Tooltip
							className="gridCell__salesPhoneTooltip"
							placement="top"
							content={_.gettext('Choose a calling method')}
							portalTo={document.body}
						>
							<Button
								size="s"
								className="gridCell__salesPhoneOptions--caller12"
								onClick={(e) => visualValue.linkAttributes.onClick(e)}
							>
								<Icon icon="arrow-down" size="s" />
							</Button>
						</Tooltip>
					</ButtonGroup>
				</div>
			);
		}

		if (SalesPhoneUtils.isCaller11() && visualValue.value) {
			return (
				<Button
					key={valueKey}
					size="s"
					className="gridCell__salesPhoneButton"
					onClick={(e) => visualValue.linkAttributes.onClick(e)}
				>
					<span className="gridCell__salesPhoneIcon">
						<Icon icon="ac-call" size="s" />
					</span>
					<span>
						{visualValue.value}
						{label}
					</span>
					<span className="gridCell__salesPhoneIcon">
						<Icon icon="triangle-down" size="s" />
					</span>
				</Button>
			);
		}

		if (visualValue.value && visualValue.linkAttributes) {
			return (
				<a {...visualValue.linkAttributes} key={valueKey} className="gridCell__link">
					<span
						className={`${valueClassName}
                            ${
								label ? '' : 'gridCell__label--noLabel'
							} gridCell__label--interactive`}
					>
						{visualValue.value}
						{label}
					</span>
					{this.getActionButton()}
				</a>
			);
		}

		if (visualValue.value) {
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

	getActionButton = () => {
		if (this.shouldShowSalesPhone()) {
			return (
				<span className="gridCell__salesPhoneOptions">
					<Icon icon="arrow-down" size="s" color="blue" />
				</span>
			);
		}

		return null;
	};

	render() {
		const { field } = this.props;
		const visualValues = this.state.visualValue;
		const salesPhoneClass = this.shouldShowSalesPhone() ? 'gridCell__item--salesphone' : '';
		const fieldClassName = `value
        ${field.field_type} valueWrap gridCell__item gridCell__item--set ${salesPhoneClass}`;
		const dataTest = `${field.key}-label`;

		return (
			<div className={fieldClassName} data-test={dataTest}>
				{visualValues.map((visualValue) => {
					const key = `${field.key}-${visualValue.value}`;

					return this.getValueElement(visualValue, key);
				})}
			</div>
		);
	}
}

PhoneFieldWrapper.propTypes = {
	model: PropTypes.object,
	field: PropTypes.object.isRequired,
	visualRenderer: PropTypes.func.isRequired
};

PhoneFieldWrapper.displayName = displayName;

module.exports = PhoneFieldWrapper;
