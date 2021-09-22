import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { get as getWebappApi } from '../../api/webapp';
import Link from '../../atoms/Link';
import { numberFormatter } from '../../utils/numberFormatter';

interface UnformattedRowItemProps {
	dataSet: any[];
	rowId: number;
	itemId: string;
}

interface CellActionProps {
	reportType: insightsTypes.ReportType;
	tableDataSet: any[];
	rowId: string;
	rowValue: string;
	currentUserId: number;
	columnId: number | string;
}

interface CellActions {
	[key: string]: any;
}

interface ActionsBaseProps {
	rowId: number;
	rowValue: string;
}

interface IdActionProps extends ActionsBaseProps {
	reportType: insightsTypes.ReportType;
	tableDataSet: any[];
	currentUserId: number;
}

interface OrgActionProps extends ActionsBaseProps {
	tableDataSet: any[];
}

interface PersonActionProps extends ActionsBaseProps {
	tableDataSet: any[];
}

interface TitleActionProps extends ActionsBaseProps {}

interface DealIdActionProps extends ActionsBaseProps {
	tableDataSet: any[];
}

interface SubjectActionProps extends ActionsBaseProps {
	reportType: insightsTypes.ReportType;
	tableDataSet: any[];
	currentUserId: number;
}

const getEditActivityModal = (activityId: number) => {
	const WebappApi = getWebappApi();

	WebappApi.modals.open('webapp:modal', {
		modal: 'activity/edit',
		params: {
			activity: activityId,
		},
	});
};

const getUnformattedRowItemValue = ({
	dataSet,
	rowId,
	itemId,
}: UnformattedRowItemProps) => {
	const item = dataSet?.find((dataRow: any) => {
		return [rowId, rowId.toString()].includes(dataRow.id);
	});

	return item && item[itemId];
};

const renderIdLink = ({ rowValue }: IdActionProps) => {
	return <span>{rowValue}</span>;
};

const renderDealTitleLink = ({ rowId, rowValue }: TitleActionProps) => (
	<Link href={`/deal/${rowId}`} text={rowValue} />
);

const renderDealIdLink = ({
	rowId,
	rowValue,
	tableDataSet,
}: DealIdActionProps) => {
	const dealId = getUnformattedRowItemValue({
		dataSet: tableDataSet,
		rowId,
		itemId: 'dealId',
	});

	if (!dealId) {
		return rowValue;
	}

	return <Link href={`/deal/${dealId}`} text={rowValue} />;
};

const renderActivitySubjectLink = ({
	rowId,
	rowValue,
	tableDataSet,
	currentUserId,
	reportType,
}: SubjectActionProps) => {
	if (reportType === insightsTypes.ReportType.MAILS_STATS) {
		const activity = tableDataSet.find(
			(rowData: any) => rowData.id === rowId,
		);

		if (!activity) {
			return rowValue;
		}

		const { threadId, userId } = activity;
		const emailBelongsToCurrentUser = userId === currentUserId;
		const mailPath = '/mail/inbox';

		const mailHref =
			emailBelongsToCurrentUser && threadId
				? `${mailPath}/${threadId}`
				: mailPath;

		return <Link href={mailHref} text={rowValue} />;
	}

	return (
		<Link
			href="#0"
			text={rowValue}
			onClick={() => getEditActivityModal(rowId)}
		/>
	);
};

const renderOrganizationLink = ({
	tableDataSet,
	rowId,
	rowValue,
}: OrgActionProps) => {
	const orgId = getUnformattedRowItemValue({
		dataSet: tableDataSet,
		rowId,
		itemId: 'orgId',
	});

	if (!orgId) {
		return rowValue;
	}

	return <Link href={`/organization/${orgId}`} text={rowValue} />;
};

const renderContactPersonLink = ({
	tableDataSet,
	rowId,
	rowValue,
}: PersonActionProps) => {
	const personId = getUnformattedRowItemValue({
		dataSet: tableDataSet,
		rowId,
		itemId: 'personId',
	});

	if (!personId) {
		return rowValue;
	}

	return <Link href={`/person/${personId}`} text={rowValue} />;
};

const tableCellActions: CellActions = {
	id: ({
		reportType,
		currentUserId,
		tableDataSet,
		rowId,
		rowValue,
	}: IdActionProps) =>
		renderIdLink({
			reportType,
			currentUserId,
			tableDataSet,
			rowId,
			rowValue,
		}),
	title: ({ rowId, rowValue }: TitleActionProps) =>
		renderDealTitleLink({ rowId, rowValue }),
	dealId: ({ rowId, rowValue, tableDataSet }: DealIdActionProps) =>
		renderDealIdLink({ rowId, rowValue, tableDataSet }),
	subject: ({
		rowId,
		rowValue,
		reportType,
		currentUserId,
		tableDataSet,
	}: SubjectActionProps) =>
		renderActivitySubjectLink({
			rowId,
			rowValue,
			reportType,
			currentUserId,
			tableDataSet,
		}),
	orgId: ({ tableDataSet, rowId, rowValue }: OrgActionProps) =>
		renderOrganizationLink({
			tableDataSet,
			rowId,
			rowValue,
		}),
	personId: ({ tableDataSet, rowId, rowValue }: PersonActionProps) =>
		renderContactPersonLink({
			tableDataSet,
			rowId,
			rowValue,
		}),
};

export const getTableCellAction = ({
	reportType,
	currentUserId,
	tableDataSet,
	rowId,
	rowValue,
	columnId,
}: CellActionProps) => {
	const unformattedRowId = numberFormatter.unformat({
		value: rowId,
		isMonetary: false,
	});

	return tableCellActions[columnId]({
		reportType,
		currentUserId,
		tableDataSet,
		rowId: unformattedRowId,
		rowValue,
	});
};
