import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import FollowButton from '..';
import {withCurrentUser} from '../../../../enhancers/current-user-enhancer';
import {NavigationContext} from '../../../../enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../../../constants/paths';
import gql from 'graphql-tag';

export const updateCompany = gql`
  mutation updateCompany($companyId: ID!, $following: Boolean!) {
    updateCompany(id: $companyId, following: $following) {
      id
      following
      followerCount
    }
  }
`;

export const FollowCompanyButton = ({companyId, following, currentUser, onToggle}) => {
  const navigate = useContext(NavigationContext);
  return (
    <Mutation mutation={updateCompany} variables={{companyId, following: !following}}>
      {updateCompany => (
        <FollowButton
          following={following}
          onToggle={async () => {
            if (currentUser && !currentUser.loading) {
              const resp = await updateCompany(companyId, !following);
              if (onToggle && resp && resp.data && resp.data.updateCompany) {
                onToggle(resp.data.updateCompany.followerCount);
              }
            } else {
              navigate(SIGN_IN_PATH);
            }
          }}
        />
      )}
    </Mutation>
  );
};

FollowCompanyButton.propTypes = {
  currentUser: PropTypes.object,
  companyId: PropTypes.any,
  following: PropTypes.bool,
  onToggle: PropTypes.func
};

export default withCurrentUser(FollowCompanyButton);
