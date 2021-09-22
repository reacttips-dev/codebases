import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tabs, Tooltip } from '@pipedrive/convention-ui-react';
import { HotKeys } from 'react-hotkeys';
import Config from '../../../../client-config';
import popoverOptionHeight from '../../helpers/popover-option-height';

const TABS = [
	{
		name: 'recents',
		icon: 'flow',
		getTitle: (translator) => {
			return translator.gettext('Recents');
		}
	},
	{
		name: 'lead',
		icon: 'lead',
		getTitle: (translator) => {
			return translator.gettext('Lead');
		}
	},
	{
		name: 'deal',
		icon: 'deal',
		getTitle: (translator) => {
			return translator.gettext('Deal');
		}
	},
	{
		name: 'person',
		icon: 'person',
		getTitle: (translator) => {
			return translator.gettext('Person');
		}
	},
	{
		name: 'organization',
		icon: 'organization',
		getTitle: (translator) => {
			return translator.gettext('Organization');
		}
	},
	{
		name: 'user',
		icon: 'ellipsis',
		getTitle: (translator) => {
			return translator.gettext('Other');
		}
	}
];
const classPrefix = `${Config.appPrefix}-${Config.emailTemplatesPrefix}`;

class FieldPickerTabs extends Component {
	constructor(props) {
		super(props);
		this.state = { activeTab: 'recents' };
	}
	render() {
		const hideDealFields = this.props.hideDealFields && !this.props.isConfigMode;
		const hideLeadFields = this.props.hideLeadFields;

		if (this.props.searchInputText) {
			return null;
		}

		return (
			<HotKeys handlers={this.props.keyHandlers}>
				<Tabs
					className={`${classPrefix}-popover__tabs`}
					tabs={
						<Fragment>
							{TABS.map((tab, index) => {
								if (
									(tab.name === 'deal' && hideDealFields) ||
									(tab.name === 'lead' && hideLeadFields)
								) {
									return null;
								}

								const isActive = tab.name === this.state.activeTab;

								return (
									<Tabs.Tab
										key={index}
										active={isActive}
										className={
											isActive ? `${classPrefix}-popover__tab--active` : ''
										}
										onClick={(ev) => {
											ev.preventDefault();
											this.props.onTabClick();
											this.setState({ activeTab: tab.name });
										}}
										data-keyboard-horizontal-navigation="true"
									>
										<Tooltip
											content={tab.getTitle(this.props.translator)}
											placement="top"
											popperProps={{ positionFixed: true }}
										>
											<Icon icon={tab.icon} />
										</Tooltip>
									</Tabs.Tab>
								);
							})}
						</Fragment>
					}
				>
					<div
						className={`${classPrefix}-popover__select-options-wrapper`}
						style={popoverOptionHeight.getOptionWrapperStyle()}
					>
						{this.props.getFieldsListComponent(this.state.activeTab)}
					</div>
				</Tabs>
			</HotKeys>
		);
	}
}

FieldPickerTabs.propTypes = {
	searchInputText: PropTypes.string,
	onTabClick: PropTypes.func,
	getFieldsListComponent: PropTypes.func.isRequired,
	isConfigMode: PropTypes.bool,
	translator: PropTypes.object,
	hideDealFields: PropTypes.bool,
	hideLeadFields: PropTypes.bool,
	keyHandlers: PropTypes.object
};

export default FieldPickerTabs;
