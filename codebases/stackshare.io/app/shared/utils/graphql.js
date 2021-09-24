import PropTypes from 'prop-types';

export function flattenEdges(data, value = null) {
  if (data) {
    return data.edges.map(e => e.node);
  }
  return value;
}

export const ID = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
