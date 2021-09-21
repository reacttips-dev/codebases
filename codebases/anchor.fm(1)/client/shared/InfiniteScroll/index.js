import React from 'react';
import PropTypes from 'prop-types';
import { Scrollable } from '../Scrollable/index.tsx';
import { Spinner } from '../Spinner';
import Box from '../Box/index.tsx';

const noop = () => null;

const InfiniteScroll = ({
  items,
  onScroll,
  renderInfiniteScrollContent,
  onRequestMore,
  className,
}) => (
  <Scrollable
    onScroll={onScroll}
    className={className}
    onScrollToBottom={() => {
      onRequestMore(items.length);
    }}
    renderScrollableContent={() => (
      <div>
        <div>{renderInfiniteScrollContent(items)}</div>
        <Box display="flex" width="100%" justifyContent="center" marginTop={10}>
          <Spinner size={30} color="#B3B3B4" />
        </Box>
      </div>
    )}
  />
);

InfiniteScroll.defaultProps = {
  items: [],
  onScroll: noop,
  onRequestMore: noop,
  className: '',
};

InfiniteScroll.propTypes = {
  items: PropTypes.array,
  onScroll: PropTypes.func,
  renderInfiniteScrollContent: PropTypes.func.isRequired,
  onRequestMore: PropTypes.func,
  className: PropTypes.string,
};

export default InfiniteScroll;
