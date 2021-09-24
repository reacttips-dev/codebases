import React from 'react';
import PropTypes from 'prop-types';
import DataList from '../data-list';
import ServiceTile, {SMALL} from '../../tiles/service';
import {BASE_TEXT} from '../../../style/typography';
import glamorous from 'glamorous';
import {flattenEdges} from '../../../utils/graphql';
import {FULL, SLIM} from '../pros-cons';
import {BLACK} from '../../../style/colors';

const Container = glamorous.div();

export const RowContainer = glamorous.a({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 15,
  flexShrink: 0
});

export const RowLabel = glamorous.span({
  ...BASE_TEXT,
  marginLeft: 10,
  textDecoration: 'none',
  color: BLACK
});

const DefaultRow = ({item: {name, imageUrl, thumbUrl, path}}) => {
  const image = thumbUrl ? thumbUrl : imageUrl;
  return (
    <RowContainer href={path}>
      <ServiceTile size={SMALL} imageUrl={image} useAnchor={false} name={name} />
      <RowLabel>{name}</RowLabel>
    </RowContainer>
  );
};

DefaultRow.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    thumbUrl: PropTypes.string,
    path: PropTypes.string
  })
};

const onLoadMore = normalizeData => (data, items, setItems, setHasNextPage, setEndCursor) => {
  const itemData = normalizeData(data);
  const {pageInfo} = itemData;
  setItems([...items, ...flattenEdges(itemData)]);
  setHasNextPage(pageInfo.hasNextPage);
  setEndCursor(pageInfo.endCursor);
};

const SCROLL_OFFSET = 150;

const ListCard = ({
  newItem,
  itemsData,
  query,
  variables,
  Row = DefaultRow,
  normalizeData,
  theme,
  placeholder,
  title,
  hasMultipleColumns,
  analyticsPayload,
  disableScroll,
  limitItems = false
}) => {
  return (
    <Container>
      <DataList
        disableScroll={disableScroll}
        analyticsPayload={analyticsPayload}
        height={theme === FULL ? 'auto' : theme === SLIM ? 160 : 270}
        scrollOffset={SCROLL_OFFSET}
        itemsData={itemsData}
        query={query}
        variables={variables}
        Row={Row}
        onLoadMore={onLoadMore(normalizeData)}
        newItem={newItem}
        theme={theme}
        placeholder={placeholder}
        title={title}
        hasMultipleColumns={hasMultipleColumns}
        limitItems={limitItems}
      />
    </Container>
  );
};

ListCard.propTypes = {
  itemsData: PropTypes.object,
  newItem: PropTypes.object,
  query: PropTypes.any,
  variables: PropTypes.object,
  Row: PropTypes.any,
  normalizeData: PropTypes.func,
  theme: PropTypes.string,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  hasMultipleColumns: PropTypes.bool,
  analyticsPayload: PropTypes.object,
  disableScroll: PropTypes.bool,
  limitItems: PropTypes.any
};

export default ListCard;
