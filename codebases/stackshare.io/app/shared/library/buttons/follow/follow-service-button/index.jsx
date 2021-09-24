import {updateService} from '../../../../../data/feed/mutations';
import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import FollowButton from '..';
import {withCurrentUser} from '../../../../enhancers/current-user-enhancer';
import {NavigationContext} from '../../../../enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../../../constants/paths';
import {onboardingChecklist} from '../../../../../data/feed/queries';
import {toolBySlug} from '../../../../../data/tool-profile/queries';

export const FollowServiceButton = ({serviceId, following, currentUser, onToggle}) => (
  <Mutation
    mutation={updateService}
    variables={{serviceId, following: !following}}
    optimisticResponse={{
      __typename: 'Mutation',
      updateService: {
        id: serviceId,
        __typename: 'Service',
        following: !following
      }
    }}
    refetchQueries={[{query: onboardingChecklist}, {query: toolBySlug, variables: {id: serviceId}}]}
  >
    {updateService => (
      <NavigationContext.Consumer>
        {navigate => (
          <FollowButton
            following={following}
            onToggle={() => {
              if (currentUser && !currentUser.loading) {
                updateService(serviceId, !following);
                onToggle && onToggle();
              } else {
                navigate(SIGN_IN_PATH);
              }
            }}
          />
        )}
      </NavigationContext.Consumer>
    )}
  </Mutation>
);

FollowServiceButton.propTypes = {
  currentUser: PropTypes.object,
  serviceId: PropTypes.any,
  following: PropTypes.bool,
  onToggle: PropTypes.func
};

export default withCurrentUser(FollowServiceButton);
