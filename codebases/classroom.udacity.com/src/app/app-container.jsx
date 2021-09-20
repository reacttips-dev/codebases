import AuthenticationService from 'services/authentication-service';
import { EnterpriseProviderRedux } from 'components/common/enterprise-context';
import { ExternalServiceProvider } from 'components/common/external-service-context';
import Layout from 'components/common/layout';
import { Provider as LayoutProvider } from '@udacity/ureact-app-layout';
import NotificationSubscriptionContainer from 'components/notification-subscription-container';
import { OptimizelyProvider } from '@udacity/ureact-experiments';
import { Provider } from 'react-redux';
import Routes from 'routes';
import WindowManager from 'components/window-manager-container';
import { i18n } from 'services/localization-service';
import store from 'store';

export default class AppContainer extends React.Component {
  state = {
    locale: null,
    loading: true,
  };

  componentDidMount() {
    i18n
      .activate()
      .then((locale) => {
        this.setState({
          locale,
          loading: false,
        });
      })
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { locale, loading } = this.state;
    const userId = AuthenticationService.getCurrentUserId();
    const optimizelyUser = userId ? { id: userId } : undefined;

    return (
      <Provider store={store}>
        <ExternalServiceProvider>
          <EnterpriseProviderRedux>
            <OptimizelyProvider
              user={optimizelyUser}
              projectId={CONFIG.optimizelyProjectId}
            >
              <LayoutProvider>
                <WindowManager>
                  {loading ? (
                    <Layout navVariant="none" busy={true} />
                  ) : locale ? (
                    <NotificationSubscriptionContainer>
                      <Routes />
                    </NotificationSubscriptionContainer>
                  ) : null}
                </WindowManager>
              </LayoutProvider>
            </OptimizelyProvider>
          </EnterpriseProviderRedux>
        </ExternalServiceProvider>
      </Provider>
    );
  }
}
