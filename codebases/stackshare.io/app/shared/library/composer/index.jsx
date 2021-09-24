import React, {Fragment, useRef, useState, useEffect, useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {useSendAnalyticsEvent, withAnalyticsPayload} from '../../enhancers/analytics-enhancer';
import {grid} from '../../utils/grid';
import Options from './components/options';
import UserPanel from './components/user-panel';
import Tools from './components/tools';
import BaseInput from './components/inputs/base';
import Chips from './components/meta';
import CancelButton from '../../library/buttons/base/cancel';
import SimpleButton from '../../library/buttons/base/simple';
import MoreIcon from '../../library/icons/more.svg';
import PopoverWithAnchor from '../../library/popovers/base-v2';
import {PopoverPanel} from '../../library/popovers/base-v2/panel';
import {ArrowContainer} from '../../library/popovers/base-v2/arrow';
import Arrow from '../../library/popovers/base-v2/arrow.svg';
import Notice, {INLINE} from '../notices/notice';
import ErrorModal from './components/error-modal';
import {LEFT_START, TOP, BOTTOM_END} from '../../constants/placements';
import {COMPOSER_PROMPT} from '../../constants/analytics';
import {WHITE, ASH, ALABASTER, ERROR_RED} from '../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../style/typography';
import {
  PLACEHOLDER_INACTIVE,
  STRUCTURES,
  STRUCTURE_TOOL,
  STRUCTURE_GIVE_ADVICE,
  TEXTAREA_HEIGHT,
  MAX_TEXTAREA_HEIGHT,
  STRUCTURE_CHANGE_CONFIRMATION_MESSAGE
} from './constants';

import Indicator, {BUTTON} from '../indicators/indeterminate/circular';
import * as COMPOSER_ACTIONS from './state/actions';
import {useChecklistAction, useLayoutWidth} from './state/hooks';
import {DispatchContext, StateContext} from './state/provider';
import {ApolloContext} from '../../enhancers/graphql-enhancer';
import {setPromptInteracted, upsertStructuredDecision} from '../../../data/shared/mutations';
import {createMutationToolsPayload, createAnalyticsPayload} from './utils';
import {triggerConfirmation} from '../../utils/confirmation';
import * as contentUtils from './content';
import {PHONE} from '../../style/breakpoints';
import {MobileContext} from '../../enhancers/mobile-enhancer';
import PrivatePublicToggle from './components/private-public-toggle';
import {PrivateModeContext, withPrivateMode} from '../../enhancers/private-mode-enchancer';
import {privateMode} from '../../../data/shared/queries';
import {compose} from 'react-apollo';

const ANALYTICS_SCOPE = 'structuredComposer';
const BORDER_RADIUS = 4;

const ShareButton = glamorous(SimpleButton)({
  [PHONE]: {
    width: 'calc(100vw - 30px)',
    height: 40
  }
});

const Container = glamorous.div(
  {
    ...BASE_TEXT,
    borderRadius: BORDER_RADIUS,
    border: `1px solid ${ASH}`,
    backgroundColor: ALABASTER,
    boxSizing: 'border-box',
    position: 'relative'
  },
  ({narrow, active}) => ({
    padding: `${active ? 36 : 16}px ${grid(narrow ? 1 : 3)}px 16px ${grid(narrow ? 1 : 3)}px`,
    [PHONE]: {
      padding: 0,
      border: 0,
      backgroundColor: WHITE
    }
  })
);

const Content = glamorous.div({
  borderRadius: BORDER_RADIUS,
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.06)',
  padding: grid(2),
  backgroundColor: WHITE,
  [PHONE]: {boxShadow: 'none'}
});

const Buttons = glamorous.div({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: grid(2),
  [PHONE]: {
    alignItems: 'center',
    flexDirection: 'column'
  }
});

const More = glamorous.div({
  display: 'flex',
  position: 'absolute',
  top: 0,
  right: 0,
  cursor: 'pointer',
  padding: '14px 10px 5px',
  [PHONE]: {display: 'none'}
});

const MoreLink = glamorous.div({
  cursor: 'pointer',
  padding: grid(2),
  '&:hover': {
    background: ALABASTER
  }
});

const ErrorMessage = glamorous(PopoverPanel)({
  width: 325,
  padding: grid(1),
  backgroundColor: ERROR_RED,
  color: WHITE,
  border: 0,
  borderRadius: 2
});

const ErrorContent = glamorous.div({
  fontSize: 11,
  textAlign: 'left'
});

const ErrorTitle = glamorous.div({
  fontWeight: WEIGHT.BOLD
});

const ErrorArrowContainer = glamorous(ArrowContainer)({
  '> svg > path:nth-child(2)': {
    // disable border stroke
    display: 'none'
  }
});

const PromptLayout = glamorous.div({
  marginTop: grid(2)
});

const PromptContent = glamorous.div({
  fontSize: 12
});

const SubmitNotice = glamorous.div({
  marginBottom: 15
});

const CREATE_DECISION = 'create_decision';

export const Composer = ({
  placeholder = PLACEHOLDER_INACTIVE,
  onCancel = null,
  onSubmit = null,
  refetchQueries = [],
  onMutationUpdate = null,
  editMode = false
}) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const client = useContext(ApolloContext);
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const isMobile = useContext(MobileContext);
  const isPrivateMode = useContext(PrivateModeContext);
  const [isPrivate, setIsPrivate] = useState(
    isPrivateMode && !isPrivateMode.loading ? true : false
  );
  const [textAreaHeight, setTextareaHeight] = useState(TEXTAREA_HEIGHT);
  const containerEl = useRef();
  const optionsEl = useRef();
  const textFieldEl = useRef();
  const containerWidth = useLayoutWidth(containerEl, []);
  const narrow = containerWidth < 500;

  useEffect(() => {
    if (state.dirty) {
      const prompt = event => {
        event.preventDefault();
        event.returnValue = '';
        return event.returnValue;
      };
      window.addEventListener('beforeunload', prompt, false);
      return () => window.removeEventListener('beforeunload', prompt, false);
    }
  }, [state.dirty]);

  useChecklistAction(containerEl, () => {
    dispatch({type: COMPOSER_ACTIONS.COMPOSER_ACTIVATE_WITH_STRUCTURE, structure: STRUCTURE_TOOL});
    textFieldEl.current.focus();
  });

  useEffect(() => {
    if (!state.active) {
      setTextareaHeight(TEXTAREA_HEIGHT);
    }
  }, [state.active]);

  const handleContentChange = ({target: {value}}, scrollHeight = null, index = null) => {
    if (scrollHeight) {
      setTextareaHeight(Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT));
    }
    dispatch({type: COMPOSER_ACTIONS.COMPOSER_CONTENT_CHANGE, value, index});
  };

  const handleStructureChange = (state, structure) => {
    if (
      contentUtils.isDirty(state) &&
      state.selectedStructure !== null &&
      state.selectedStructure !== structure
    ) {
      const allowStructureChange = triggerConfirmation(STRUCTURE_CHANGE_CONFIRMATION_MESSAGE);
      if (allowStructureChange) {
        dispatch({type: COMPOSER_ACTIONS.COMPOSER_STRUCTURE_CHANGE, structure});
      }
    } else {
      dispatch({type: COMPOSER_ACTIONS.COMPOSER_STRUCTURE_CHANGE, structure});
    }
  };

  const handleShare = () => {
    if (
      state.id ||
      contentUtils.passContentCheck(state, state.rawContent) ||
      isPrivateMode ||
      (!isPrivateMode && state.showContentError)
    ) {
      client
        .mutate({
          mutation: upsertStructuredDecision,
          refetchQueries,
          variables: {
            private: isPrivate,
            companyId: state.taggedCompany ? state.taggedCompany.id : null,
            rawContent: contentUtils.flatten(state),
            stackDecisionId: state.id,
            linkUrl: state.linkUrl,
            stackIdentifier: state.taggedStack ? state.taggedStack.identifier : null,
            ...createMutationToolsPayload(state)
          },
          update: (dataProxy, {data}) =>
            data &&
            data.upsertStructuredDecision &&
            onMutationUpdate &&
            onMutationUpdate(dataProxy, data.upsertStructuredDecision)
        })
        .then(({data}) => {
          if (data && data.upsertStructuredDecision) {
            const payload = {
              id: data.upsertStructuredDecision.id,
              username: data.upsertStructuredDecision.user.username
            };
            dispatch({
              type: COMPOSER_ACTIONS.COMPOSER_SUBMIT_SUCCESS,
              ...payload
            });
            onSubmit && onSubmit(payload);
            const analyticsPayload = createAnalyticsPayload(state);

            sendAnalyticsEvent(CREATE_DECISION, {
              private: isPrivate,
              link: state.linkUrl,
              company: state.taggedCompany ? state.taggedCompany.name : null,
              stacks: state.taggedStack ? state.taggedStack.name : null,
              structure: state.selectedStructure,
              ...analyticsPayload
            });
          }
        })
        .catch(({graphQLErrors}) => {
          if (graphQLErrors && graphQLErrors.length > 0) {
            dispatch({
              type: COMPOSER_ACTIONS.COMPOSER_SUBMIT_ERROR,
              message: graphQLErrors[0].extensions.errors[0].message
            });
          }
        });
    }
    dispatch({type: COMPOSER_ACTIONS.COMPOSER_SUBMIT});
  };

  const handleDismissPrompt = useMemo(
    () => () => {
      client.mutate({mutation: setPromptInteracted});
      dispatch({type: COMPOSER_ACTIONS.COMPOSER_PROMPT_DISMISS});
    },
    []
  );

  const renderOptions = state.active && (state.showStructureChoices || state.selectedStructure);

  return (
    <Fragment>
      {state.submitResponse && (
        <SubmitNotice>
          <Notice
            title={
              <span>
                Your post was submitted. Read it{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/${state.submitResponse.username}/decisions/${state.submitResponse.id}`}
                >
                  <u>here</u>
                </a>
              </span>
            }
            onDismiss={() => dispatch({type: COMPOSER_ACTIONS.COMPOSER_SUBMIT_NOTICE_DISMISS})}
          />
        </SubmitNotice>
      )}
      <Container
        innerRef={containerEl}
        narrow={narrow}
        active={state.active}
        className={narrow ? 'composer-narrow' : ''}
      >
        {state.active &&
          state.selectedStructure &&
          state.selectedStructure !== STRUCTURE_GIVE_ADVICE && (
            <PopoverWithAnchor
              padding={0}
              placement={BOTTOM_END}
              hidden={!state.showContextMenu}
              anchor={
                <More
                  onClick={() =>
                    dispatch({
                      type: state.showContextMenu
                        ? COMPOSER_ACTIONS.COMPOSER_CONTEXT_MENU_DEACTIVATE
                        : COMPOSER_ACTIONS.COMPOSER_CONTEXT_MENU_ACTIVATE
                    })
                  }
                >
                  <MoreIcon />
                </More>
              }
            >
              <MoreLink onClick={() => dispatch({type: COMPOSER_ACTIONS.COMPOSER_RESET})}>
                Clear composer
              </MoreLink>
            </PopoverWithAnchor>
          )}
        <Content
          onClick={() => {
            if (!state.active) {
              sendAnalyticsEvent('composer_click');
              dispatch({type: COMPOSER_ACTIONS.COMPOSER_ACTIVATE});
            }
          }}
        >
          {renderOptions && (
            <Options
              innerRef={optionsEl}
              active={state.showStructureChoices}
              options={STRUCTURES}
              selectedOption={state.selectedStructure}
              onClick={structure => handleStructureChange(state, structure)}
              readOnly={Boolean(state.id)}
            />
          )}
          {(!state.active || state.selectedStructure) && (
            <UserPanel
              isActive={Boolean(state.active && state.selectedStructure)}
              placeholder={placeholder}
            />
          )}
          {state.active && state.selectedStructure && (
            <Fragment>
              {state.prompt && (
                <PromptLayout>
                  <Notice
                    theme={INLINE}
                    title={state.prompt.title}
                    source={COMPOSER_PROMPT}
                    onDismiss={handleDismissPrompt}
                    analyticsPayload={state.prompt.analyticsPayload}
                  >
                    <PromptContent>{state.prompt.message}</PromptContent>
                  </Notice>
                </PromptLayout>
              )}
              <Tools
                tools={state.tools.tools}
                fromTools={state.tools.fromTools}
                toTools={state.tools.toTools}
                structure={state.selectedStructure}
                toolError={state.tools.toolError}
                isPrivate={isPrivate}
              />
              <BaseInput
                structure={state.selectedStructure}
                textFieldEl={textFieldEl}
                value={state.rawContent}
                onChange={handleContentChange}
                showMarkdownHelp={true}
                id={state.id}
                style={{height: textAreaHeight}}
                onFocus={() => dispatch({type: COMPOSER_ACTIONS.COMPOSER_CONTENT_FOCUS, isPrivate})}
              />
              <Chips
                taggedCompany={state.taggedCompany}
                taggedStack={state.taggedStack}
                linkUrl={state.linkUrl}
                isPrivate={isPrivate}
                onLinkChange={value =>
                  dispatch({type: COMPOSER_ACTIONS.COMPOSER_LINK_CHANGE, value})
                }
                onTagCompany={company =>
                  dispatch({type: COMPOSER_ACTIONS.COMPOSER_COMPANY_CHANGE, company})
                }
                onTagStack={stack =>
                  dispatch({type: COMPOSER_ACTIONS.COMPOSER_STACK_CHANGE, stack})
                }
              />
            </Fragment>
          )}
        </Content>
        {state.active && (
          <Buttons>
            {isPrivateMode && !editMode && (
              <div>
                <PrivatePublicToggle
                  isPrivate={isPrivate}
                  setIsPrivate={setIsPrivate}
                  state={state}
                />
              </div>
            )}
            {state.showContentError && (
              <ErrorMessage data-placement={isMobile ? TOP : LEFT_START}>
                <ErrorContent>
                  <ErrorTitle>Woah! Did you mean to post so soon?</ErrorTitle>
                  Please add more detail to help your fellow developers.
                </ErrorContent>
                <ErrorArrowContainer
                  data-placement={isMobile ? TOP : LEFT_START}
                  arrowColor={ERROR_RED}
                  style={{top: isMobile ? 'auto' : 12}}
                >
                  <Arrow />
                </ErrorArrowContainer>
              </ErrorMessage>
            )}
            {!state.submitting && (
              <CancelButton
                onClick={() => {
                  dispatch({type: COMPOSER_ACTIONS.COMPOSER_DEACTIVATE});
                  onCancel && onCancel();
                }}
              >
                Cancel
              </CancelButton>
            )}
            <ShareButton
              disabled={
                state.submitting ||
                !state.selectedStructure ||
                !state.rawContent ||
                state.rawContent.length === 0 ||
                state.tools.toolError
              }
              onClick={handleShare}
            >
              {state.submitting ? <Indicator size={BUTTON} /> : state.id ? 'Save' : 'Share'}
            </ShareButton>
          </Buttons>
        )}
      </Container>
      {state.errorMessage && (
        <ErrorModal
          detail={state.errorMessage}
          onDismiss={() => dispatch({type: COMPOSER_ACTIONS.COMPOSER_SUBMIT_ERROR_DISMISS})}
        />
      )}
    </Fragment>
  );
};

Composer.propTypes = {
  placeholder: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  refetchQueries: PropTypes.array,
  onMutationUpdate: PropTypes.func,
  editMode: PropTypes.bool
};

export default compose(
  withAnalyticsPayload({type: ANALYTICS_SCOPE}),
  withPrivateMode(privateMode)
)(Composer);
