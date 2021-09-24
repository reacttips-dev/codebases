import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {withPortal} from '../../../../shared/library/modals/base/portal';
import {WHITE, FOCUS_BLUE} from '../../../../shared/style/colors';
import CloseIcon from '../../../../shared/library/icons/close.svg';
import Arrow from '../../../../shared/library/icons/right-arrow-white.svg';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import {ALPHA} from '../../../../shared/style/color-utils';
import BaseModal from '../../../../shared/library/modals/base/modal.jsx';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';

const Container = glamorous.div({
  width: 900,
  height: 600,
  borderRadius: 4,
  backgroundColor: WHITE,
  position: 'relative',
  padding: '18px 26px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

const CloseIconDiv = glamorous.div({
  width: 40,
  height: 40,
  borderRadius: 40,
  cursor: 'pointer',
  position: 'absolute',
  right: -9,
  top: -17,
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > svg > g': {
    fill: '#a1a1a1',
    stroke: '#a1a1a1'
  },
  '&:hover': {
    backgroundColor: '#e5e5e5'
  }
});

const Actions = glamorous.div({
  borderTop: 'solid 1px #dadada',
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: 30,
  alignItems: 'center'
});

const Previous = glamorous(SimpleButton)(({show}) => ({
  visibility: show ? 'visible' : 'hidden',
  background: WHITE,
  borderColor: WHITE,
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.25,
  color: '#424242',
  '& > svg': {
    width: 8,
    height: 13,
    marginRight: 10,
    transform: 'rotate(180deg)',
    ' > path': {
      fill: '#b3b3b3',
      stroke: '#b3b3b3'
    }
  },
  '&:hover': {
    borderColor: WHITE,
    background: WHITE,
    color: '#a1a1a1'
  }
}));

const Next = glamorous(SimpleButton)(({show}) => ({
  visibility: show ? 'visible' : 'hidden',
  color: WHITE,
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.25,
  '& > svg': {
    width: 8,
    height: 13,
    marginLeft: 10,
    ' > path': {
      fill: WHITE,
      stroke: WHITE
    }
  },
  '&:hover': {
    borderColor: '#43a4ff'
  }
}));

const StepsIndicator = glamorous.div({
  borderRadius: 15,
  padding: '12px 10px',
  backgroundColor: ALPHA(FOCUS_BLUE, 0.12),
  display: 'flex',
  alignItems: 'center'
});

const Step = glamorous.div(({seen}) => ({
  width: 8,
  height: 8,
  borderRadius: 40,
  margin: '0 2.5px',
  backgroundColor: ALPHA(FOCUS_BLUE, seen ? 1 : 0.18)
}));

const Carousel = ({onDismiss, steps, analyticsOnOpen, analyticsOnNext, analyticsData = {}}) => {
  const [stepToShow, setStepToShow] = useState(0);
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  useEffect(() => {
    if (analyticsOnOpen) {
      sendAnalyticsEvent(analyticsOnOpen, {...analyticsData});
    }
  }, []);

  const onNextClick = () => {
    if (analyticsOnNext) {
      sendAnalyticsEvent(analyticsOnNext, {...analyticsData, screenNumber: stepToShow + 1});
    }
    setStepToShow(stepToShow + 1);
  };

  const onPrevClick = () => setStepToShow(stepToShow - 1);

  return (
    <BaseModal hideTitleBar hideCloseIcon onDismiss={onDismiss}>
      <Container>
        <CloseIconDiv onClick={onDismiss}>
          <CloseIcon />
        </CloseIconDiv>
        {steps[stepToShow]}
        <Actions>
          <Previous onClick={onPrevClick} show={stepToShow !== 0}>
            <Arrow />
            Previous
          </Previous>
          <StepsIndicator>
            {steps.map((_, index) => (
              <Step seen={index <= stepToShow} key={index} />
            ))}
          </StepsIndicator>

          <Next onClick={onNextClick} show={stepToShow !== steps.length - 1}>
            Next
            <Arrow />
          </Next>
        </Actions>
      </Container>
    </BaseModal>
  );
};

Carousel.propTypes = {
  onDismiss: PropTypes.func,
  steps: PropTypes.array,
  analyticsOnOpen: PropTypes.string,
  analyticsOnNext: PropTypes.string,
  analyticsData: PropTypes.object
};

export default withPortal(Carousel);
