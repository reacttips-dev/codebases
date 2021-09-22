import { Table } from '@pipedrive/convention-ui-react';
import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { ApiContext } from '../../utils/ApiContext';
import { getFieldValue } from '../../utils/fields';

const TABLE_ROW_HEIGHT = 32;
const TABLE_MARGIN = 16;

const TableContainer = styled.div<{ tableHeight: number }>`
	height: ${(props) => `${props.tableHeight}px`};
	max-height: 90vh;
`;

interface Props {
	ffContextData?: any;
	fields?: [
		{
			key: string;
			name: string;
		},
	];
	setRows?: (obj) => void;
	formState?: object;
	storedRows?: [];
	translator?: any;
}

export function ConfirmEditTable(props: Props) {
	const { formState, fields, setRows, storedRows } = props;
	const contextData = useContext(ApiContext);
	const translator = contextData?.translator || props.translator;
	const ffContextData = contextData?.ffContextData || props.ffContextData;

	const columns = {
		label: { options: { style: { fontWeight: 600 } } },
		action: { content: translator.gettext('Action') },
		value: { content: translator.gettext('New value') },
	};
	const extraData = {
		fields,
		stages: ffContextData?.stages || [],
		locale: ffContextData?.locale || 'en',
	};
	const rows = useMemo(() => {
		if (!formState) {
			return storedRows;
		}

		const tableRows = [];

		Object.entries(formState).forEach(([key, value], id) => {
			tableRows.push({
				data: {
					id,
					label: fields.find((field) => field.key === key)?.name,
					value: value === null ? '' : getFieldValue(key, value, extraData),
					action: value === null ? translator.gettext('Clear') : translator.gettext('Edit'),
				},
			});
		});

		return tableRows;
	}, [formState]);

	const tableHeight = useMemo(() => (rows.length + 1) * TABLE_ROW_HEIGHT + TABLE_MARGIN, [rows, formState]);

	useEffect(() => setRows?.(rows), [rows]);

	return (
		<TableContainer tableHeight={tableHeight}>
			{rows.length && (
				<Table rows={rows} columns={columns} options={{ borderType: 'horizontal', selectable: false }} />
			)}
		</TableContainer>
	);
}
