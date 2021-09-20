import {
  selectKnowledgeUnreads,
  selectStudentHubHasUnreads,
  selectStudentHubMentionsCount,
} from 'helpers/state-helper/_services-state-helper';

import { ExternalServiceConsumer } from 'components/common/external-service-context';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  // Parent component 'components/app-layout' doesn't know active ndKey;
  // Therefore, ServiceLinksContainer must look it up
  const ndKey = ownProps.ndKey || _.first(Object.keys(state.nanodegrees));
  return {
    isEnterpriseOnly: SettingsHelper.State.getIsEnterpriseOnly(state),
    hasUnreads: selectStudentHubHasUnreads(state, ndKey),
    hasEnterprise: SettingsHelper.State.getHasEnterpriseDefaultServiceModel(
      state
    ),
    mentionsCount: selectStudentHubMentionsCount(state),
    nanodegreesList: SettingsHelper.State.getAllNanodegrees(state),
    hasKnowledgeReviews: SettingsHelper.State.getHasKnowledgeReviews(
      state,
      ndKey
    ),
    isStudentHubEnabled: SettingsHelper.State.getHasStudentHub(state, ndKey),
    unreadPosts: selectKnowledgeUnreads(state),
  };
};

export class ServiceLinksContainer extends React.Component {
  static displayName = 'common/service-links-container';

  static propTypes = {
    isEnterpriseOnly: PropTypes.bool.isRequired,
    hasKnowledgeReviews: PropTypes.bool.isRequired,
    isStudentHubEnabled: PropTypes.bool.isRequired,
    hasEnterprise: PropTypes.bool.isRequired,
    DisplayComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    ndKey: PropTypes.string,
    onCloseHelpSidebar: PropTypes.func,
    isCareerPortalEnabled: PropTypes.bool,
    shouldDisplayServiceLinks: PropTypes.bool,
    hasUnreads: PropTypes.bool,
    mentionsCount: PropTypes.number,
    unreadPosts: PropTypes.number,
  };

  static defaultProps = {
    shouldDisplayServiceLinks: true,
  };

  render() {
    const { DisplayComponent, shouldDisplayServiceLinks } = this.props;

    if (DisplayComponent && shouldDisplayServiceLinks) {
      return <DisplayComponent {...this.props} />;
    }

    return null;
  }
}

export default connect(
  mapStateToProps,
  null
)((props) => (
  <ExternalServiceConsumer>
    {({ isCareerPortalEnabled }) => {
      return (
        <ServiceLinksContainer
          isCareerPortalEnabled={isCareerPortalEnabled}
          {...props}
        />
      );
    }}
  </ExternalServiceConsumer>
));
