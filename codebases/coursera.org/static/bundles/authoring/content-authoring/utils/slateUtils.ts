import { Map } from 'immutable';
import { SlateBlock, SlateInline } from '../types';

// returns pure-JS attributes for a given slate node
export const getAttributes = (node: SlateBlock | SlateInline) =>
  Map.isMap(node.data.get('attributes')) ? node.data.get('attributes').toJS() : node.data.get('attributes');
