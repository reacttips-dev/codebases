import React, { useContext } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon } from '@pipedrive/convention-ui-react';
import { WebappApiContext } from 'Components/WebappApiContext';
import { UpcomingActivity } from 'Types/types';
import moment from 'moment';
import { getFormattedActivityDate } from '@pipedrive/flow-components';

type Props = {
	readonly activity: UpcomingActivity;
};

const Content = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	color: ${(props) => props.color};
	width: 100%;
	span {
		margin-left: 8px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: hidden;
		width: 100%;
		text-overflow: ellipsis;
	}

	/* Little hack to color the CUI Icons, since it
	does not accept HEX Colors as props */
	svg {
		fill: ${(props) => props.color};
	}
`;

const NoActivity: React.FC = () => {
	const t = useTranslator();

	return (
		<Content color={colors.yellow}>
			<Icon icon="warning" size="s" />
			<span>{t.gettext('No activity')}</span>
		</Content>
	);
};

export const NextActivity: React.FC<Props> = ({ activity }) => {
	const { customActivityTypesMapping } = useContext(WebappApiContext);
	const t = useTranslator();

	if (!activity) {
		return <NoActivity />;
	}

	const { type, dueDate, dueTime } = activity;
	const iconType = type ? customActivityTypesMapping[type] : '';

	const now = moment().utc();
	const { date, color } = getFormattedActivityDate({
		activityDate: dueDate,
		activityTime: dueTime,
		now,
		t,
		isDone: false,
	});

	return (
		<Content color={color}>
			<Icon icon={`ac-${iconType}`} size="s" />
			<span>{date}</span>
		</Content>
	);
};
