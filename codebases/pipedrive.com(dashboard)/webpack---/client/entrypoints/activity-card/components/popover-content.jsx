import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Spacing } from '@pipedrive/convention-ui-react';

import { getTimeSpan } from '../../../utils/timespan';
import { getActivityTypeByKey } from '../../../utils/activity';
import activityCardContext from '../../../utils/context';
import css from './lib/variables.scss';

import HoverCard from '../../../common-components/hover-card';
import CardFooter from './card-footer';
import CardRow from './card-row';
import Guests from './guests/guests';
import LinkCardRow from './link-card-row';
import ParticipantsRow from './participants-row';
import Location from './location';
import ConferenceLinkField from './conference-link-field';

const ContentWrapper = styled.div`
	width: 376px;
`;
const extraHeightForFooter = 60;
const CardContent = styled(Spacing)`
	overflow-y: auto;
	max-height: calc(100vh - ${extraHeightForFooter}px);
	box-sizing: border-box;
`;
const Title = styled.div`
	font-size: ${css.fontSizeXl};
	line-height: ${css.lineHeightXl};
`;
const ActivityTime = styled.div`
	margin-top: 4px;
`;

const PopoverContent = (props) => {
	const {
		subject,
		location,
		attendees,
		participants,
		publicDescription,
		note,
		dealTitle,
		dealId,
		ownerName,
		organizationName,
		organizationId,
		dueDate,
		dueTime,
		duration,
		busyFlag,
		webappApi,
		type,
		updateActivityCardPlacement,
		translator,
		logger,
		leadTitle,
		leadId,
	} = props;

	const locale = webappApi.userSelf.attributes.locale;
	const activityType = getActivityTypeByKey(webappApi, type);
	const activityIcon = activityType ? `ac-${activityType.icon_key}` : 'person';

	return (
		<ContentWrapper data-test="activity-card-popover-content">
			<CardContent all="m">
				<CardRow icon={activityIcon} iconSize="m" iconColor="black-88">
					<Title data-test="activity-card-title">{subject}</Title>
					<ActivityTime data-test="activity-card-time">
						{getTimeSpan({ date: dueDate, time: dueTime, duration, locale })}
					</ActivityTime>
				</CardRow>

				<ConferenceLinkField />

				<CardRow
					icon="address"
					title={translator.gettext('Location')}
					data-test="activity-card-location"
				>
					{location && <Location location={location} />}
				</CardRow>
				<CardRow icon="ac-meeting" title={translator.gettext('Guests')}>
					{attendees && !attendees.isEmpty() && (
						<Guests
							updateActivityCardPlacement={updateActivityCardPlacement}
							guests={attendees}
						/>
					)}
				</CardRow>
				<CardRow
					icon="description"
					title={translator.gettext('Public description')}
					data-test="activity-card-description"
					childrenAsHtml={true}
				>
					{publicDescription}
				</CardRow>
				<CardRow icon="busy-free" title={translator.gettext('Free/Busy')}>
					{typeof busyFlag === 'boolean' && !busyFlag ? translator.gettext('Free') : null}
				</CardRow>
				<CardRow
					icon="note"
					title={translator.gettext('Notes')}
					rowStyle="note"
					childrenAsHtml={true}
				>
					{note}
				</CardRow>
				<CardRow
					icon="user"
					title={translator.gettext('Owner')}
					data-test="activity-card-owner"
				>
					{ownerName}
				</CardRow>
				<HoverCard
					webappApi={webappApi}
					logger={logger}
					source='activity_card'
					hoverCardProps={{
						type: 'deal',
						id: dealId,
					}}
				>
					<LinkCardRow
						icon="deal"
						title={translator.gettext('Deal')}
						url={`/deal/${dealId}`}
					>
						{dealTitle}
					</LinkCardRow>
				</HoverCard>
				<HoverCard
					webappApi={webappApi}
					logger={logger}
					source='activity_card'
					hoverCardProps={{
						type: 'lead',
						id: leadId,
					}}
				>
					<LinkCardRow
						icon="lead"
						title={translator.gettext('Lead')}
						url={`/leads/inbox/${leadId}`}
					>
						{leadTitle}
					</LinkCardRow>
				</HoverCard>
				<CardRow
					icon="person"
					title={translator.ngettext(
						'Person',
						'Persons',
						participants ? participants.size : 1,
					)}
				>
					{participants && !participants.isEmpty() && (
						<ParticipantsRow participants={participants} />
					)}
				</CardRow>
				<HoverCard
					webappApi={webappApi}
					logger={logger}
					source='activity_card'
					hoverCardProps={{
						type: 'organization',
						id: organizationId,
					}}
				>
					<LinkCardRow
						icon="organization"
						title={translator.gettext('Organization')}
						url={`/organization/${organizationId}`}
					>
						{organizationName}
					</LinkCardRow>
				</HoverCard>
			</CardContent>
			<CardFooter />
		</ContentWrapper>
	);
};

PopoverContent.propTypes = {
	subject: PropTypes.string,
	type: PropTypes.string,
	location: PropTypes.string,
	attendees: ImmutablePropTypes.list,
	participants: ImmutablePropTypes.list,
	ownerName: PropTypes.string,
	publicDescription: PropTypes.string,
	organizationName: PropTypes.string,
	organizationId: PropTypes.number,
	note: PropTypes.string,
	dealTitle: PropTypes.string,
	dealId: PropTypes.number,
	dueDate: PropTypes.string,
	dueTime: PropTypes.string,
	duration: PropTypes.string,
	busyFlag: PropTypes.bool,
	webappApi: PropTypes.object,
	translator: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	updateActivityCardPlacement: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	subject: state.getIn(['activity', 'subject']),
	type: state.getIn(['activity', 'type']),
	location: state.getIn(['activity', 'location']),
	attendees: state.getIn(['activity', 'attendees']),
	participants: state.getIn(['activity', 'participants']),
	ownerName: state.getIn(['activity', 'ownerName']),
	publicDescription: state.getIn(['activity', 'publicDescription']),
	note: state.getIn(['activity', 'note']),
	dealTitle: state.getIn(['activity', 'dealTitle']),
	dealId: state.getIn(['activity', 'dealId']),
	dueDate: state.getIn(['activity', 'dueDate']),
	dueTime: state.getIn(['activity', 'dueTime']),
	duration: state.getIn(['activity', 'duration']),
	organizationName: state.getIn(['activity', 'orgName']),
	organizationId: state.getIn(['activity', 'orgId']),
	busyFlag: state.getIn(['activity', 'busyFlag']),
	leadTitle: state.getIn(['activity', 'leadTitle']),
	leadId: state.getIn(['activity', 'leadId']),
});

export default connect(mapStateToProps)(activityCardContext(PopoverContent));
