import classnames from 'classnames';
import { Icon } from '@postman/aether';
import { LESSON_PAUSED } from '../../LessonConstants';
import { fetchLesson } from '../../../../common/apis/APIService';
import Spinner from './Spinner';
import LessonController from '../../LessonController';
import { Button } from '../../../../../../js/components/base/Buttons';

import { getStore, UIEventService, EditorService, OPEN_LESSON_PLAN, NavigationService } from '../../../../common/dependencies';


import XPath from '../../../../../../js/components/base/XPaths/XPath';
import CloseIcon from '../../../../../../js/components/base/Icons/CloseIcon';


const defaultState = {
    dismissable: false,
    currentState: null,
    label: 'Bootcamp',
    pausedLessonId: null,
    isLoadingLesson: false
  },
  HIGHLIGHT_STATE = 'highlight';

export default {
  name: 'learningCenter',
  position: 'right',

  getComponent: function ({
    React,
    StatusBarComponents
  }) {
    return class LearningCenter extends React.Component {
      constructor (props) {
        super(props);
        this.state = defaultState;

        this.handleReset = this.handleReset.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleHighlightLessonButton = this.handleHighlightLessonButton.bind(this);
        UIEventService.subscribe(LESSON_PAUSED, this.handleContinue);
        UIEventService.subscribe('highlightLessonButton', this.handleHighlightLessonButton);
        UIEventService.subscribe(OPEN_LESSON_PLAN, this.openBootcampPage);
      }

      openBootcampPage () {
        NavigationService.transitionTo('bootcamp');
      }

      continuePausedLesson () {
        this.setState({ isLoadingLesson: true, label: 'Loading lesson' });

        fetchLesson(this.state.pausedLessonId, (lesson) => {
          if (_.isEmpty(lesson)) {
            return;
          }
          LessonController.continueLesson(lesson);
          UIEventService.subscribe('lessonPopoverTriggered', () => {
            this.setState({ isLoadingLesson: false, label: 'Bootcamp' });
          }, { once: true });
        });
        this.setState({ pausedLessonId: null, currentState: null, dismissable: false });
      }

      handleClick () {
        if (this.state.pausedLessonId) {
          this.continuePausedLesson();
          return;
        }
        let currentUser = getStore('CurrentUserStore'),
          isLoggedIn = currentUser && currentUser.isLoggedIn;

        if (!isLoggedIn) {
          pm.mediator.trigger('showSignInModal', {
            title: 'Improve your skills in Postman',
            subtitle: 'Learn about different features inside Postman and improve your skills through an interactive tutorial. Please create an account to continue.',
            renderIcon: this.renderIcon,
            onAuthentication: this.openBootcampPage,
            origin: 'learning_center'
          });
          return;
        }

        this.openBootcampPage();
        this.handleReset();
      }

      renderIcon () {
        return <div className='learning-center-empty-state-icon' />;
      }

      handleReset (e) {
        e && e.stopPropagation();
        this.setState(defaultState);
      }

      handleContinue (pausedLessonId) {
        this.setState({
          dismissable: true,
          currentState: HIGHLIGHT_STATE,
          label: 'Continue learning',
          pausedLessonId
        });
      }

      handleHighlightLessonButton () {
        this.setState({
          currentState: HIGHLIGHT_STATE,
          label: 'Bootcamp'
        });
      }

      render () {

        if (pm.isScratchpad) {
          return null;
        }

        let { Item, Text } = StatusBarComponents;

        return (
          <Item
            className='plugin__learningCenter'
            tooltip='Learning Center'
          >
            <Text
              render={() => {
                return (
                  <XPath identifier='learningCenter'>
                    <div
                      className={classnames(
                        { 'loading': this.state.isLoadingLesson },
                        { 'highlight': this.state.currentState },
                        'learning-center-button'
                      )}
                      onClick={this.handleClick}
                    >
                      {this.state.isLoadingLesson ? <Spinner /> :
                      <Icon
                        name='icon-descriptive-bootcamp-stroke'
                        className='pm-icon'
                        color={this.state.currentState && 'content-color-brand'}
                        size='small'
                      />}
                      <span className={
                        classnames(
                          { 'dismissable': this.state.dismissable },
                          'learning-center-label'
                        )}
                      >
                        {this.state.label}
                      </span>
                      {
                        this.state.dismissable &&
                        <div
                          className='pm-icon'
                          onClick={this.handleReset}
                        >
                          <Icon
                            name='icon-action-close-stroke'
                            color={this.state.currentState && 'content-color-brand'}
                            size='small'
                          />
                        </div>
                      }
                    </div>
                  </XPath>
                );
              }}
            />
          </Item>
        );
      }
    };
  }
};
