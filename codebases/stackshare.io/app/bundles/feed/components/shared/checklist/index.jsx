import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import {withChecklistContext} from '../../../../../shared/enhancers/checklist-enhancer';
import {grid} from '../../../../../shared/utils/grid';
import LightHeading from '../../../../../shared/library/typography/light-heading';
import Checkmark from './checkmark';
import {
  ASH,
  GUNSMOKE,
  CHARCOAL,
  FOCUS_BLUE,
  WHITE,
  ALABASTER
} from '../../../../../shared/style/colors';
import Hint, {ACTIVATE_MODE_HOVER} from '../../../../../shared/library/popovers/hint';
import {TOP_START} from '../../../../../shared/constants/placements';
import Circular from '../../../../../shared/library/indicators/indeterminate/circular';
import CheckListItem from './checklist-item';
import ProgressBar from '../../../../../shared/library/indicators/progress-bar';
import CloseIcon from '../icons/close-icon.svg';
import {withMutation} from '../../../../../shared/enhancers/graphql-enhancer';
import {dismissOnboardingChecklist} from '../../../../../data/feed/mutations';
import {onboardingChecklist} from '../../../../../data/feed/queries';
import {withSendAnalyticsEvent} from '../../../../../shared/enhancers/analytics-enhancer';
import {ONBOARDING_CHECKLIST_SHOW} from '../../../constants/analytics';
import animate, {opacity} from '../../../../../shared/library/animation/animate';

const ICON_SIZE = 19;

const Container = glamorous.div({
  border: `1px solid ${ASH}`,
  borderRadius: 4,
  padding: grid(3),
  width: grid(32),
  position: 'relative',
  background: WHITE
});

const ItemContainer = glamorous.div({
  marginBottom: grid(2)
});

const Item = glamorous.a(
  {
    display: 'flex',
    cursor: 'pointer',
    fontSize: 14,
    margin: -grid(1),
    padding: grid(1)
  },
  ({completed}) => ({
    textDecoration: completed ? 'line-through' : 'none',
    color: completed ? GUNSMOKE : CHARCOAL,
    cursor: completed ? 'text' : 'pointer',
    '&:hover': {
      textDecoration: completed ? 'line-through' : 'none',
      color: completed ? GUNSMOKE : FOCUS_BLUE,
      background: completed ? WHITE : ALABASTER
    }
  })
);

const BulletIconContainer = glamorous.div({
  flexShrink: 0,
  marginRight: grid(1),
  position: 'relative',
  top: 1
});

const BulletIcon = glamorous.div(
  {
    border: `1px solid ${FOCUS_BLUE}`,
    borderRadius: '50%',
    width: ICON_SIZE,
    height: ICON_SIZE,
    color: WHITE,
    display: 'flex'
  },
  ({completed}) => ({
    textDecoration: completed ? 'line-through' : 'none',
    color: completed ? GUNSMOKE : CHARCOAL,
    background: completed ? FOCUS_BLUE : WHITE,
    cursor: completed ? 'auto' : 'cursor'
  })
);

const CloseIconContainer = glamorous.div({
  position: 'absolute',
  right: grid(2),
  top: grid(2),
  cursor: 'pointer'
});

export class Checklist extends Component {
  static propTypes = {
    checklistContext: PropTypes.object,
    dismissOnboardingChecklist: PropTypes.func,
    sendAnalyticsEvent: PropTypes.func.isRequired
  };

  static defaultProps = {
    checklistContext: {}
  };

  container = null;

  checklistLoaded = () => {
    const {
      checklistContext: {checklist}
    } = this.props;
    return Boolean(checklist && !checklist.loading && !checklist.dismissed);
  };

  calculateProgress = () => {
    if (this.checklistLoaded()) {
      const {items} = this.props.checklistContext.checklist;
      const completedItems = items.filter(item => item.completed);
      return Math.round((100 * completedItems.length) / items.length);
    } else return 0;
  };

  state = {
    progress: this.calculateProgress()
  };

  componentDidUpdate(prevProps) {
    const prevChecklist = prevProps.checklistContext.checklist;
    const currentChecklist = this.props.checklistContext.checklist;

    if (prevChecklist !== currentChecklist) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({progress: this.calculateProgress()});
    }

    if (this.checklistLoaded() && prevChecklist && prevChecklist.loading) {
      const checkedItems = currentChecklist.items.filter(item => item.completed);
      const uncheckedItems = currentChecklist.items.filter(item => !item.completed);

      this.props.sendAnalyticsEvent(ONBOARDING_CHECKLIST_SHOW, {
        completed: currentChecklist.completed,
        checkedCount: checkedItems.length,
        checked: checkedItems.map(item => item.slug),
        unchecked: uncheckedItems.map(item => item.slug)
      });
    }
  }

  handleDismiss = () => {
    const {dismissOnboardingChecklist} = this.props;

    animate([{element: this.container, from: 1, to: 0}], 300, opacity, () => {
      dismissOnboardingChecklist();
    });
  };

  renderChecklistItems = () => {
    const {
      checklistContext: {
        checklist: {items},
        onChecklistAction,
        checklistItemLoading
      },
      sendAnalyticsEvent
    } = this.props;

    return items.map((item, index) => (
      <CheckListItem
        key={index}
        item={item}
        onChecklistAction={onChecklistAction}
        checklistItemLoading={checklistItemLoading}
        sendAnalyticsEvent={sendAnalyticsEvent}
      >
        {(title, hint, handleHint, handleClick, itemLoading) => {
          if (!title) return null;
          return (
            <Hint
              placement={TOP_START}
              anchor={
                <ItemContainer>
                  <Item completed={item.completed} onClick={handleClick}>
                    <BulletIconContainer>
                      {itemLoading ? (
                        <Circular size={ICON_SIZE} />
                      ) : (
                        <BulletIcon completed={item.completed}>
                          {item.completed && <Checkmark />}
                        </BulletIcon>
                      )}
                    </BulletIconContainer>
                    {title}
                  </Item>
                </ItemContainer>
              }
              hint={hint}
              customStyle={{width: 280, textAlign: 'left'}}
              activateMode={ACTIVATE_MODE_HOVER}
              onActivate={handleHint}
            />
          );
        }}
      </CheckListItem>
    ));
  };

  render() {
    const {
      checklistContext: {checklist}
    } = this.props;
    const {progress} = this.state;

    if (this.checklistLoaded()) {
      return (
        <Container innerRef={el => (this.container = el)}>
          {checklist.completed && (
            <CloseIconContainer onClick={this.handleDismiss}>
              <CloseIcon />
            </CloseIconContainer>
          )}
          <LightHeading>
            Get the most out
            <br />
            of using StackShare
          </LightHeading>
          <ProgressBar progress={progress} />
          {this.renderChecklistItems()}
        </Container>
      );
    } else return null;
  }
}

export default compose(
  withChecklistContext,
  withSendAnalyticsEvent,
  withMutation(dismissOnboardingChecklist, mutate => ({
    dismissOnboardingChecklist: () =>
      mutate({
        refetchQueries: [{query: onboardingChecklist}]
      })
  }))
)(Checklist);
