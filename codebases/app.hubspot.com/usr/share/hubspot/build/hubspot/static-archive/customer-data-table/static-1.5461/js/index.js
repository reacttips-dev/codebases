'use es6';

import CustomerDataTable from './tableComponents/CustomerDataTable';
import tableWithPersistentColumns from './HoCs/tableWithPersistentColumns';
import tableWithPropertyColumns from './HoCs/tableWithPropertyColumns';
import tableWithSelection from './HoCs/tableWithSelection';
export { CustomerDataTable, tableWithPersistentColumns, tableWithPropertyColumns, tableWithSelection };
export default CustomerDataTable;