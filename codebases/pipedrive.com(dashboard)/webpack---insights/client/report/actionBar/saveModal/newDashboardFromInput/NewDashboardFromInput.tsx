import React from 'react';
import { Button, Input, Checkbox, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	trackDashboardCreationCanceled,
	DashboardActionSource,
} from '../../../../utils/metrics/dashboard-analytics';
import { NAME_MAX_LENGTH } from '../../../../utils/constants';

import styles from './NewDashboardFromInput.pcss';

interface NewDashboardFromInputProps {
	addReportToNewDashboard: boolean;
	setAddReportToNewDashboard: React.Dispatch<React.SetStateAction<boolean>>;
	showDashboardInput: boolean;
	setShowDashboardInput: React.Dispatch<React.SetStateAction<boolean>>;
	newDashboardName: string;
	setNewDashboardName: React.Dispatch<React.SetStateAction<string>>;
}

const NewDashboardFromInput: React.FC<NewDashboardFromInputProps> = ({
	addReportToNewDashboard,
	setAddReportToNewDashboard,
	showDashboardInput,
	setShowDashboardInput,
	newDashboardName,
	setNewDashboardName,
}) => {
	const translator = useTranslator();

	const handleViewSwitch = () => {
		setNewDashboardName('');
		setShowDashboardInput(!showDashboardInput);
	};

	const handleDashboardCreationCanceled = () => {
		handleViewSwitch();
		trackDashboardCreationCanceled(DashboardActionSource.NEW_REPORT);
	};

	return showDashboardInput ? (
		<div className={styles.inputsGroup}>
			<Checkbox
				checked={addReportToNewDashboard}
				onChange={(e) => setAddReportToNewDashboard(e.target.checked)}
			/>
			<Input
				placeholder={translator.gettext('Dashboard name')}
				className={styles.input}
				maxLength={NAME_MAX_LENGTH}
				value={newDashboardName}
				onChange={(e) => setNewDashboardName(e.target.value)}
				allowClear
				autoFocus
			/>
			<Button
				type="button"
				color="ghost"
				onClick={handleDashboardCreationCanceled}
			>
				<Icon icon="trash" size="s" />
			</Button>
		</div>
	) : (
		<Button
			type="button"
			color="ghost"
			className={styles.buttonLink}
			onClick={handleViewSwitch}
		>
			<Icon
				icon="plus"
				size="s"
				color="blue"
				className={styles.buttonIcon}
			/>
			{translator.gettext('New dashboard')}
		</Button>
	);
};

export default NewDashboardFromInput;
