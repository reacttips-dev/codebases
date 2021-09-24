import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {withApollo, compose} from 'react-apollo';
import {RowLabel} from '../list-card';
import {toggleUpvote} from '../../../../data/shared/mutations';
import LikeButton, {UPVOTE} from '../../buttons/like/button';
import glamorous from 'glamorous';
import {CurrentUserContext} from '../../../enhancers/current-user-enhancer';
import {NavigationContext} from '../../../enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../../../shared/constants/paths';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {PrivateModeContext} from '../../../enhancers/private-mode-enchancer';
import {BASE_TEXT} from '../../../style/typography';
import {BLACK} from '../../../style/colors';

export const PROS = 'pros';
export const CONS = 'cons';
export const FULL = 'full';

const RowContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 15,
  flexShrink: 0,
  cursor: 'default',
  ' > div:first-of-type': {
    width: 40,
    flexShrink: 0
  }
});

const RowLabelPrivateUser = glamorous.a({
  ...BASE_TEXT,
  marginLeft: 10,
  textDecoration: 'none',
  color: BLACK,
  ':hover': {
    color: 'black'
  }
});

const Row = ({client, item, sendAnalyticsEvent}) => {
  const currentUser = useContext(CurrentUserContext);
  const privateMode = useContext(PrivateModeContext);
  const navigate = useContext(NavigationContext);
  const [upvoted, setUpvoted] = useState(item.upvoted);
  const [upvotesCount, setUpvotesCount] = useState(item.upvotesCount);
  const analyticsData = {upvoted: !upvoted ? 1 : null};

  return (
    <RowContainer>
      <LikeButton
        count={upvotesCount}
        privateMode={privateMode}
        type={UPVOTE}
        liked={upvoted}
        onToggle={
          privateMode
            ? null
            : () => {
                if (currentUser === null) {
                  navigate(SIGN_IN_PATH);
                } else {
                  client
                    .mutate({
                      mutation: toggleUpvote,
                      variables: {id: item.id, type: 'Reason', upvote: !upvoted}
                    })
                    .then(() => {
                      setUpvoted(!upvoted);
                      setUpvotesCount(upvotesCount + (upvoted ? -1 : 1));
                      sendAnalyticsEvent('reasons.vote.toggle', analyticsData);
                    });
                }
              }
        }
      />
      {privateMode ? (
        <RowLabelPrivateUser>{item.text}</RowLabelPrivateUser>
      ) : (
        <RowLabel>{item.text}</RowLabel>
      )}
    </RowContainer>
  );
};

Row.propTypes = {
  item: PropTypes.shape({
    upvoted: PropTypes.bool,
    upvotesCount: PropTypes.number,
    text: PropTypes.string
  }),
  client: PropTypes.any,
  sendAnalyticsEvent: PropTypes.func
};

export default compose(
  withApollo,
  withSendAnalyticsEvent
)(Row);
