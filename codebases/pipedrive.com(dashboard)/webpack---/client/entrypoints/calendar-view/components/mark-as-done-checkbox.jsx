import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Tooltip } from '@pipedrive/convention-ui-react';

import { trackCalendarItemMarkedDoneUndone } from '../../../utils/track-usage';
import {
	prepareNextActivityData,
	shouldScheduleNextActivityForDeal,
} from '../../../utils/activity';
import withContext from '../../../utils/context';

const MarkAsDoneCheckBox = ({ item, date, translator, webappApi, updateThisItem }) => {
	const isActivityDone = item.getIn(['data', 'done']);

	if (
		item.get('isPreview') ||
		item.get('isDragging') ||
		item.get('masterActivityId') ||
		item.get('data').get('rec_master_activity_id')
	) {
		return null;
	}

	if (date && !item.get('startDateTime').isSame(date, 'day')) {
		return null;
	}

	return (
		<div onClick={(event) => event.stopPropagation()}>
			<Tooltip
				placement="top-end"
				offset="xs"
				popperProps={{
					positionFixed: true,
					modifiers: {
						preventOverflow: { enabled: true },
					},
				}}
				content={
					<span>
						{isActivityDone
							? translator.gettext('Mark as not done')
							: translator.gettext('Mark as done')}
					</span>
				}
			>
				<Checkbox
					checked={isActivityDone}
					type="round"
					onChange={async () => {
						const updatedItem = await updateThisItem(
							item.setIn(['data', 'done'], !item.getIn(['data', 'done'])),
						);

						trackCalendarItemMarkedDoneUndone(webappApi, item, isActivityDone);

						const shouldScheduleNextActivity = shouldScheduleNextActivityForDeal(
							updatedItem,
						);

						if (shouldScheduleNextActivity) {
							webappApi.router.go(
								null,
								'#dialog/activity/add',
								false,
								false,
								prepareNextActivityData(updatedItem),
							);
						}
					}}
				/>
			</Tooltip>
		</div>
	);
};

MarkAsDoneCheckBox.propTypes = {
	item: PropTypes.object.isRequired,
	date: PropTypes.string,
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
	updateThisItem: PropTypes.func.isRequired,
};

export default withContext(MarkAsDoneCheckBox);
