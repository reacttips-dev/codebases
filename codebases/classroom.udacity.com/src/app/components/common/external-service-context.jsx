import AuthenticationService from 'services/authentication-service';
import PropTypes from 'prop-types';
import UserService from 'services/user-service';

const initialState = {
  isCareerPortalEnabled: null,
  allLoaded: false,
};

const ExternalServiceContext = React.createContext({
  ...initialState,
});

export class ExternalServiceProvider extends React.Component {
  static displayName = 'components/common/external-service-provider';

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    ...initialState,
  };

  componentDidMount() {
    let careerPortalPromise;
    if (AuthenticationService.isAuthenticated()) {
      UserService.fetchLayout()
        .then((user) => {
          // NOTE: function signature is actually an array, vs. documented method:
          this.setState({
            isCareerPortalEnabled: _.get(user, 'can_see_career_portal', false),
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            isCareerPortalEnabled: false,
          });
        });
    } else {
      this.setState({
        isCareerPortalEnabled: false,
      });
    }

    Promise.all([careerPortalPromise])
      .then(() => {
        this.setState({ allLoaded: true });
      })
      .catch(console.error); // this is impossible, right?  the other promises should catch their errors.
  }

  render() {
    const providerValue = {
      ...this.state,
    };

    return (
      <ExternalServiceContext.Provider value={providerValue}>
        {this.props.children}
      </ExternalServiceContext.Provider>
    );
  }
}

export const ExternalServiceConsumer = ExternalServiceContext.Consumer;
ExternalServiceConsumer.displayName =
  'components/common/external-service-consumer';
