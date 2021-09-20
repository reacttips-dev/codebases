import AuthenticationService from 'services/authentication-service';
import RouteMixin from 'mixins/route-mixin';
import { __ } from 'services/localization-service';
import createReactClass from 'create-react-class';
import styles from './login.scss';

export default cssModule(
  createReactClass({
    displayName: 'notifications/login',

    mixins: [RouteMixin],

    getInitialState() {
      return {
        loginClicked: false,
      };
    },

    handleLoginClick(evt) {
      this.setState({ loginClicked: true });
      AuthenticationService.authenticate(window.location);
      evt.preventDefault();
    },

    render() {
      var { loginClicked } = this.state;

      return (
        <div>
          <a
            href="#"
            styleName={loginClicked ? 'link-clicked' : 'link'}
            onClick={this.handleLoginClick}
          >
            {__('Login or Sign Up to record your progress!')}
          </a>
        </div>
      );
    },
  }),
  styles
);
