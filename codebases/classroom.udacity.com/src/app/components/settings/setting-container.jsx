import Actions from 'actions';
import Header from 'components/common/header';
import Layout from 'components/common/layout';
import Nav from './_nav';
import SettingsHelper from 'helpers/settings-helper';
import UiHelper from 'helpers/ui-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './setting-container.scss';

const mapStateToProps = (state) => ({
  user: SettingsHelper.State.getUser(state),
  isFetching: UiHelper.State.isFetchingUserBase(state),
});

const mapDispatchToProps = {
  fetchNanodegreesAndCoursesAndParts:
    Actions.fetchNanodegreesAndCoursesAndParts,
};

// Split out into separate component to stop ureact-app-shell layout from remounting it.
const Body = cssModule(styles)((props) => (
  <div styleName="settings" className={styles['body']}>
    <div styleName="nav">
      <Nav />
    </div>
    <div className="content">
      {React.cloneElement(props.children, _.omit(props, 'children', 'styles'))}
    </div>
  </div>
));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    static displayName = 'settings/setting-container';

    render() {
      const { isFetching } = this.props;

      return (
        <Layout
          busy={isFetching}
          documentTitle={__('Settings')}
          header={<Header title={__('Settings')} />}
        >
          {isFetching ? null : <Body {...this.props} />}
        </Layout>
      );
    }
  }
);
