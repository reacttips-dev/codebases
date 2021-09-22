import { getFFContextData } from '@pipedrive/form-fields';
import { Snackbar } from '@pipedrive/convention-ui-react';
import Logger from '@pipedrive/logger-fe';
import getTranslator from '@pipedrive/translator-client/fe';
import React, { useEffect, useRef, useState } from 'react';

import { ActionType, EntityType, ResponseType } from './types';
import { getMessage, poll, stop } from './utils/progressHelpers';
import {
	setMetricsInstance,
	trackBulkActionCompletedSnackbarShown,
	trackBulkActionCompletedModalOpened,
	trackBulkActionStopped,
} from './utils/bulkMetrics';
import { CompletedDialog } from './components/CompletedDialog';

export interface BulkProgressbarProps {
	persistent?: boolean;
	entityType?: EntityType;
	action?: ActionType;
	success?: boolean;
	onDone?: () => void;
	apiData: ResponseType;
}
interface AdditionalProps {
	actionText?: string;
	duration?: 'long' | 'no-timeout';
	onClick?: () => void;
}

const POLL_INTERVAL = 2000;

export default async function (componentLoader) {
	const [user, ffContextData] = await Promise.all([
		componentLoader.load('webapp:user'),
		getFFContextData(componentLoader),
	]);
	const translator = await getTranslator('froot', user.getLanguage());
	const logger = new Logger('froot', 'Progressbar');

	componentLoader.load('webapp:metrics').then((metrics) => {
		setMetricsInstance(metrics);
	});

	function BulkProgressbar({
		persistent = false,
		entityType = 'activity',
		action = 'edit',
		success = true,
		apiData = {},
		onDone,
	}: BulkProgressbarProps) {
		const {
			action_id,
			action_url,
			succeeded_count = 0,
			failed_count,
			canceled_count,
			total_count = 0,
			status = 'executing',
		} = apiData;
		const [showCompletedDialog, setShowCompletedDialog] = useState(false);
		const intervalRef = useRef(null);
		const timeoutRef = useRef(null);

		const [data, setData] = useState({
			action_url,
			action_id,
			failed_count,
			succeeded_count,
			canceled_count,
			total_count,
			status,
		});

		const isCompleted = data.status === 'completed';
		const isInProgress = !isCompleted && success;
		const progress = `(${data.succeeded_count}/${total_count || data.total_count})`;
		const message = getMessage(translator, {
			action,
			entityType,
			success,
			progress,
			isCompleted,
			failedCount: data.failed_count,
			succeededCount: data.succeeded_count,
		});

		const onDismiss = () => {
			if (!showCompletedDialog) {
				onDone?.();
			}
		};
		const stopPolling = () => {
			clearInterval(intervalRef.current);
			clearTimeout(timeoutRef.current);
		};
		const onClick = () => {
			setShowCompletedDialog(true);
			trackBulkActionCompletedModalOpened(entityType, action, data);
		};
		const onStop = () => {
			setShowCompletedDialog(true);
			stop(data.action_id, data.action_url, setData, logger, stopPolling);
			trackBulkActionStopped(entityType, action, data);
		};
		const getAdditionalProps = (): AdditionalProps => {
			if (isCompleted) {
				return {
					actionText: translator.gettext('View details'),
					duration: 'long',
					onClick,
				};
			}

			return {
				actionText: translator.gettext('Stop'),
				duration: 'no-timeout',
				onClick: onStop,
			};
		};

		useEffect(() => {
			if (isInProgress || persistent) {
				const pollId = setInterval(() => {
					poll(data.action_url, setData, logger, stopPolling);
				}, POLL_INTERVAL);

				intervalRef.current = pollId;
			}

			return () => stopPolling();
		}, []);

		/* Wait for response in case of persistent snackbar */
		if (persistent && !data.action_id) {
			return <></>;
		}

		if (!isInProgress && intervalRef.current) {
			stopPolling();
			trackBulkActionCompletedSnackbarShown(entityType, action, data);

			const id = setTimeout(onDismiss, 16000);

			timeoutRef.current = id;
		}

		return (
			<>
				<Snackbar
					data-id="bulk-action-snackbar"
					key={data.action_id}
					message={message}
					onDismiss={onDismiss}
					showSpinner={isInProgress}
					closeText={translator.gettext('Close')}
					{...getAdditionalProps()}
				/>
				{showCompletedDialog && (
					<CompletedDialog
						showCompletedDialog={showCompletedDialog}
						translator={translator}
						succeededCount={data.succeeded_count}
						failedCount={data.failed_count}
						canceledCount={data.canceled_count}
						ffContextData={ffContextData}
						onDone={onDone}
						status={data.status}
					/>
				)}
			</>
		);
	}

	return BulkProgressbar;
}
