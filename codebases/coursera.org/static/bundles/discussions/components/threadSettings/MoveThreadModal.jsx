import _ from 'underscore';
import PropTypes from 'prop-types';
import Q from 'q';
import URI from 'jsuri';
import _t from 'i18n!nls/discussions';
import React from 'react';
import path from 'js/lib/path';
import Modal from 'bundles/phoenix/components/Modal';
import { buildUrl } from 'bundles/discussions/utils/discussionsUrl';
import { moveQuestion } from 'bundles/discussions/api/threadActionsApiUtil';
import { ForumSelector } from 'bundles/discussions/components/NewThreadFormComponents';
import api from 'bundles/discussions/api/questions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import mapProps from 'js/lib/mapProps';
import waitFor from 'js/lib/waitFor';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import { naptimeForumTypes } from 'bundles/discussions/constants';
import 'css!./__styles__/MoveThreadModal';

class MoveThreadModal extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    courseId: PropTypes.string,
    rootPath: PropTypes.string,
    courseForums: PropTypes.arrayOf(PropTypes.instanceOf(OnDemandCourseForumsV1)),
    questionForum: PropTypes.instanceOf(OnDemandCourseForumsV1),
    rootForumId: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    // filter out all subforums and the root forum
    const forumsWithoutSubforums = props.courseForums.filter((forum) => forum.parentForumId === this.props.rootForumId);
    // add back the subforums so that they are in the correct order
    const forums = _(
      forumsWithoutSubforums.map((parentForum) =>
        [parentForum].concat(props.courseForums.filter((forum) => forum.parentForumId === parentForum.id))
      )
    )
      .flatten()
      .map((forum) => Object.assign(forum, { type: forum.forumType.typeName }));
    const selectedForum = Object.assign(props.questionForum, {
      type: props.questionForum.forumType.typeName,
    });
    const initialId = props.questionForum.id;

    this.state = {
      saving: false,
      saveError: false,
      selectedForum,
      forums,
      initialId,
    };
  }

  handleSaveSuccess = () => {
    this.closeModal();
    const url = buildUrl(path.join(this.props.rootPath, this.state.selectedForum.link), this.props.question.questionId);
    this.context.router.push(url);
  };

  handleSaveError = (error) => {
    this.setState({
      saveError: true,
      saving: false,
    });
  };

  handleInputChange = (placeholder, event) => {
    this.setState({
      selectedForum: event.value,
    });
  };

  handleCloseModal = () => {
    this.closeModal();
  };

  handleCancel = () => {
    this.closeModal();
  };

  handleSubmit = () => {
    const moveApiCall = moveQuestion(
      this.props.question.id,
      this.props.courseId,
      this.state.selectedForum.forumId,
      this.state.selectedForum.type,
      this.props.userId
    );
    if (moveApiCall) {
      moveApiCall.then(this.handleSaveSuccess).fail(this.handleSaveError).done();

      this.setState({ saving: true });
    } else {
      const selectedForum = this.state.selectedForum;

      const uri = new URI().addQueryParam('action', 'move').addQueryParam('id', this.props.question.id);

      const options = {
        context: {
          typeName: selectedForum.type,
          definition: {
            courseId: this.props.courseId,
          },
        },
      };

      if (selectedForum.type === 'week') {
        options.context.definition.weekNumber = parseInt(selectedForum.id, 10);
      } else {
        options.context.definition[selectedForum.type + 'Id'] = selectedForum.id;
      }

      Q(api.post(uri.toString(), { data: options }))
        .then(this.handleSaveSuccess)
        .catch(this.handleSaveError)
        .done();

      this.setState({ saving: true });
    }
  };

  closeModal() {
    this.props.handleClose();
  }

  render() {
    const saveError = (
      <div className="c-error-text c-form-error-message">
        {_t('Sorry, there was a problem moving this thread. Please reload the page and try again.')}
      </div>
    );

    return (
      <div className="rc-MoveThreadModal styleguide">
        <Modal handleClose={this.handleCloseModal} modalName={_t('Move thread')} ref="moveThreadModal">
          <h1 className="c-modal-title display-1-text">{_t('Move Thread')}</h1>
          {this.state.forums && (
            <ForumSelector
              ref="currentForum"
              handleInputChange={this.handleInputChange}
              forums={this.state.forums}
              value={this.state.selectedForum}
              rootForumId={this.props.rootForumId}
            />
          )}
          <div className="horizontal-box align-items-right">
            {this.state.saveError && saveError}
            <button className="passive" onClick={this.handleCancel}>
              {_t('Cancel')}
            </button>
            <button
              ref="submit"
              disabled={
                this.state.saving || !this.state.selectedForum || this.state.selectedForum.id === this.state.initialId
              }
              className="secondary"
              type="submit"
              onClick={this.handleSubmit}
            >
              {_t('Submit')}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default _.compose(
  connectToStores(['CourseStore', 'ApplicationStore'], ({ CourseStore, ApplicationStore }) => {
    return {
      userId: ApplicationStore.getUserData().id,
      courseId: CourseStore.getCourseId(),
      rootPath: `/learn/${CourseStore.getCourseSlug()}`,
    };
  }),
  discussionsForumsHOC({ fields: ['title', 'forumType', 'link'] }),
  mapProps((props) => {
    const questionForumId = props.question.forumId;
    const rootForum =
      props.courseForums &&
      props.courseForums.find((forum) => forum.forumType.typeName === naptimeForumTypes.rootForumType);
    return {
      questionForum: props.courseForums && props.courseForums.find((forum) => forum.forumId === questionForumId),
      rootForumId: rootForum && rootForum.id,
    };
  }),
  waitFor((props) => !!props.courseForums && !!props.questionForum)
)(MoveThreadModal);
