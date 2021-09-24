import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {withApollo, compose} from 'react-apollo';
import ListCard from '../list-card';
import {ACTION_PREPEND} from '../../cards/data-list';
import {ListContainer} from '../../cards/card';
import {toolPros, toolCons} from '../../../../data/shared/queries';
import {createReason} from '../../../../data/shared/mutations';
import TextInput from '../../inputs/text';
import SimpleButton from '../../buttons/base/simple';
import {TABLET, PHONE, WIDE} from '../../../style/breakpoints';
import glamorous from 'glamorous';
import {CurrentUserContext} from '../../../enhancers/current-user-enhancer';
import {NavigationContext} from '../../../enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../../../shared/constants/paths';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import Row from './row';

export const PROS = 'pros';
export const CONS = 'cons';
export const FULL = 'full';
export const SLIM = 'slim';
export const PROSCACHE = 'cachedPros';
export const CONSCACHE = 'cachedCons';

const INPUT_HEIGHT = 45;
const SLIM_HEIGHT = 35;

const Actions = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'row',
    [TABLET]: {
      flexDirection: 'column'
    },
    marginTop: 25,
    ' > div': {
      ' > input': {
        [TABLET]: {
          width: 'auto'
        },
        [PHONE]: {
          width: '100%',
          boxSizing: 'border-box'
        }
      }
    },
    ' > button ': {
      marginTop: 0,
      [TABLET]: {
        marginLeft: 0,
        marginTop: 10
      }
    }
  },
  ({theme}) => ({
    marginBottom: theme === FULL ? '25px' : '0',
    ' > div': {
      height: theme === SLIM ? SLIM_HEIGHT : INPUT_HEIGHT,
      ' > input': {
        height: theme === SLIM ? SLIM_HEIGHT : INPUT_HEIGHT,
        fontSize: theme === SLIM ? 12 : 14,
        ':-moz-placeholder': {
          /* Firefox 18- */
          lineHeight: theme === SLIM ? 'normal' : `${INPUT_HEIGHT}px`
        },
        '::-moz-placeholder': {
          /* Firefox 19+ */
          lineHeight: theme === SLIM ? 'normal' : `${INPUT_HEIGHT}px`
        },
        lineHeight: theme === SLIM ? 'normal' : `${INPUT_HEIGHT}px`
      },
      [WIDE]: {
        width: theme === SLIM ? 220 : 'auto'
      }
    },
    ' > button ': {
      marginLeft: theme === SLIM ? 'auto' : 12,
      height: theme === SLIM ? SLIM_HEIGHT : INPUT_HEIGHT
    }
  })
);

const DirectionConatiner = glamorous.div({}, ({theme}) => ({
  display: theme === FULL ? 'flex' : 'block',
  flexDirection: theme === FULL ? 'column-reverse' : 'none'
}));

const handleSubmit = (
  client,
  slug,
  type,
  newReason,
  setNewReason,
  setNewItem,
  sendAnalyticsEvent
) => {
  client
    .mutate({
      mutation: createReason,
      variables: {slug, text: newReason, con: type === CONS}
    })
    .then(({data}) => {
      setNewItem({
        action: ACTION_PREPEND,
        data: {...data.createReason, text: newReason, upvoted: true, upvotesCount: 1}
      });
      setNewReason('');
      sendAnalyticsEvent('reason.create', {con: type === CONS, service: slug, text: newReason});
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {});
};

const ProsConsCard = ({
  client,
  slug,
  items,
  type,
  theme,
  title,
  hasMultipleColumns,
  sendAnalyticsEvent,
  disableScroll,
  limitItems,
  privateMode
}) => {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useContext(NavigationContext);
  const [newReason, setNewReason] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const toggleReasonAnalyticsData = {con: type === CONS, service: slug};

  return (
    <ListContainer>
      <DirectionConatiner theme={theme}>
        <ListCard
          limitItems={limitItems}
          disableScroll={disableScroll}
          title={title}
          itemsData={items}
          variables={{slug}}
          query={type === PROS ? toolPros : toolCons}
          normalizeData={data => data.tool[type]}
          Row={Row}
          theme={theme}
          newItem={newItem}
          placeholder={
            privateMode
              ? `No ${type === PROS ? 'pros' : 'cons'} available`
              : `Be the first to leave a ${type === PROS ? 'pro' : 'con'}`
          }
          hasMultipleColumns={hasMultipleColumns}
          analyticsPayload={toggleReasonAnalyticsData}
        />
        {!privateMode && currentUser && (
          <Actions theme={theme}>
            <TextInput
              tabIndex="0"
              maxLength={55}
              value={newReason ? newReason : ''}
              onKeyDown={e => {
                if (e.keyCode === 13 && newReason && newReason.length > 0) {
                  handleSubmit(client, slug, type, newReason, setNewReason, setNewItem);
                }
              }}
              onChange={e => {
                const {value} = e.target;
                setNewReason(value);
              }}
              id={`addA${type === PROS ? 'Pro' : 'Con'}`}
              placeholder={`Add a ${type === PROS ? 'pro' : 'con'}`}
            />
            <SimpleButton
              disabled={!newReason || newReason.length === 0}
              onClick={() => {
                if (currentUser === null) {
                  navigate(SIGN_IN_PATH);
                } else {
                  handleSubmit(
                    client,
                    slug,
                    type,
                    newReason,
                    setNewReason,
                    setNewItem,
                    sendAnalyticsEvent
                  );
                }
              }}
            >
              Submit
            </SimpleButton>
          </Actions>
        )}
      </DirectionConatiner>
    </ListContainer>
  );
};

ProsConsCard.propTypes = {
  client: PropTypes.any,
  slug: PropTypes.string,
  items: PropTypes.object,
  limitItems: PropTypes.number,
  theme: PropTypes.string,
  type: PropTypes.oneOf([PROS, CONS]),
  title: PropTypes.string,
  hasMultipleColumns: PropTypes.bool,
  sendAnalyticsEvent: PropTypes.func,
  disableScroll: PropTypes.bool,
  privateMode: PropTypes.bool
};

export default compose(
  withApollo,
  withSendAnalyticsEvent
)(ProsConsCard);
