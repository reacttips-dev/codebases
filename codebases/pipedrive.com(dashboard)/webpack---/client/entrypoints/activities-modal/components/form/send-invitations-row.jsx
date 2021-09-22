import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Checkbox, Icon, Select, Tooltip } from '@pipedrive/convention-ui-react';

import { updateField as updateFieldAction } from '../../store/actions/form';
import { setNotificationsLanguage as setNotificationsLanguageAction } from '../../store/actions/notifications';
import modalContext from '../../../../utils/context';

import {
	Row,
	InvitationInfoLink,
	InvitationLanguageSelect,
	InvitationOptionsWrapper,
	SelectLanguageLabel,
	SendInvitesLabel,
	StyledIcon,
} from './form-styles';

const ATTENDEES_NOTIFICATIONS_ARTICLE_URL =
	'https://support.pipedrive.com/hc/en-us/articles/115005286065';

const SendInvitationsRow = (props) => {
	const {
		sendNotifications,
		notificationLanguageId,
		setNotificationsLanguage,
		updateField,
		languages,
		translator,
	} = props;

	return (
		<Row>
			<StyledIcon icon="ac-email" />
			<InvitationOptionsWrapper>
				<Checkbox
					checked={sendNotifications}
					onChange={() => updateField('sendActivityNotifications', !sendNotifications)}
				>
					<SendInvitesLabel>
						{translator.gettext('Invite linked people')}
					</SendInvitesLabel>
				</Checkbox>
				{sendNotifications && (
					<>
						{' ⋅ '}
						<SelectLanguageLabel>{translator.gettext('Language')}</SelectLanguageLabel>
						<InvitationLanguageSelect
							value={notificationLanguageId}
							onChange={setNotificationsLanguage}
							size="s"
							allowClear={false}
						>
							{languages.map((language) => (
								<Select.Option key={language.get('id')} value={language.get('id')}>
									{language.get('name')}
								</Select.Option>
							))}
						</InvitationLanguageSelect>
					</>
				)}
				<InvitationInfoLink
					href={ATTENDEES_NOTIFICATIONS_ARTICLE_URL}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Tooltip content={translator.gettext('Learn more about activity invites')}>
						<Icon icon="help-outline" size="s" color="black-32" />
					</Tooltip>
				</InvitationInfoLink>
			</InvitationOptionsWrapper>
		</Row>
	);
};

SendInvitationsRow.propTypes = {
	translator: PropTypes.object.isRequired,
	sendNotifications: PropTypes.bool,
	notificationLanguageId: PropTypes.number,
	languages: ImmutablePropTypes.list.isRequired,
	updateField: PropTypes.func.isRequired,
	setNotificationsLanguage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		sendNotifications: state.getIn(['form', 'sendActivityNotifications']),
		notificationLanguageId: state.getIn(['notifications', 'notificationLanguageId']),
		languages: state.getIn(['modal', 'languages']),
	};
};

const mapDispatchToProps = {
	updateField: updateFieldAction,
	setNotificationsLanguage: setNotificationsLanguageAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(SendInvitationsRow));
