import React, {useState, useRef, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withApollo, compose} from 'react-apollo';
import useInfiniteScroll from '../../../utils/hooks/infinite-scroll';
import {flattenEdges} from '../../../../shared/utils/graphql';
import ScrollPanel from '../../../../shared/library/panels/scroll';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {CONCRETE} from '../../../../shared/style/colors';
import glamorous from 'glamorous';
import {withAnalyticsPayload} from '../../../enhancers/analytics-enhancer';

export const ACTION_PREPEND = 'prepend';
export const ACTION_APPEND = 'append';

const Placeholder = glamorous.div({
  ...BASE_TEXT,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontsize: 14,
  color: CONCRETE,
  fontStyle: 'italic',
  textAlign: 'center'
});

const Title = glamorous.h2();

const List = glamorous.ul({
  margin: 0,
  padding: 0
});

const ListItem = glamorous.li({
  listStyle: 'none'
});

const DataList = ({
  height = '100%',
  newItem = null,
  scrollOffset = 0,
  useLoadingMessage = false,
  itemsData,
  variables,
  Row,
  client,
  query,
  onLoadMore,
  theme,
  placeholder,
  title,
  hasMultipleColumns,
  analyticsPayload,
  disableScroll,
  limitItems
}) => {
  useEffect(() => {
    if (newItem) {
      let newItems;
      const {action, data} = newItem;
      if (action === ACTION_PREPEND) {
        newItems = [data, ...items];
      } else if (action === ACTION_APPEND) {
        newItems = [...items, data];
      } else {
        newItems = items;
      }
      setItems(newItems);
    }
  }, [newItem]);
  const el = useRef(null);
  const {pageInfo} = itemsData;
  const defaultItems = flattenEdges(itemsData);
  const [hasNextPage, setHasNextPage] = useState((pageInfo && pageInfo.hasNextPage) || false);
  const [endCursor, setEndCursor] = useState((pageInfo && pageInfo.endCursor) || '');
  const [items, setItems] = useState(defaultItems);
  const [isLoading, setIsLoading] = useInfiniteScroll(
    () => {
      if (hasNextPage && !disableScroll && items.length <= limitItems) {
        client
          .query({
            query,
            variables: {...variables, after: endCursor}
          })
          .then(({data}) => {
            onLoadMore(data, items, setItems, setHasNextPage, setEndCursor);
            setIsLoading(false);
          });
      }
    },
    el,
    scrollOffset
  );
  return (
    <ScrollPanel
      items={items}
      height={height}
      theme={theme}
      innerRef={el}
      disableScroll={disableScroll}
    >
      {!hasMultipleColumns && <Title hidden>{title}</Title>}
      {hasMultipleColumns ? (
        <Fragment>
          {items.map((item, index) => (
            <Row
              key={item.id ? item.id : index}
              client={client}
              item={item}
              analyticsPayload={analyticsPayload}
              isPrivate={item.private}
            />
          ))}
        </Fragment>
      ) : (
        <List>
          {items.map((item, index) => (
            <ListItem key={item.id ? item.id : index}>
              <Row
                client={client}
                item={item}
                itemsData={itemsData}
                analyticsPayload={analyticsPayload}
                isPrivate={item.private}
              />
            </ListItem>
          ))}
        </List>
      )}
      {items.length === 0 && placeholder && <Placeholder>{placeholder}</Placeholder>}
      {isLoading && useLoadingMessage && <div>Loading...</div>}
    </ScrollPanel>
  );
};

DataList.propTypes = {
  itemsData: PropTypes.object,
  newItem: PropTypes.object,
  variables: PropTypes.object,
  Row: PropTypes.any,
  client: PropTypes.any,
  query: PropTypes.object,
  onLoadMore: PropTypes.func,
  height: PropTypes.any,
  scrollOffset: PropTypes.number,
  useLoadingMessage: PropTypes.bool,
  theme: PropTypes.string,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  hasMultipleColumns: PropTypes.bool,
  analyticsPayload: PropTypes.object,
  disableScroll: PropTypes.bool,
  limitItems: PropTypes.any
};

export default compose(
  withApollo,
  withAnalyticsPayload()
)(DataList);
