import React from 'react';

import { CSSTransitionGroup } from 'react-transition-group';

import 'css!bundles/learning-assistant/components/__styles__/LearningAssistantSlideInAndOutTransition';

const LearningAssistantSlideInAndOutTransition: React.SFC<{}> = ({ children }) => (
  <CSSTransitionGroup
    transitionEnter
    transitionLeave
    transitionAppear
    transitionEnterTimeout={800}
    transitionLeaveTimeout={600}
    transitionAppearTimeout={800}
    transitionName="learning-assistant-slide"
    component="div"
  >
    {children}
  </CSSTransitionGroup>
);

export default LearningAssistantSlideInAndOutTransition;
