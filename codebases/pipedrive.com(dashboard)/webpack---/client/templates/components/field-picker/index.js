import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Config from '../../../../client-config';
import { Icon, Separator, Spacing, Popover, Option, Button } from '@pipedrive/convention-ui-react';
import popoverOptionHeight from '../../helpers/popover-option-height';

import './field-picker.scss';

const classPrefix = `${Config.appPrefix}-${Config.emailTemplatesPrefix}`;

class FieldPickerPopover extends Component {
	constructor(props) {
		super(props);

		this.state = { popoverVisible: false };

		this.closePopover = this.togglePopoverVisibilty.bind(this, false);
	}

	componentDidUpdate() {
		if (this.props.routeChanged) {
			if (this.state.popoverVisible) {
				this.closePopover();
			}
		}
	}

	onPopoverVisibilityChange(visible) {
		this.togglePopoverVisibilty(visible);
	}

	togglePopoverVisibilty(visible) {
		this.setState({ popoverVisible: visible });

		if (typeof this.props.onPopupVisibleChange === 'function') {
			this.props.onPopupVisibleChange(visible);
		}

		if (!visible) {
			this.props.fieldsSearchInputChange('');
		}
	}

	getSearchContent() {
		const fieldsCount = this.props.fields.length;

		const separator = fieldsCount ? (
			<Separator type="block">
				{`${this.props.translator.gettext(
					this.props.translator.ngettext('%d MATCH', '%d MATCHES', fieldsCount),
					fieldsCount
				)}`}
			</Separator>
		) : null;

		if (this.props.searchInputText) {
			return (
				<Fragment>
					{separator}
					<div
						className={`${classPrefix}-popover__select-options-wrapper`}
						style={popoverOptionHeight.getOptionWrapperStyle()}
					>
						{this.props.getFieldsListComponent('search')}
					</div>
				</Fragment>
			);
		}

		return null;
	}

	getUpdateValuesContent() {
		if (this.props.isConfigMode) {
			return null;
		}

		const optionId = 'update-values';

		return (
			<div className={`${classPrefix}-popover__update-values-wrapper`}>
				<Option
					className={this.props.optionClassNames(optionId)}
					onClick={this.props.refreshValues}
					onMouseOver={(e) => this.props.setHighlightedOption(e)}
					data-keyboard-navigation="true"
					data-option={optionId}
					manualHighlight={true}
					highlighted={this.props.isHighlighted(optionId)}
				>
					<Icon icon="refresh" color="blue" size="s" />
					{this.props.translator.gettext('Update autofilled values')}
				</Option>
			</div>
		);
	}

	getPopoverContent() {
		return (
			<Spacing all="none">
				<div
					className={`${classPrefix}-popover ${classPrefix}-popover__field-picker cui4-select__popup`}
				>
					<div className={`${classPrefix}-popover__search-container`}>
						{this.props.searchComponent}
					</div>
					{this.props.tabsComponent}
					{this.getSearchContent()}
					{this.getUpdateValuesContent()}
				</div>
			</Spacing>
		);
	}

	getFieldsPickerButton() {
		if (this.props.fontPickersEnabled) {
			return (
				<Button
					color="ghost"
					size="s"
					onClick={(e) => e.preventDefault()}
					data-ui-test-id="email-templates-selectors-link"
				>
					{this.props.showLinkText && (
						<span className={this.props.labelClass}>
							{this.props.translator.gettext('Insert field')}
						</span>
					)}
					<Icon icon="triangle-down" size="s" color="black-64" />
				</Button>
			);
		}

		return (
			<span
				style={{ position: 'relative' }}
				className={`${classPrefix}__link`}
				data-ui-test-id="email-templates-selectors-link"
			>
				<Icon icon="add-field" color="black-64" />
				{this.props.showLinkText && (
					<span className={this.props.labelClass}>
						{this.props.translator.gettext('Fields')}
					</span>
				)}
				<Icon icon="triangle-down" size="s" color="black-64" />
			</span>
		);
	}

	render() {
		const popoverClassName = `${classPrefix}__popover`;
		const { triggerContent, popoverPortalTo } = this.props;

		return (
			<Popover
				visible={this.state.popoverVisible}
				onPopupVisibleChange={this.onPopoverVisibilityChange.bind(this)}
				placement={this.props.fontPickersEnabled ? 'bottom-start' : 'bottom'}
				content={this.getPopoverContent()}
				className={popoverClassName}
				popperProps={{ modifiers: { preventOverflow: { enabled: false } } }}
				portalTo={popoverPortalTo}
			>
				{triggerContent ? triggerContent : this.getFieldsPickerButton()}
			</Popover>
		);
	}
}

FieldPickerPopover.propTypes = {
	searchInputText: PropTypes.string,
	searchComponent: PropTypes.object.isRequired,
	tabsComponent: PropTypes.object.isRequired,
	getFieldsListComponent: PropTypes.func.isRequired,
	fieldsSearchInputChange: PropTypes.func,
	fields: PropTypes.array,
	isConfigMode: PropTypes.bool,
	refreshValues: PropTypes.func,
	translator: PropTypes.object.isRequired,
	routeChanged: PropTypes.bool.isRequired,
	labelClass: PropTypes.string,
	isHighlighted: PropTypes.func.isRequired,
	setHighlightedOption: PropTypes.func.isRequired,
	optionClassNames: PropTypes.func.isRequired,
	showLinkText: PropTypes.bool,
	popoverPortalTo: PropTypes.object,
	onPopupVisibleChange: PropTypes.func,
	triggerContent: PropTypes.node,
	fontPickersEnabled: PropTypes.bool
};

export default FieldPickerPopover;
