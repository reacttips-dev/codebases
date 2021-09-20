import Resource, { ResourceTypes } from './_resource';

import ClassroomPropTypes from 'components/prop-types';
import ForumHelper from 'helpers/forum-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import PartHelper from 'helpers/part-helper';
import PaymentsHelper from 'helpers/payments-helper';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import StateHelper from 'helpers/state-helper';
import SubscriptionHelper from 'helpers/subscription-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './_section.scss';

const mapStateToProps = (state) => {
  return {
    isForumEnabled: StateHelper.isForumEnabled(state),
    orderHistory: PaymentsHelper.State.getOrderHistory(state),
  };
};

export const Section = cssModule(styles)(
  createReactClass({
    displayName: 'common/resources-list/_section',

    propTypes: {
      lessonKey: PropTypes.string.isRequired,
      isForumEnabled: PropTypes.bool.isRequired,
      resources: ClassroomPropTypes.resources,
      showSupport: PropTypes.bool,
      title: PropTypes.string.isRequired,
    },

    contextTypes: {
      root: PropTypes.object,
    },

    mixins: [RouteMixin],

    getDefaultProps() {
      return {
        resources: {},
        showSupport: false,
      };
    },

    _createLink(name, url, type) {
      return (
        <li key={url}>
          <Resource url={url} name={name} type={type} />
        </li>
      );
    },

    _getSupportUrl() {
      return __('https://udacity.zendesk.com/hc/en-us/requests/new');
    },

    _isRefundable() {
      const { orderHistory } = this.props;
      const key = _.get(this, 'context.root.key');
      const subscription = _.find(orderHistory, (subscription) => {
        return (
          _.get(subscription, 'purchased_products[0].nanodegree_key', '') ===
          key
        );
      });

      return _.get(subscription, 'can_refund', false);
    },

    _inFreePromo() {
      const { orderHistory } = this.props;
      const key = _.get(this, 'context.root.key');
      const subscription = _.find(orderHistory, (subscription) => {
        return (
          _.get(subscription, 'purchased_products[0].nanodegree_key', '') ===
          key
        );
      });

      if (SubscriptionHelper.isFreeMonthPromotion(subscription)) {
        //true unless there's been at least one actual payment in this promo subscription
        return !SubscriptionHelper.hasPaid(subscription);
      } else {
        return false;
      }
    },

    _shouldDisableDownloads() {
      //only disable downloads for parts after the part containing the first project.
      //We still want students to be able to make some progress during the refund window,
      //but don't want them to have the opportunity to download all the resources for the ND
      // https://udacity.atlassian.net/browse/EXCO-339

      const { root } = this.context;
      // allow students in free courses to download content (?)
      if (SemanticTypes.isCourse(root)) {
        return false;
      }

      //disallow students in free promo from downloading, even if they're in refundable window
      if (this._inFreePromo()) {
        return true;
      }

      // Scholarships don't show up in the order history
      // so we have to check for it manually here.
      if (
        SemanticTypes.isNanodegree(root) &&
        NanodegreeHelper.isScholarship(root) &&
        NanodegreeHelper.isEnrolled(root)
      ) {
        return false;
      }

      const { lessonKey } = this.props;
      const firstProject = ProjectHelper.getFirstProject(root.parts);

      if (!firstProject) {
        return this._isRefundable();
      }

      const firstProjectParentPart = PartHelper.getParentPart(
        root.parts,
        firstProject.key
      );
      const firstProjectPartPosition = NodeHelper.getPosition(
        root.parts,
        firstProjectParentPart
      );

      const thisPart = PartHelper.getParentPart(root.parts, lessonKey);
      const thisPartPosition = NodeHelper.getPosition(root.parts, thisPart);
      return (
        thisPartPosition > firstProjectPartPosition && this._isRefundable()
      );
    },

    _renderFiles() {
      const hasFiles = !_.isEmpty(_.get(this, 'props.resources.files'));
      return hasFiles ? (
        this._shouldDisableDownloads() ? (
          <span>
            <p>{__('Downloading unavailable during refund period.')}</p>
            <p>
              {__(
                'You may download resource files after the refund window has passed.'
              )}
            </p>
          </span>
        ) : (
          _.map(this.props.resources.files, ({ name, uri }) =>
            this._createLink(name, uri, ResourceTypes.FILE)
          )
        )
      ) : null;
    },

    _renderForumsLink() {
      const { showSupport, isForumEnabled } = this.props;
      const isContentForumEnabled = ForumHelper.isForumEnabled(this.context);
      const forumsPath = this.forumsPath();
      const isKnowledgeLink = forumsPath.includes(CONFIG.knowledgeWebUrl);
      if (
        showSupport &&
        isForumEnabled &&
        isContentForumEnabled &&
        !isKnowledgeLink
      ) {
        return this._createLink(
          __('Forums'),
          this.forumsPath(),
          ResourceTypes.FORUM
        );
      }
    },

    // TODO: (dcwither) Support link should be on the sidebar for easy access
    _renderSupportLink() {
      if (this.props.showSupport) {
        return this._createLink(
          __('Report An Issue'),
          this._getSupportUrl(),
          ResourceTypes.SUPPORT
        );
      }
    },

    render() {
      const { title } = this.props;

      return (
        <div styleName="resource-section">
          <h3>{title}</h3>
          <ul>
            {this._renderForumsLink()}
            {this._renderFiles()}
            {this._renderSupportLink()}
          </ul>
        </div>
      );
    },
  })
);

export default connect(mapStateToProps)(Section);
