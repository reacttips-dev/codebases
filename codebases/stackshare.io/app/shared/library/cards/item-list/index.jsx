import React, {Fragment} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {ASH, TARMAC, FOCUS_BLUE, CONCRETE, CHARCOAL, WHITE} from '../../../style/colors';
import LoadMoreButton from '../../buttons/load-more';
import {truncateText, truncateWordAfterTheseManyLetter} from '../../../utils/truncate-text';
import {PHONE, TABLET} from '../../../style/breakpoints';
import {BASE_TEXT} from '../../../style/typography';
import withErrorBoundary from '../../../enhancers/error-boundary';
import {TOP} from '../../../constants/placements';
import PopoverWithAnchor from '../../popovers/base-v2';

const IMG_SIZE_MOBILE = 60;
const IMG_SIZE_DESKTOP = 70;

const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 25
});

const NotFound = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '25px 0',
  color: CONCRETE,
  fontStyle: 'italic'
});

const Link = glamorous.a(
  {
    ...BASE_TEXT,
    textDecoration: 'none',
    listStyleType: 'none',
    color: TARMAC,
    '&:hover': {
      color: FOCUS_BLUE
    }
  },
  ({iconsWithDesc}) =>
    iconsWithDesc && {
      width: '45%',
      marginBottom: 25,
      [PHONE]: {
        width: '100%'
      }
    }
);

const LineItem = glamorous.li(
  {
    ...BASE_TEXT,
    listStyleType: 'none',
    color: TARMAC,
    '&:hover': {
      color: FOCUS_BLUE
    }
  },
  ({iconsWithDesc}) =>
    iconsWithDesc
      ? {
          display: 'flex'
        }
      : {
          maxWidth: IMG_SIZE_DESKTOP,
          [PHONE]: {
            maxWidth: IMG_SIZE_MOBILE
          }
        }
);

const ItemsContainer = glamorous.ul(({iconsWithDesc}) =>
  iconsWithDesc
    ? {
        padding: 0,
        maxWidth: 860,
        justifyContent: 'space-between',
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'center'
      }
    : {
        gridTemplateColumns: 'repeat(auto-fill, 70px)',
        padding: 0,
        [TABLET]: {
          gridTemplateColumns: 'repeat(auto-fill, 60px)'
        },
        justifyContent: 'space-between',
        gridGap: 20,
        display: 'grid',
        textAlign: 'center'
      }
);

const Content = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 18,
  justifyContent: 'center',
  textAlign: 'initial'
});

const Image = glamorous.img({
  width: IMG_SIZE_DESKTOP,
  height: IMG_SIZE_DESKTOP,
  [PHONE]: {
    width: IMG_SIZE_MOBILE,
    height: IMG_SIZE_MOBILE
  },
  border: `1px solid ${ASH}`,
  borderRadius: 4
});

const NameWithoutDesc = glamorous
  .div({
    wordBreak: 'break-word',
    fontSize: 11,
    height: 24,
    overflow: 'hidden',
    margin: '10px 0 0',
    [PHONE]: {
      marginTop: 0,
      height: 30,
      lineHeight: 1.4
    }
  })
  .withComponent('h3');

const Name = glamorous
  .div({
    fontSize: 12,
    margin: '5px 0',
    fontWeight: 600,
    letterSpacing: 0.17,
    color: CHARCOAL
  })
  .withComponent('h3');

const Desc = glamorous
  .div({
    fontSize: 11,
    overflow: 'hidden',
    margin: 0,
    lineHeight: 1.64,
    color: '#707070',
    '& > span': {
      display: 'none'
    }
  })
  .withComponent('p');

const ItemList = ({
  item,
  loading,
  loadMore,
  hasNextPage,
  notFoundItem = 'items',
  iconsWithDesc = false
}) => {
  return (
    <Fragment>
      {item === undefined || item.length === 0 ? (
        <NotFound>No {notFoundItem} found</NotFound>
      ) : (
        <Fragment>
          <ItemsContainer iconsWithDesc={iconsWithDesc}>
            {item.map(item => {
              const itemImage = item.thumbUrl ? item.thumbUrl : item.imageUrl;
              return iconsWithDesc ? (
                <LineItem iconsWithDesc={iconsWithDesc}>
                  <Image width={100} height={50} src={itemImage} alt={item.name} />
                  <Content>
                    <Name>{item.name}</Name>
                    {item.desc && (
                      <Desc>{truncateWordAfterTheseManyLetter(item.desc, 75, '...', true)}</Desc>
                    )}
                  </Content>
                </LineItem>
              ) : (
                <PopoverWithAnchor
                  customStyle={{backgroundColor: CHARCOAL, color: WHITE}}
                  arrowColor={CHARCOAL}
                  padding={10}
                  placement={TOP}
                  activateMode="hover"
                  key={item.id}
                  hidden={true}
                  anchor={
                    <Link href={item.slug} title={item.name} iconsWithDesc={iconsWithDesc}>
                      <LineItem iconsWithDesc={iconsWithDesc}>
                        <Image width={100} height={50} src={itemImage} alt={item.name} />
                        <NameWithoutDesc>{truncateText(item.name, 15, '...')}</NameWithoutDesc>
                      </LineItem>
                    </Link>
                  }
                >
                  {item.name}
                </PopoverWithAnchor>
              );
            })}
          </ItemsContainer>
          {hasNextPage && (
            <Center>
              <LoadMoreButton loading={loading} onClick={loadMore} />
            </Center>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

ItemList.propTypes = {
  item: PropTypes.array,
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
  hasNextPage: PropTypes.bool,
  notFoundItem: PropTypes.string,
  iconsWithDesc: PropTypes.bool
};

export default withErrorBoundary(true)(ItemList);
