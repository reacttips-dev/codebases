export const getTableById = (reportId: string, tables: any[]) => {
	if (!reportId || !tables?.length) {
		return null;
	}

	return tables.find((table) => table.id === reportId);
};

export const getSortedIcon = (column: any) => {
	return column.isSortedDesc ? 'triangle-down' : 'triangle-up';
};
