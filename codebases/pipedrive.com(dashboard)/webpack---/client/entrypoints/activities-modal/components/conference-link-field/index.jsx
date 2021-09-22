import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Dropmenu, Snackbar, Spinner } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import ConferenceLink from './conference-link';
import ErrorMessage from './error-message';
import { ExpansionContainer, StyledIcon } from '../form/form-styles';
import {
	ConferenceFieldWrapper,
	CheckingIntegrationsWrapper,
	CheckingIntegrationsSpinner,
	CancelCheckingIntegrationsButton,
} from './conference-link-styles';
import {
	deleteConferenceMeetingUrl as deleteConferenceMeetingUrlAction,
	cancelCheckingIntegrations as cancelCheckingIntegrationsAction,
} from '../../store/actions/conference-meeting';
import ConferenceDropdownButton from './conference-dropdown-button';
import ConferenceDropdownContent from './conference-dropdown-content';

// eslint-disable-next-line complexity
const ConferenceLinkField = ({
	deleteConferenceMeetingUrl,
	conferenceMeetingUrl,
	translator,
	error,
	isLoading,
	integrationInstalled,
	conferenceMeetingIntegrations,
	isInstallingConferenceMeetingIntegration,
	cancelCheckingIntegrations,
}) => {
	const [deletedSnackbarVisible, setDeletedSnackbarVisible] = useState(false);
	const conferenceLinkVisible = !isLoading && integrationInstalled && conferenceMeetingUrl;
	const [popoverVisible, setPopoverVisible] = useState(false);

	useEffect(() => {
		setPopoverVisible(false);
	}, [conferenceMeetingIntegrations]);

	const deleteConferenceLink = () => {
		deleteConferenceMeetingUrl();
		setDeletedSnackbarVisible(true);
	};

	const toggleDropdown = () => setPopoverVisible(!popoverVisible);

	const popoverProps = {
		placement: 'bottom-start',
		visible: popoverVisible,
		onPopupVisibleChange: (isVisible) => !isVisible && setPopoverVisible(isVisible),
	};

	const notLoading =
		!isInstallingConferenceMeetingIntegration && !conferenceLinkVisible && !isLoading;

	return (
		<ExpansionContainer>
			<StyledIcon icon="videocam" alignStart />
			<ConferenceFieldWrapper conferenceLinkVisible={conferenceLinkVisible}>
				{conferenceLinkVisible && (
					<ConferenceLink onDelete={deleteConferenceLink} link={conferenceMeetingUrl} />
				)}
				{isInstallingConferenceMeetingIntegration && (
					<CheckingIntegrationsWrapper>
						<CheckingIntegrationsSpinner size="s" />
						{translator.gettext('Checking for integration')}
						<CancelCheckingIntegrationsButton
							color="ghost-alternative"
							onClick={cancelCheckingIntegrations}
						>
							{translator.gettext('Cancel')}
						</CancelCheckingIntegrationsButton>
					</CheckingIntegrationsWrapper>
				)}
				{!conferenceLinkVisible && isLoading && <Spinner size="s" />}
				{notLoading && (
					<Dropmenu
						popoverProps={popoverProps}
						content={<ConferenceDropdownContent toggleDropdown={toggleDropdown} />}
					>
						{/* Surrounding this button with div because of CUI bug https://pipedrive.slack.com/archives/C0L28H5L3/p1552471952007900 */}
						<div>
							<ConferenceDropdownButton
								toggleDropdown={toggleDropdown}
								popoverVisible={popoverVisible}
							/>
						</div>
					</Dropmenu>
				)}
				{error && <ErrorMessage errorType={error} />}
			</ConferenceFieldWrapper>

			{deletedSnackbarVisible && (
				<Snackbar
					message={translator.gettext('Video call invitation removed!')}
					onDismiss={() => setDeletedSnackbarVisible(false)}
					data-test="deleted-conference-link-snackbar"
				/>
			)}
		</ExpansionContainer>
	);
};

ConferenceLinkField.propTypes = {
	translator: PropTypes.object.isRequired,
	deleteConferenceMeetingUrl: PropTypes.func.isRequired,
	conferenceMeetingUrl: PropTypes.string,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
	integrationInstalled: PropTypes.bool,
	conferenceMeetingIntegrations: ImmutablePropTypes.list.isRequired,
	isInstallingConferenceMeetingIntegration: PropTypes.bool,
	cancelCheckingIntegrations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const conferenceMeetingUrlInProgress = state.getIn([
		'conferenceMeeting',
		'conferenceMeetingUrlInProgress',
	]);
	const integrationInstalled = state.getIn([
		'conferenceMeeting',
		'isConferenceMeetingIntegrationInstalled',
	]);
	const isLoading = conferenceMeetingUrlInProgress || integrationInstalled === null;

	return {
		conferenceMeetingUrl: state.getIn(['form', 'conferenceMeetingUrl']),
		error: state.getIn(['form', 'conferenceMeetingUrlError']),
		isLoading,
		integrationInstalled,
		conferenceMeetingIntegrations: state.getIn([
			'conferenceMeeting',
			'conferenceMeetingIntegrations',
		]),
		isInstallingConferenceMeetingIntegration: state.getIn([
			'conferenceMeeting',
			'isInstallingConferenceMeetingIntegration',
		]),
	};
};

const mapDispatchToProps = {
	deleteConferenceMeetingUrl: deleteConferenceMeetingUrlAction,
	cancelCheckingIntegrations: cancelCheckingIntegrationsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(ConferenceLinkField));
