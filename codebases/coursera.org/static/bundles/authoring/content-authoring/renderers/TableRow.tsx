import React from 'react';
import { SlateRenderNodeProps } from '../types';

type Props = SlateRenderNodeProps & {};

// renderer for 'table-row' type nodes
const TableRow: React.FunctionComponent<Props> = ({ attributes, children }) => {
  return <tr {...attributes}>{children}</tr>;
};

export default TableRow;
