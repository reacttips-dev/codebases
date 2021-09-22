import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';

import modalContext from '../../../../utils/context';

import { Row, Log, LogData } from './form-styles';
import { getLocalDateFromUtc } from '../../../../utils/date';
import { handleHiddenUser } from '../../../../utils/activity';

const LogDataRowUnwrapped = ({ time, user, title, translator, webappApi }) => {
	const userName = get(user, 'attributes.name');
	const isYou = get(user, 'attributes.is_you');
	const {
		userSelf: {
			attributes: { locale },
		},
	} = webappApi;
	const displayTime = getLocalDateFromUtc(time, locale).format('L LT');

	return (
		<LogData>
			{`${title}: ${displayTime} · ${userName} ${
				isYou ? `(${translator.pgettext('John Smith (you)', 'you')})` : ''
			}`}
		</LogData>
	);
};

LogDataRowUnwrapped.propTypes = {
	time: PropTypes.string,
	user: PropTypes.object,
	title: PropTypes.string,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
};

const LogDataRow = modalContext(LogDataRowUnwrapped);

const LogRow = ({ addTime, createdByUserId, updateTime, updateUserId, users, translator }) => {
	const showLog = addTime && createdByUserId;
	const hasBeenUpdated = updateTime && updateUserId;

	if (!showLog) {
		return null;
	}

	const hiddenUserText = translator.gettext('hidden');
	const getUser = (userId) =>
		userId &&
		(users.find((user) => user.id === userId) || handleHiddenUser(userId, hiddenUserText));

	return (
		<Row>
			<Log>
				<LogDataRow
					time={addTime}
					user={getUser(createdByUserId)}
					title={translator.gettext('Created')}
				/>
				{hasBeenUpdated && (
					<LogDataRow
						time={updateTime}
						user={getUser(updateUserId)}
						title={translator.gettext('Last modified')}
					/>
				)}
			</Log>
		</Row>
	);
};

LogRow.propTypes = {
	users: PropTypes.array,
	addTime: PropTypes.string,
	createdByUserId: PropTypes.number,
	updateTime: PropTypes.string,
	updateUserId: PropTypes.number,
	translator: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		addTime: state.getIn(['form', 'addTime']),
		createdByUserId: state.getIn(['form', 'createdByUserId']),
		updateTime: state.getIn(['form', 'updateTime']),
		updateUserId: state.getIn(['form', 'updateUserId']),
	};
};

export default connect(mapStateToProps, null)(modalContext(LogRow));
