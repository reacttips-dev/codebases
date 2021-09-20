import ReactIntersectionList from '@researchgate/react-intersection-list';
import { Spinner } from '@trello/nachos/spinner';
import React from 'react';

export type IterableType =
  | {
      length: number;
    }
  | {
      size: number;
    };

interface InfiniteListProps {
  itemCount: number;
  pageSize: number;
  awaitMore: boolean;
  renderEmpty?: (isEmpty: boolean) => JSX.Element;
  renderItem: (index: number, key: number) => JSX.Element;
  loadMore?: (nextSize: number, pageSize: number) => void;
  itemsRenderer?: (
    items: IterableType,
    ref: (instance: React.ReactInstance) => void,
  ) => JSX.Element;
  isLoading?: boolean;
  spinnerClassName?: string;
  threshold?: string;
  axis?: 'x' | 'y';
}

export class InfiniteList extends React.Component<InfiniteListProps> {
  loadMoreItems = (size: number, pageSize: number) => {
    const { itemCount, loadMore } = this.props;

    if (loadMore && size >= itemCount) {
      loadMore(size, pageSize);
    }

    return void 0;
  };

  render() {
    const {
      axis,
      renderEmpty,
      renderItem,
      itemCount,
      itemsRenderer,
      isLoading = false,
      awaitMore,
      pageSize,
      spinnerClassName,
      threshold,
    } = this.props;

    return (
      <>
        {renderEmpty && renderEmpty(itemCount === 0)}
        <ReactIntersectionList
          renderItem={renderItem}
          itemCount={itemCount}
          awaitMore={awaitMore}
          onIntersection={this.loadMoreItems}
          itemsRenderer={itemsRenderer}
          pageSize={pageSize}
          threshold={threshold}
          axis={axis}
        />
        {isLoading && <Spinner centered wrapperClassName={spinnerClassName} />}
      </>
    );
  }
}
