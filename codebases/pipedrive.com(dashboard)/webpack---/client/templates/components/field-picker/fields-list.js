import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import Config from '../../../../client-config';
import { Icon, Separator, Option } from '@pipedrive/convention-ui-react';
import { getFilteredFields } from '../../helpers/fields';
import NoMatchFound from '../../../shared/components/no-match-found';

const iconAllowedTypes = ['recents', 'search', 'user'];
const classPrefix = `${Config.appPrefix}-${Config.emailTemplatesPrefix}`;

class FieldsList extends Component {
	hasIcon() {
		return iconAllowedTypes.indexOf(this.props.type) > -1;
	}

	renderFields(fields) {
		const fieldsData = getFilteredFields(fields, this.props.type, this.props.recents);
		const isRecents = this.props.type === 'recents';

		if (!fields.length && isRecents) {
			return this.getNoRecentsMessage();
		}

		return (
			<div className={`${classPrefix}-popover__fields-list`}>
				{this.getFieldsList(fieldsData.default)}
				{this.getCustomFieldsList(fieldsData.custom)}
			</div>
		);
	}

	getCustomFieldsList(fields) {
		if (fields.length) {
			return (
				<Fragment>
					<Separator />
					{this.getFieldsList(fields)}
				</Fragment>
			);
		}

		return null;
	}

	getFieldsList(fields) {
		const optionClasses = `${classPrefix}-popover__select-option`;
		const isRecents = this.props.type === 'recents';

		const getIcon = (field) => {
			return (
				this.hasIcon() && (
					<Icon
						className={`${optionClasses}-icon`}
						icon={field.type}
						/* remove iconSize hack once 'user' icon is available in small size from cui */
						size={field.iconSize ? null : 's'}
						style={{ width: 16, height: 16 }}
					/>
				)
			);
		};

		return fields.map((field, i) => {
			const fieldDataOption = `${field.type}_${field.data_key}`;

			return (
				<HotKeys handlers={this.props.keyHandlers} key={`${i}_uid`}>
					<Option
						className={`${this.props.optionClassNames(fieldDataOption)} ${
							this.hasIcon() ? `${optionClasses}--icon` : ''
						}`}
						onClick={(ev) => this.props.onAddField(ev, isRecents)}
						onMouseOver={(e) => this.props.setHighlightedOption(e)}
						data-type={field.type}
						data-key={field.data_key}
						data-name={field.title}
						data-keyboard-navigation="true"
						data-option={fieldDataOption}
						data-custom-field={field.custom_field}
						data-phone-custom-field={field.phoneCustomField}
						manualHighlight={true}
						highlighted={this.props.isHighlighted(fieldDataOption)}
					>
						{getIcon(field)}
						<span className={`${classPrefix}-popover__select-option-text`}>
							{field.title}
						</span>
					</Option>
				</HotKeys>
			);
		});
	}

	getNoRecentsMessage() {
		return (
			<div className={`${classPrefix}-popover__select-no-matches`}>
				<p>{this.props.translator.gettext('No recent fields')}</p>
				<small>
					{this.props.translator.gettext('Your recently picked fields will appear here.')}
				</small>
			</div>
		);
	}

	render() {
		if (this.props.fields.length) {
			return this.renderFields(this.props.fields);
		} else if (this.props.searchInputText) {
			return <NoMatchFound />;
		}
	}
}

FieldsList.propTypes = {
	type: PropTypes.string.isRequired,
	translator: PropTypes.object.isRequired,
	fields: PropTypes.array,
	recents: PropTypes.array,
	onAddField: PropTypes.func.isRequired,
	searchInputText: PropTypes.string,
	keyHandlers: PropTypes.object.isRequired,
	isHighlighted: PropTypes.func.isRequired,
	setHighlightedOption: PropTypes.func.isRequired,
	optionClassNames: PropTypes.func.isRequired
};

export default FieldsList;
