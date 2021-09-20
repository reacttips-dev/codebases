import React, { useEffect, useState } from 'react';
import Actions from 'actions';
import AuthenticationService from 'services/authentication-service';
import UserService from 'services/user-service';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';

const EnterpriseContext = React.createContext({ isEnterprise: false });

const EnterpriseProvider = ({ children, createErrorAlert }) => {
  const [isEnterprise, setIsEnterprise] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (AuthenticationService.isAuthenticated()) {
        try {
          const user = await UserService.fetchLayout();
          const isEnterprise = _.get(user, 'has_enterprise_enrollments', false);
          setIsEnterprise(isEnterprise);
        } catch (err) {
          const message = _.get(
            err,
            'message',
            __('An error occurred while fetching your user information.')
          );
          await createErrorAlert(message);
        }
      }
    };

    fetchData();
  }, [createErrorAlert, isEnterprise]);

  const providerValue = {
    isEnterprise,
  };

  return (
    <EnterpriseContext.Provider value={providerValue}>
      {children}
    </EnterpriseContext.Provider>
  );
};
EnterpriseProvider.displayName = 'components/common/enterprise-provider';

const EnterpriseConsumer = EnterpriseContext.Consumer;
EnterpriseConsumer.displayName = 'components/common/enterprise-consumer';

const EnterpriseProviderRedux = connect(null, {
  createErrorAlert: Actions.createErrorAlert,
})(EnterpriseProvider);

export { EnterpriseProviderRedux, EnterpriseProvider, EnterpriseConsumer };
