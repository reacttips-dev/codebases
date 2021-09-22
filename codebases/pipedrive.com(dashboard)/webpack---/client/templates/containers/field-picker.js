import { connect } from 'react-redux';
import React, { Component } from 'react';
import { MergeFieldsPlugin } from '@pipedrive/pd-wysiwyg';
import _ from 'lodash';
import Search from '../components/popover/search';
import {
	setFields,
	fieldsSearchInputChange,
	setRecents,
	updateRecents,
	setConfigMode
} from '../actions/field-picker';
import { getFilteredFields } from '../selectors/field-picker';
import { fillFieldsWithData, getFieldValue } from '../helpers/field-picker';
import { getForceUpdateTypes } from '../helpers/fields';
import FieldsListComponent from '../components/field-picker/fields-list';
import FieldPickerComponent from '../components/field-picker/index';
import FieldTabsComponent from '../components/field-picker/tabs';
import Config from '../../../client-config';
import PropTypes from 'prop-types';
import KeyboardNavigation from '../helpers/keyboard-navigation';
import { HotKeys } from 'react-hotkeys';

const classPrefix = `${Config.appPrefix}-${Config.emailTemplatesPrefix}`;

class FieldPickerContainer extends Component {
	constructor(props) {
		super(props);

		this.state = { highlightedOption: null };

		// currently we do not support group emailing in leads
		this.hideLeadFields = props.hideLeadFieldsInGroupEmail || this.props.hideLeadFields;

		this.userLanguage = this.props.userSelf.get('language').language_code;
		this.props.setFields(this.props.translator, this.props.userSelf, this.hideLeadFields);
		this.props.setRecents(this.props.userSelf.settings, this.hideLeadFields);
		this.selectedFieldElClass = `${classPrefix}-popover__select-option--selected`;
		this.keyboardVerticalNavigation = new KeyboardNavigation({
			classPrefix: `${classPrefix}-popover`,
			navigationItemsContainerSelector: `.${classPrefix}-popover__select-options-wrapper`,
			navigationItemSelector: '[data-keyboard-navigation="true"]',
			selectedItemClass: this.selectedFieldElClass
		});
		this.selectedTabElClass = `${classPrefix}-popover__tab--active`;
		this.keyboardHorizontalNavigation = new KeyboardNavigation({
			classPrefix: `${classPrefix}-popover`,
			navigationItemsContainerSelector: `.${classPrefix}-popover__tabs`,
			navigationItemSelector: '[data-keyboard-horizontal-navigation="true"]',
			selectedItemClass: this.selectedTabElClass,
			backwardDirectionKey: this.keyboardVerticalNavigation.ARROW_LEFT,
			plane: this.keyboardVerticalNavigation.HORIZONTAL_PLANE
		});
		this.getFieldsListComponent = this.getFieldsListComponent.bind(this);
	}

	componentDidMount() {
		if (this.props.draftModel) {
			this.props.draftModel.on(
				'change:to change:bcc change:cc change:template_id',
				this.onDraftModelChange.bind(this)
			);
			this.props.draftModel.threadModel.on(
				'change:deal_id change:lead_id',
				this.onDraftModelChange.bind(this)
			);
		}

		this.props.setConfigMode(!!this.props.isConfigMode);
	}

	componentWillUnmount() {
		if (this.props.draftModel) {
			this.props.draftModel.off(
				'change:to change:bcc change:cc change:template_id',
				this.onDraftModelChange.bind(this)
			);
			this.props.draftModel.threadModel.off(
				'change:deal_id change:lead_id',
				this.onDraftModelChange.bind(this)
			);
		}
	}

	getActiveEditorName() {
		return _.isFunction(this.props.activeEditorName)
			? this.props.activeEditorName()
			: this.props.activeEditorName;
	}

	getCurrentEditor() {
		return this.props.editors[this.getActiveEditorName()];
	}

	getAllEditors() {
		return _.values(this.props.editors);
	}

	onDraftModelChange(changedModel) {
		const bodyEditor = this.props.editors.body;
		const subjectEditor = this.props.editors.subject;
		const updateTypes = getForceUpdateTypes(
			changedModel,
			this.props.person,
			this.props.organization,
			this.props.linkedDeal,
			this.props.linkedLead
		);

		this.props.fillFieldsWithData(
			this.props.draftModel,
			bodyEditor,
			() => {
				this.props.fillFieldsWithData(
					this.props.draftModel,
					subjectEditor,
					() => {},
					updateTypes
				);
			},
			updateTypes
		);
	}

	refreshValues() {
		this.getAllEditors().forEach((editor) =>
			this.props.fillFieldsWithData(
				this.props.draftModel,
				editor,
				() => {
					editor.focusFirstEmptyField && editor.focusFirstEmptyField();
					this.props.draftModel && this.props.saveDraft();
				},
				{ deal: true, person: true, other: true }
			)
		);
	}

	onAddField(ev, fromRecentsTab) {
		const {
			type,
			key: fieldKey,
			name: fieldName,
			customField,
			phoneCustomField
		} = ev.currentTarget.dataset;
		const isConfigMode = this.props.isConfigMode;
		const { trackingData } = this.props;
		const editor = this.getCurrentEditor();
		const fieldData = {
			type,
			fieldKey,
			fieldName,
			isConfigMode,
			phoneCustomField
		};

		this.props.usageTracking.sendMetrics('email_field_picker', 'used', {
			category: type,
			type: customField ? 'custom_field' : fieldKey,
			from_recents_tab: fromRecentsTab,
			context: this.getActiveEditorName(),
			...trackingData
		});

		this.props.getFieldValue(this.props.draftModel, editor, fieldData, (value) => {
			fieldData.value = value;
			editor.callPluginMethod(MergeFieldsPlugin.name, 'insertField', [fieldData]);

			this.props.draftModel && this.props.saveDraft();
		});

		this.popoverInstance.closePopover();
		this.props.updateRecents(this.props.userSelf.settings, fieldData);
	}

	moveVertically(ev) {
		this.keyboardVerticalNavigation.move(ev);

		const optionId = this.keyboardVerticalNavigation.getActiveElement().dataset.option;

		this.setState({ highlightedOption: optionId });
	}

	moveHorizontally(ev) {
		this.keyboardHorizontalNavigation.move(ev);
		const selectedItem = document.querySelector(`.${this.selectedTabElClass}`);

		if (selectedItem) {
			selectedItem.click();
			this.keyboardVerticalNavigation.removeActiveElement();
			this.setState({ highlightedOption: null });
		}
	}

	getKeyHandlers() {
		return {
			moveHandler: (ev) => this.moveVertically(ev),
			moveHorizontalHandler: (ev) => this.moveHorizontally(ev),
			enterHandler: () => {
				const selectedItem = document.querySelector(`.${this.selectedFieldElClass}`);

				selectedItem && selectedItem.click();
			},
			escapeHandler: () => {
				if (this.props.fieldsSearchInputText.length) {
					this.props.fieldsSearchInputChange('');
				} else {
					this.popoverInstance.closePopover();
				}
			}
		};
	}

	onTabClick() {
		this.searchInstance && this.searchInstance.focusInput();
	}

	getSearchComponent(spacing) {
		return (
			<Search
				componentName={'email_field_picker'}
				spacing={spacing}
				ref={(instance) => {
					this.searchInstance = instance;
				}}
				searchInputChange={this.props.fieldsSearchInputChange}
				classPrefix={classPrefix}
				translator={this.props.translator}
				usageTracking={this.props.usageTracking}
				keyHandlers={this.getKeyHandlers()}
			/>
		);
	}

	setHighlightedOption(ev) {
		const optionId = ev.currentTarget.dataset.option;

		this.setState({ highlightedOption: optionId });
	}

	isHighlighted(optionId) {
		return this.state.highlightedOption === optionId;
	}

	getSelectOptionClassNames(optionId) {
		const selectOption = `${classPrefix}-popover__select-option`;
		const selectOptionSelected = `${selectOption}--selected`;

		return this.isHighlighted(optionId)
			? `${selectOption} ${selectOptionSelected}`
			: selectOption;
	}

	getFieldsListComponent(type) {
		return (
			<FieldsListComponent
				type={type}
				hideDealFields={this.props.hideDealFields}
				translator={this.props.translator}
				onAddField={this.onAddField.bind(this)}
				fields={this.props.fields}
				recents={this.props.fieldRecents}
				searchInputText={this.props.fieldsSearchInputText}
				keyHandlers={this.getKeyHandlers()}
				isHighlighted={(id) => this.isHighlighted(id)}
				setHighlightedOption={(ev) => this.setHighlightedOption(ev)}
				optionClassNames={(id) => this.getSelectOptionClassNames(id)}
			/>
		);
	}

	getTabsComponent() {
		const isLeadsEmailComposerEnabled = this.props.userSelf.companyFeatures.get(
			'leads_email_composer'
		);

		return (
			<FieldTabsComponent
				onTabClick={this.onTabClick.bind(this)}
				translator={this.props.translator}
				hideDealFields={this.props.hideDealFields}
				hideLeadFields={this.hideLeadFields}
				isLeadsEmailComposerEnabled={isLeadsEmailComposerEnabled}
				searchInputText={this.props.fieldsSearchInputText}
				keyHandlers={this.getKeyHandlers()}
				getFieldsListComponent={this.getFieldsListComponent}
			/>
		);
	}

	render() {
		const spacing = {
			top: 's',
			bottom: 's',
			left: 's',
			right: 's'
		};

		return (
			<div className={classPrefix}>
				<HotKeys
					className={`${classPrefix}__popoverWrapper`}
					keyMap={{
						...this.keyboardVerticalNavigation.getKeyMap(),
						moveHorizontalHandler: ['left', 'right']
					}}
				>
					<FieldPickerComponent
						ref={(instance) => {
							this.popoverInstance = instance;
						}}
						fields={this.props.fields}
						refreshValues={this.refreshValues.bind(this)}
						route={this.props.route}
						hideDealFields={this.props.hideDealFields}
						isConfigMode={this.props.isConfigMode}
						userSelf={this.props.userSelf}
						translator={this.props.translator}
						searchInputText={this.props.fieldsSearchInputText}
						routeChanged={_.get(this.props.route, 'routeChanged', false)}
						searchComponent={this.getSearchComponent(spacing)}
						fieldsSearchInputChange={this.props.fieldsSearchInputChange}
						getFieldsListComponent={this.getFieldsListComponent}
						tabsComponent={this.getTabsComponent()}
						labelClass={this.props.labelClass}
						isHighlighted={(id) => this.isHighlighted(id)}
						setHighlightedOption={(ev) => this.setHighlightedOption(ev)}
						optionClassNames={(id) => this.getSelectOptionClassNames(id)}
						showLinkText={this.props.showLinkText}
						popoverPortalTo={this.props.popoverPortalTo}
						onPopupVisibleChange={this.props.onPopupVisibleChange}
						triggerContent={this.props.triggerContent}
						fontPickersEnabled={this.props.userSelf.companyFeatures.get(
							'wysiwyg_formatting'
						)}
					/>
				</HotKeys>
			</div>
		);
	}
}

FieldPickerContainer.propTypes = {
	API: PropTypes.object,
	translator: PropTypes.object.isRequired,
	route: PropTypes.object,
	person: PropTypes.object,
	organization: PropTypes.object,
	fields: PropTypes.array,
	linkedDeal: PropTypes.object,
	linkedLead: PropTypes.object,
	fieldRecents: PropTypes.array,
	getFieldValue: PropTypes.func,
	saveDraft: PropTypes.func,
	hideDealFields: PropTypes.bool,
	hideLeadFields: PropTypes.bool,
	hideLeadFieldsInGroupEmail: PropTypes.bool,
	setConfigMode: PropTypes.func,
	fillFieldsWithData: PropTypes.func,
	isConfigMode: PropTypes.bool,
	draftModel: PropTypes.object,
	setFields: PropTypes.func,
	setRecents: PropTypes.func,
	updateRecents: PropTypes.func,
	editors: PropTypes.object.isRequired,
	activeEditorName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	fieldsSearchInputChange: PropTypes.func,
	fieldsSearchInputText: PropTypes.string,
	userSelf: PropTypes.object.isRequired,
	usageTracking: PropTypes.object.isRequired,
	labelClass: PropTypes.string,
	showLinkText: PropTypes.bool,
	popoverPortalTo: PropTypes.object,
	onPopupVisibleChange: PropTypes.func,
	trackingData: PropTypes.object,
	triggerContent: PropTypes.node
};

FieldPickerContainer.defaultProps = {
	showLinkText: true,
	popoverPortalTo: document.body,
	trackingData: { source: 'composer' }
};

const mapStateToProps = (store) => {
	return {
		translator: store.translator,
		route: store.route,
		error: store.error,
		fields: getFilteredFields(store),
		userSelf: store.userSelf,
		linkedDeal: store.linkedDeal,
		linkedLead: store.linkedLead,
		fieldRecents: store.fieldRecents,
		hideDealFields: store.hideDealFields,
		hideLeadFields: store.hideLeadFields,
		fieldsSearchInputText: store.fieldsSearchInputText,
		person: store.person,
		organization: store.organization
	};
};

export default connect(mapStateToProps, {
	setFields,
	getFieldValue,
	setRecents,
	updateRecents,
	setConfigMode,
	fieldsSearchInputChange,
	fillFieldsWithData
})(FieldPickerContainer);
