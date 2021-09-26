import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Icon, Tooltip } from '@pipedrive/convention-ui-react';

import Filter from './filter';
import ActivityTypeFilter from './activity-type-filter';
import WeekSelect from './week-select';
import SchedulerButton from './scheduler-button';

import { onViewSwitched } from '../../../utils/track-usage';
import withContext from '../../../utils/context';
import classes from '../scss/_actions.scss';

const Actions = ({ translator, webappApi }) => {
	return (
		<React.Fragment>
			<div className={classes.row}>
				<ButtonGroup className={classes.viewSwitch}>
					<Tooltip content={translator.gettext('List')}>
						<Button
							className={classes.wideButton}
							href="/activities/list"
							onClick={() => onViewSwitched(webappApi)}
						>
							<Icon icon="list" size="s" />
						</Button>
					</Tooltip>
					<Tooltip content={translator.gettext('Calendar')}>
						<Button className={classes.wideButton} href="/activities/calendar" active>
							<Icon icon="calendar" size="s" />
						</Button>
					</Tooltip>
				</ButtonGroup>
				<div className={classes.buttonWrapper}>
					<Button
						href="#dialog/activity/add"
						color="green"
						data-test="add-activity-button"
						aria-label={translator.gettext('Add activity')}
					>
						<Icon icon="plus" color="white" size="s" />
						{translator.gettext('Activity')}
					</Button>
				</div>
				<SchedulerButton />
				<div className={classes.filter}>
					<WeekSelect />
					<Filter />
				</div>
			</div>

			<div className={classes.row}>
				<div className={classes.activityTypeFilter}>
					<ActivityTypeFilter />
				</div>
			</div>
		</React.Fragment>
	);
};

Actions.propTypes = {
	translator: PropTypes.object.isRequired,
	webappApi: PropTypes.object.isRequired,
};

export default withContext(Actions);
