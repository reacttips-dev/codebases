import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Icon, Spacing } from '@pipedrive/convention-ui-react';
import { fromJS } from 'immutable';
import modalContext from '../../../../utils/context';
import { CONNECT_ERROR, RETRY_ERROR } from '../../../../config/constants';
import colors from '../../colors.scss';
import fonts from '../../fonts.scss';

const ErrorMessageWrapper = styled(Text)`
	color: ${colors.errorColor};
	font-size: ${fonts.errorFontSize};
`;

const ErrorLink = styled.a`
	display: inline-flex;
	align-items: center;
`;

const integrationFallback = fromJS({
	short_name: 'integration',
	auth_url: 'https://www.pipedrive.com/en/marketplace',
});

const ErrorMessage = ({
	translator,
	errorType,
	activeConferenceMeetingIntegration = integrationFallback,
}) => {
	const errors = {
		[CONNECT_ERROR]: (
			<>
				{translator.pgettext(
					'Couldn’t connect to your account. Please log into [Integration] via Marketplace',
					'Couldn’t connect to your account. Please log into %s via ',
					activeConferenceMeetingIntegration.get('short_name'),
				)}
				<ErrorLink
					href={activeConferenceMeetingIntegration.get('auth_url')}
					target="_blank"
					rel="noopener noreferrer"
				>
					{translator.pgettext(
						'Couldn’t connect to your account. Please log into [Integration] via Marketplace',
						'Marketplace',
					)}
					<Icon icon="redirect" size="s" color="blue" />
				</ErrorLink>
			</>
		),
		[RETRY_ERROR]: translator.gettext('Couldn’t generate meeting link. Please try again.'),
	};

	return (
		<Spacing top="xs">
			<ErrorMessageWrapper data-test="conference-link-field-error-message">
				{errors[errorType]}
			</ErrorMessageWrapper>
		</Spacing>
	);
};

ErrorMessage.propTypes = {
	translator: PropTypes.object.isRequired,
	errorType: PropTypes.string.isRequired,
	activeConferenceMeetingIntegration: PropTypes.object,
};

export default connect((state) => ({
	activeConferenceMeetingIntegration: state.getIn([
		'conferenceMeeting',
		'activeConferenceMeetingIntegration',
	]),
}))(modalContext(ErrorMessage));
