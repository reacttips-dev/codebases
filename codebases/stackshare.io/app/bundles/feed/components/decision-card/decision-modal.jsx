import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {mapPropsToDecisionVariables} from '../../../../data/feed/utils';
import {withQuery, withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {decisionQuery} from '../../../../data/feed/queries';
import {withRouteContext} from '../../../../shared/enhancers/router-enhancer';
import BaseModal from '../../../../shared/library/modals/base/modal.jsx';
import MobileModal from '../../../../shared/library/modals/base/modal-mobile.jsx';
import PostCard from '../../../../shared/library/cards/post';
import {LIGHT} from '../../constants/utils';
import Portal from '../../../../shared/library/modals/base/portal';
import MobilePortal from '../../../../shared/library/modals/base/portal-mobile';
import {MobileContext} from '../../../../shared/enhancers/mobile-enhancer';
import ProgressIndicator, {
  LARGE
} from '../../../../shared/library/indicators/indeterminate/circular';
import {Center} from '../../containers/feed-mobile';
import {DECISION_SOURCE_PERMALINK} from '../../constants/analytics';
import {toolsPresenter} from '../../../../shared/utils/presenters';
import {
  POST_TYPE_GIVE_ADVICE,
  POST_TYPE_GET_ADVICE
} from '../../../../shared/library/cards/post/constants';
import {trackViews} from '../../../../data/shared/mutations.js';
import {callTrackViews} from '../../../../../app/shared/utils/trackViews.js';

class DecisionModalComponent extends Component {
  static propTypes = {
    stackDecision: PropTypes.object,
    error: PropTypes.bool,
    onDismiss: PropTypes.func,
    trackViews: PropTypes.func
  };

  componentDidMount() {
    const {stackDecision, error, trackViews} = this.props;

    if (!error && stackDecision && trackViews) {
      const {decisionType} = stackDecision;

      const decisionIds = [stackDecision.id];

      if (decisionType === POST_TYPE_GIVE_ADVICE || decisionType === POST_TYPE_GET_ADVICE) {
        decisionIds.push(...stackDecision.answers.edges.map(i => i.node.id));
      }

      callTrackViews({
        trackViews,
        decisionIds,
        clientContext: `DecisionModalComponent-${window.location.pathname}`
      });
    }
  }

  analyticsPayload = () => {
    const {id, services, viewCount} = this.props.stackDecision;

    return {
      id,
      views: viewCount,
      ...toolsPresenter('cardTools', services),
      decisionSource: DECISION_SOURCE_PERMALINK
    };
  };

  isGiveAdvicePost = () => {
    const {parent, decisionType} = this.props.stackDecision;
    return parent && decisionType === POST_TYPE_GIVE_ADVICE;
  };

  postForDecision = () => {
    const {stackDecision} = this.props;
    return this.isGiveAdvicePost() ? {...stackDecision.parent} : {...stackDecision};
  };

  childForPost = () => {
    return this.isGiveAdvicePost() ? this.props.stackDecision : null;
  };

  renderDesktop(stackDecision, errorCode, onDismiss) {
    return (
      <Portal position="top" onDismiss={onDismiss} animateIn={false}>
        <BaseModal hideTitleBar={true} width={800} layout="none">
          {stackDecision && (
            <PostCard
              theme={LIGHT}
              expanded={true}
              isPermalinkModal={true}
              child={this.childForPost()}
              post={this.postForDecision()}
              analyticsPayload={this.analyticsPayload()}
            />
          )}
        </BaseModal>
      </Portal>
    );
  }

  renderMobile(stackDecision, errorCode, onDismiss) {
    return (
      <MobilePortal>
        <MobileModal title="Decision" onDismiss={onDismiss}>
          {stackDecision ? (
            <PostCard
              theme={LIGHT}
              expanded={true}
              isPermalinkModal={true}
              child={this.childForPost()}
              post={this.postForDecision()}
              analyticsPayload={this.analyticsPayload()}
            />
          ) : (
            <Center>
              <ProgressIndicator size={LARGE} />
            </Center>
          )}
        </MobileModal>
      </MobilePortal>
    );
  }

  render() {
    const {stackDecision, error, onDismiss} = this.props;
    if (error) {
      return null;
    }

    return (
      <MobileContext.Consumer>
        {mobile =>
          mobile
            ? this.renderMobile(stackDecision, error, onDismiss)
            : this.renderDesktop(stackDecision, error, onDismiss)
        }
      </MobileContext.Consumer>
    );
  }
}

export class DecisionModal extends Component {
  static propTypes = {
    stackDecision: PropTypes.object,
    error: PropTypes.bool,
    onDismiss: PropTypes.func,
    trackViews: PropTypes.func
  };

  render() {
    const {stackDecision, error, onDismiss, trackViews} = this.props;
    return (
      <MobileContext.Consumer>
        {mobile =>
          stackDecision ? (
            <DecisionModalComponent
              stackDecision={stackDecision}
              error={error}
              onDismiss={onDismiss}
              trackViews={trackViews}
            />
          ) : mobile ? (
            <MobilePortal>
              <MobileModal title="Decision" onDismiss={onDismiss}>
                <Center>
                  <ProgressIndicator size={LARGE} />
                </Center>
              </MobileModal>
            </MobilePortal>
          ) : (
            <></>
          )
        }
      </MobileContext.Consumer>
    );
  }
}

export default compose(
  withRouteContext,
  withQuery(
    decisionQuery,
    ({error, stackDecision}) => {
      if (error) {
        return {error: true};
      }

      return {stackDecision};
    },
    mapPropsToDecisionVariables
  ),
  withMutation(trackViews, mutate => ({
    trackViews: (decisionIds, clientContext) => mutate({variables: {decisionIds, clientContext}}),
    ssr: false
  }))
)(DecisionModal);
