import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Message, Text } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import { withCoachMarks, coachMarkTags } from '../../with-coachmarks';
import { clickOnCalendarSyncTeaser, closeCalendarSyncTeaser } from '../../store/actions/modal';

const Teaser = styled(Message)`
	position: absolute;
	bottom: 0;
	right: 0;
	width: 100%;
	z-index: 2;
	box-sizing: border-box;
`;

const { CALENDAR_SYNC_TEASER } = coachMarkTags;

const CalendarSyncTeaser = ({
	translator,
	clickOnTeaser,
	closeTeaser,
	coachMarks,
	closeCoachMark,
}) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const coachMark = coachMarks[CALENDAR_SYNC_TEASER];
		const shouldShow = coachMark && coachMark.visible;

		setVisible(shouldShow);
	}, [coachMarks]);

	const close = () => {
		closeTeaser();
		closeCoachMark(CALENDAR_SYNC_TEASER);
	};

	return (
		<Teaser
			onClose={close}
			visible={visible}
			noAnimation
			alternative
			alternativePosition="bottom"
		>
			<Text>
				<a href="/settings/calendar-sync" target="_blank" onClick={clickOnTeaser}>
					{translator.pgettext(
						'Connect your calendar with Pipedrive to see all your activities in one place',
						'Connect your calendar',
					)}{' '}
					{/* NOSONAR */}
				</a>{' '}
				{translator.pgettext(
					'Connect your calendar with Pipedrive to see all your activities in one place',
					'with Pipedrive to see all your activities in one place',
				)}{' '}
				{/* NOSONAR */}
			</Text>
		</Teaser>
	);
};

CalendarSyncTeaser.propTypes = {
	translator: PropTypes.object.isRequired,
	clickOnTeaser: PropTypes.func.isRequired,
	closeTeaser: PropTypes.func.isRequired,
	coachMarks: PropTypes.object.isRequired,
	closeCoachMark: PropTypes.func.isRequired,
};

export default connect(null, {
	clickOnTeaser: clickOnCalendarSyncTeaser,
	closeTeaser: closeCalendarSyncTeaser,
})(modalContext(withCoachMarks(CalendarSyncTeaser, [CALENDAR_SYNC_TEASER])));
