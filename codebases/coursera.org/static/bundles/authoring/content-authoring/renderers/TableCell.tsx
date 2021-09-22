import React from 'react';
import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'table-cell' type nodes
const TableCell: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <td {...attributes}>{children}</td>;
};

export default TableCell;
