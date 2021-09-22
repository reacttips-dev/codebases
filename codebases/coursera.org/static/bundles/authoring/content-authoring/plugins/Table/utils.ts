// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EditTable from 'slate-edit-table';
import { BLOCK_TYPES } from '../../constants';
import { SlateChange, SlateValue, SlateNode, SlateBlock } from '../../types';

const plugin = EditTable({
  typeTable: BLOCK_TYPES.TABLE,
  typeRow: BLOCK_TYPES.TABLE_ROW,
  typeCell: BLOCK_TYPES.TABLE_CELL,
  typeContent: BLOCK_TYPES.PARAGRAPH,
});
const { insertTable, removeTable, insertRow, insertColumn, removeRow, removeColumn, moveSelection } = plugin.changes;
const { isSelectionInTable } = plugin.utils;

const insertPlaceholderContent = (change: SlateChange, numCols: number): SlateChange => {
  // add placeholder text for each column header
  for (let i = 0; i < numCols; i++) {
    moveSelection(change, i, 0).insertText('header');
  }

  // set focus on the first header column
  return moveSelection(change, 0, 0).focus();
};

// finds the parent `BLOCK_TYPES.TABLE` node given a Slate `value` object
const findParentTable = (value: SlateValue): SlateNode | null => {
  if (!value) {
    return null;
  }

  let tableNode: SlateNode | null = null;

  value.blocks.forEach((block) => {
    value.document.getClosest(block.key, (parent) => {
      if (parent && (parent as SlateBlock).type === BLOCK_TYPES.TABLE) {
        tableNode = parent;
      }
      return false;
    });
  });

  return tableNode;
};

const hasTable = (value?: SlateValue): boolean => (value ? isSelectionInTable(value) : false);
const addRow = (change: SlateChange): boolean => insertRow(change);
const addColumn = (change: SlateChange): boolean => insertColumn(change);
const deleteRow = (change: SlateChange): boolean => removeRow(change);
const deleteColumn = (change: SlateChange): boolean => removeColumn(change);

// finds the parent table node and flips the `headless` attribute
const toggleHeader = (change: SlateChange): SlateChange => {
  const { value } = change;

  const tableNode = findParentTable(value);

  if (!tableNode) {
    return change;
  }

  // @ts-expect-error we need to ugrade Slate to a newer version to fix this
  const isHeadless = !!tableNode.get('data').get('headless');

  // flip `headless`
  return change.setNodeByKey(tableNode.key, {
    data: {
      headless: !isHeadless,
    },
    type: (tableNode as SlateBlock).type,
  });
};

const deleteTable = (change: SlateChange): SlateChange => {
  /* eslint-disable-next-line no-alert */
  if (window.confirm('Are you sure you want to remove this table?')) {
    return removeTable(change);
  }

  return change;
};

const tableStrategy = (change: SlateChange, numRows = 3, numCols = 3): SlateChange => {
  // create new table with placeholder content
  return insertTable(
    change
      .insertBlock(BLOCK_TYPES.PARAGRAPH) // new line block after the table
      .moveToStartOfPreviousBlock(), // move back to insert table
    numRows,
    numCols
  ).call(insertPlaceholderContent, numCols);
};

const exported = {
  hasTable,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  toggleHeader,
  deleteTable,
  tableStrategy,
  isSelectionInTable,
};

export {
  hasTable,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  toggleHeader,
  deleteTable,
  tableStrategy,
  isSelectionInTable,
  findParentTable,
};
export default exported;
