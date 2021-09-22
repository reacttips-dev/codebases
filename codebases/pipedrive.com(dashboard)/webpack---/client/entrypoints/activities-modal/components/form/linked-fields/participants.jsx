import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { MultipleContacts } from '@pipedrive/form-fields';
import { Tag, Badge } from '@pipedrive/convention-ui-react';
import modalContext from '../../../../../utils/context';
import HoverCard from '../../../../../common-components/hover-card';

const ParticipantsInput = styled(MultipleContacts)`
	margin-bottom: 8px;
`;

const ParticipantsField = (props) => {
	const {
		participants,
		updateField,
		translator,
		hasParticipantWithoutEmail,
		sendActivityNotifications,
		webappApi,
		logger,
	} = props;
	const participantsKey = participants
		.map((person) => person && (person.get('id') || person.get('value')))
		.hashCode();

	const renderSelectedItem = (state, { removeItem }) => {
		const { item, index } = state;

		return (
			<HoverCard
				webappApi={webappApi}
				logger={logger}
				hoverCardProps={{
					type: 'person',
					id: item.id,
				}}
			>
				<Tag key={`${item}${index}`} dismissable onDismiss={() => removeItem(index)}>
					{item.name}
					{item.is_new && <Badge color="blue">{translator.gettext('new')}</Badge>}
				</Tag>
			</HoverCard>
		);
	};

	return (
		<div data-test="activity-form-participants-suggestion">
			<ParticipantsInput
				key={`participants-${participantsKey}`}
				value={participants && participants.toJS()}
				placeholder={participants.size > 0 ? '' : translator.gettext('People')}
				onComponentChange={(selected) => updateField('participants', selected)}
				portalTo={document.body}
				renderSelectedItem={renderSelectedItem}
				error={
					sendActivityNotifications &&
					(participants.isEmpty() || hasParticipantWithoutEmail)
						? translator.gettext('Some of the participants are missing email address')
						: null
				}
				allowNewItems
				allowClear
			/>
		</div>
	);
};

ParticipantsField.propTypes = {
	updateField: PropTypes.func.isRequired,
	participants: ImmutablePropTypes.list,
	translator: PropTypes.object.isRequired,
	sendActivityNotifications: PropTypes.bool,
	hasParticipantWithoutEmail: PropTypes.bool,
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
};

export default modalContext(ParticipantsField);
