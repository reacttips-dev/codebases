'use es6';

import once from 'transmute/once';
import { DragDropContext } from 'react-dnd';
import ReactDnDHTML5Backend from 'react-dnd-html5-backend';
export default once(function () {
  return DragDropContext(ReactDnDHTML5Backend);
});