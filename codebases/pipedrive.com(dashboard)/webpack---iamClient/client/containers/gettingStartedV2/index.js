import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImportDataContent from './accordionImportDataContent';
import GenericContent from './accordionGenericContent';
import AccordionList from './accordionList';
import { DummyDataSection } from 'containers/dummyData';

import style from './style.css';

const GettingStartedV2 = ({ gettext, gettingStartedItemClick, gettingStartedItemExpand, userLang, GSVersion }) => {
	const [accordionList, setAccordionList] = useState([
		{
			title: gettext('Import data'),
			subTitle: gettext('Use a spreadsheet or direct download'),
			icon: 'import-data-blue',
			isActive: true,
			content: <ImportDataContent
				GSVersion={GSVersion}
				userLang={userLang}
				gettext={gettext}
				gettingStartedItemClick={gettingStartedItemClick}/>,
		},
		{
			title: gettext('Invite team'),
			subTitle: gettext('Add your team to the company'),
			icon: 'invite-team-green',
			isActive: false,
			content: <GenericContent gettingStartedItemClick={gettingStartedItemClick} GSVersion={GSVersion}
				path="/settings/users/add" buttonText={gettext('Invite team')}
				bodyText={gettext('Adding your teammates allows you to work efficiently. You can also set goals and track their progress across the team.')}/>,
		},
		{
			title: gettext('Sync email'),
			subTitle: gettext('Unlock your Sales Inbox'),
			icon: 'email-sync-yellow',
			isActive: false,
			content: <GenericContent gettingStartedItemClick={gettingStartedItemClick} GSVersion={GSVersion} path="/mail/inbox"
				buttonText={gettext('Sync email')}
				bodyText={gettext('Pipedrive will integrate with your email and automatically link relevant contacts, leads, and deals to email threads they belong to.')}/>,
		},
		{
			title: gettext('Sync calendar'),
			subTitle: gettext('Take control of your schedule'),
			icon: 'calendar-sync',
			isActive: false,
			content: <GenericContent gettingStartedItemClick={gettingStartedItemClick} GSVersion={GSVersion}
				path="/settings/calendar-sync" buttonText={gettext('Sync calendar')}
				bodyText={gettext('Calendar sync lets you connect your calendar to Pipedrive. From there, you can schedule and track all tasks and activities.')}/>,
		},
		{
			title: gettext('Sync contacts'),
			subTitle: gettext('Bring all your contact lists together'),
			icon: 'contact-sync',
			isActive: false,
			content: <GenericContent gettingStartedItemClick={gettingStartedItemClick} GSVersion={GSVersion}
				path="/settings/contact-sync" buttonText={gettext('Sync contacts')}
				bodyText={gettext('Syncing contacts with Pipedrive allows you to access your entire contacts directory from within the app.')}/>,
		},
	]);

	const handleItemClicked = (key, isActive) => {
		if (!isActive) {
			gettingStartedItemExpand(GSVersion);
		}

		const accordionData = isActive
			? accordionList
				.map((item, index) => {
					if (index === key) {
						item.isActive = false;
					}

					return item;
				})
			: accordionList
				.map((item, index) => {
					item.isActive = index === key;

					return item;
				});

		setAccordionList(accordionData);
	};

	return (
		<div className={style.GettingStartedV2}>
			<DummyDataSection gettext={gettext}/>

			<div className={style.GettingStartedV2__listWrapper}>
				<div className={style.GettingStartedV2__listTitleWrapper}>
					<span className={style.GettingStartedV2__listTitle}>
						{gettext('Your first steps')}
					</span>
				</div>

				<AccordionList
					list={accordionList}
					onClick={handleItemClicked}
				/>
			</div>
		</div>
	);
};

GettingStartedV2.propTypes = {
	gettext: PropTypes.func.isRequired,
	gettingStartedItemClick: PropTypes.func.isRequired,
	gettingStartedItemExpand: PropTypes.func.isRequired,
	userLang: PropTypes.string,
	GSVersion: PropTypes.object.isRequired,
};

export const mapStateToProps = (state) => {
	return {
		userLang: state.user.userLang,
	};
};

export default connect(mapStateToProps)(GettingStartedV2);