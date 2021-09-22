import React, { useState } from 'react';

import { Button, Dialog, Spacing, Message, Text } from '@pipedrive/convention-ui-react';

import { get } from '../../../utils/localStorage';
import { useTranslations } from '../utils/useTranslations';
import { ConfirmEditTable } from './BulkEdit/ConfirmEditTable';
import Loading from '../../../components/Loading';

interface CompletedDialogProps {
	failedCount: number;
	ffContextData: any;
	showCompletedDialog?: boolean;
	succeededCount: number;
	canceledCount: number;
	translator?: any;
	onDone: () => void;
	status?: 'executing' | 'completed' | 'canceled';
}

interface DialogTitleAndText {
	title: string;
	text: string;
}

export function CompletedDialog({
	showCompletedDialog,
	ffContextData,
	translator,
	succeededCount,
	failedCount,
	canceledCount,
	onDone,
	status,
}: CompletedDialogProps) {
	const [dialogVisible, setDialogVisible] = useState(showCompletedDialog);
	const {
		completedLabelTextMap,
		completedMessageTextMap,
		completedSummaryTextMap,
		canceledSummaryTextMap,
		canceledLabelPreTextMap,
		canceledLabelTextMap,
	} = useTranslations({ translator });
	const data = get('bulk-action') || {};
	const { action = 'edit', entityType = 'activity', rows = {} } = data;

	function getDialogTitleAndText(): DialogTitleAndText {
		if (status === 'completed') {
			return {
				title: completedSummaryTextMap[action],
				text: completedLabelTextMap[action][entityType](succeededCount, '<strong>', '</strong>'),
			};
		} else if (status === 'canceled') {
			return {
				title: canceledSummaryTextMap[action],
				text: `${canceledLabelPreTextMap[action]} ${canceledLabelTextMap[action][entityType](
					canceledCount,
					succeededCount,
					'<strong>',
					'</strong>',
				).join(' ')}`,
			};
		}
		return { title: '', text: '' };
	}
	const { title, text } = getDialogTitleAndText();

	function onClose() {
		setDialogVisible(false);
		onDone();
	}

	let content;

	if (status === 'executing') {
		content = <Loading size="l" />;
	} else {
		content = (
			<>
				{!!failedCount && (
					<Spacing bottom="m">
						<Message visible color="yellow" icon="warning">
							{completedMessageTextMap[action][entityType](failedCount)}
						</Message>
					</Spacing>
				)}
				<Text>
					<p
						/* eslint-disable-next-line react/no-danger */
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				</Text>
				{action === 'edit' && (
					<ConfirmEditTable storedRows={rows} translator={translator} ffContextData={ffContextData} />
				)}
			</>
		);
	}

	return (
		<Dialog
			visible={dialogVisible}
			onClose={onClose}
			actions={<Button onClick={onClose}>{translator.gettext('Close')}</Button>}
			title={title}
		>
			{content}
		</Dialog>
	);
}
