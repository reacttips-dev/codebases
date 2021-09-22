import React from 'react';

import { SvgButton, Divider, DropDown, color } from '@coursera/coursera-ui';
import {
  SvgTableAddRow,
  SvgTableAddColumn,
  SvgTableRemoveRow,
  SvgTableRemoveColumn,
  SvgMoreHorizontalFilled,
} from '@coursera/coursera-ui/svg';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';
import _t from 'i18n!nls/authoring';
import { addRow, deleteRow, addColumn, deleteColumn, toggleHeader, deleteTable } from '../plugins/Table/utils';
import { SlateChange, SlateRenderNodeProps } from '../types';

import 'css!./__styles__/Table';

const MENU_ACTIONS = {
  ADD_ROW: 'add_row',
  ADD_COLUMN: 'add_column',
  REMOVE_ROW: 'remove_row',
  REMOVE_COLUMN: 'remove_column',
  TOGGLE_HEADER: 'toggle_header',
  REMOVE_TABLE: 'remove_table',
};

export type TableProps = SlateRenderNodeProps & {
  children: React.ReactElement[];
};

const renderKebab = () => {
  return ({ getDropDownButtonProps }: { getDropDownButtonProps: () => {} }) => {
    return (
      <TooltipWrapper message={_t('More options')} placement="top">
        <SvgButton
          {...getDropDownButtonProps()}
          rootClassName="rc-MenuButton table-menu-button"
          type="icon"
          size="zero"
          svgElement={<SvgMoreHorizontalFilled size={18} color="#222" hoverColor={color.primary} suppressTitle />}
        />
      </TooltipWrapper>
    );
  };
};

const TableMenu = (props: TableProps) => {
  const { editor, node } = props;
  const headless = node.data.get('headless');

  const handleClick = (e: Event, val: string) => {
    switch (val) {
      case MENU_ACTIONS.REMOVE_TABLE:
        editor.change((c: SlateChange) => deleteTable(c));
        break;
      case MENU_ACTIONS.TOGGLE_HEADER:
        editor.change((c: SlateChange) => toggleHeader(c));
        break;
      default:
        return null;
    }
  };

  return (
    <tfoot className="slate-table-menu" aria-hidden="true">
      <tr>
        <td>
          <TooltipWrapper message={_t('Add row')} placement="top">
            <SvgButton
              rootClassName="table-menu-button"
              type="icon"
              size="zero"
              svgElement={<SvgTableAddRow size={18} color="#222" hoverColor={color.primary} suppressTitle />}
              onClick={() => {
                editor.change((c: SlateChange) => addRow(c));
              }}
            />
          </TooltipWrapper>
        </td>
        <td>
          <TooltipWrapper message={_t('Add column')} placement="top">
            <SvgButton
              rootClassName="table-menu-button"
              type="icon"
              size="zero"
              svgElement={<SvgTableAddColumn size={18} color="#222" hoverColor={color.primary} suppressTitle />}
              onClick={() => {
                editor.change((c: SlateChange) => addColumn(c));
              }}
            />
          </TooltipWrapper>
        </td>
        <td>
          <TooltipWrapper message={_t('Remove row')} placement="top">
            <SvgButton
              rootClassName="table-menu-button"
              type="icon"
              size="zero"
              svgElement={<SvgTableRemoveRow size={18} color="#222" hoverColor={color.primary} suppressTitle />}
              onClick={() => {
                editor.change((c: SlateChange) => deleteRow(c));
              }}
            />
          </TooltipWrapper>
        </td>
        <td>
          <TooltipWrapper message={_t('Remove column')} placement="top">
            <SvgButton
              rootClassName="table-menu-button"
              type="icon"
              size="zero"
              svgElement={<SvgTableRemoveColumn size={18} color="#222" hoverColor={color.primary} suppressTitle />}
              onClick={() => {
                editor.change((c: SlateChange) => deleteColumn(c));
              }}
            />
          </TooltipWrapper>
        </td>
        <td>
          <TooltipWrapper message={_t('More options')} placement="top">
            <DropDown.ButtonMenu
              renderButton={renderKebab()}
              menuHtmlAttributes={{
                className: 'rc-TableMenu d-inline-block',
              }}
              dropDownPosition={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <DropDown.Item
                label={headless ? _t('Add header') : _t('Remove header')}
                value={MENU_ACTIONS.TOGGLE_HEADER}
                onClick={handleClick}
              />
              <DropDown.Item label={_t('Remove table')} value={MENU_ACTIONS.REMOVE_TABLE} onClick={handleClick} />
              <Divider />
              <DropDown.Item label={_t('Close')} value={0} onClick={handleClick} />
            </DropDown.ButtonMenu>
          </TooltipWrapper>
        </td>
      </tr>
    </tfoot>
  );
};

/*
 * split rows into thead tbody contents,
 * unless "headless" option is set
 */
const splitHeader = (props: TableProps) => {
  const rows = props.children;
  const headless = props.node.get('data').get('headless');

  if (headless || !rows || !rows.length || rows.length === 1) {
    return { header: null, rows };
  }
  return {
    header: rows[0],
    rows: rows.slice(1),
  };
};

// renderer for 'table' type nodes
const Table = (props: TableProps) => {
  const { header, rows } = splitHeader(props);
  const { isSelected } = props;
  return (
    <div className="slate-table" {...props.attributes}>
      <table>
        {header && <thead>{header}</thead>}
        <tbody>{rows}</tbody>
        {isSelected && <TableMenu {...props} />}
      </table>
    </div>
  );
};

export default Table;
