export const onDataCallback = (selectRows, initialSelectedRows, setTableData) => (data) => {
    const { Data: tableData } = data;
    selectRows(tableData.slice(0, initialSelectedRows));
    setTableData(data);
};
