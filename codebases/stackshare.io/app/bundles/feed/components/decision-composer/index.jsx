import React, {Component} from 'react';
import {compose, Mutation} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ALABASTER, ASH, BLACK, WHITE} from '../../../../shared/style/colors';
import {BASE_TEXT, TITLE_TEXT} from '../../../../shared/style/typography';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import CancelButton from '../../../../shared/library/buttons/base/cancel';
import Notice, {INLINE} from '../../../../shared/library/notices/notice';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import Tween from '../../../../shared/library/animation/tween';
import Slide from '../../../../shared/library/animation/slide';
import {Z_INDEX} from '../../../../shared/library/overlays';
import PopularDecisions from './popular-decisions';
import MentionsWidget from './mentions-widget';
import CompanyTagWidget from './company-tag-widget';
import LinkWidget from './link-widget';
import Indicator, {BUTTON} from '../../../../shared/library/indicators/indeterminate/circular';
import {onboardingChecklist} from '../../../../data/feed/queries';
import {
  createStackDecision,
  updateStackDecision,
  setPromptInteracted
} from '../../../../data/feed/mutations';
import ErrorModal from './error-modal';
import DwellTracker from '../../../../shared/utils/dwell-tracker';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {
  FEED_CLICK_COMPOSER_HIDE_NOTICE,
  FEED_CLICK_COMPOSER_POPULAR_DECISIONS,
  FEED_CLICK_COMPOSER_SHARE_DECISION,
  FEED_FOCUS_COMPOSER,
  FEED_RESTORE_COMPOSER,
  FEED_FIRST_CHANGE_COMPOSER,
  FEED_PROMPT_SEEN,
  FEED_CLICK_DISMISS_PROMPT,
  FEED_SHOW_COMPOSER_RULE
} from '../../constants/analytics';
import {parseDecisionTags} from '../../../../data/feed/utils';
import {linkPresenter} from '../../../../shared/utils/presenters';
import {ID} from '../../../../shared/utils/graphql';
import RuleChecker from '../../../../shared/utils/rule-checker';
import animate, {scaleY} from '../../../../shared/library/animation/animate';

const NOTICE_STORAGE_KEY = 'notice';
const POPULAR_DECISIONS_STORAGE_KEY = 'popularDecisions';
const AUTOSAVE_STORAGE_KEY = 'autosave';
const TEXTAREA_HEIGHT = 136;
const MAX_TEXTAREA_HEIGHT = TEXTAREA_HEIGHT * 3;
const DISMISS_PROMPT_ORIGIN_NOTICE = 'notice';
const DISMISS_PROMPT_ORIGIN_MUTATION = 'mutation';
export const PROMPT_TYPE_DEFAULT = 'prompt';
export const PROMPT_TYPE_VENDOR = 'vendor';
export const COMPOSER_LOCATION_STACK_PROFILE = 'stack-profile';

import {
  withChecklistContext,
  SHARED_DECISION
} from '../../../../shared/enhancers/checklist-enhancer';
import {scrollIntoView} from '../../../../shared/utils/scroll';

const UPDATE_DECISION = 'update';
const CREATE_DECISION = 'create';

export const companyPresenter = (key, company) => {
  if (company) {
    return {
      [key + '.id']: company.id,
      [key + '.name']: company.name,
      [key + '.myRole']: company.myRole
    };
  }
  return {};
};

export const tagsPresenter = (key, tags) => {
  if (tags) {
    return {
      [key + '.total']: tags.length,
      [key + '.name']: tags.map(t => t.name),
      [key + '.id']: tags.map(t => t.id)
    };
  }
  return {};
};

const MIN_CONTENT_LENGTH = 300;
const CONTENT_LENGTH = 'contentLength';
const TAGS_LENGTH = 'tagsLength';

const ruleChecker = new RuleChecker([
  {
    name: CONTENT_LENGTH,
    condition: facts => `${facts.contentLength} > ${MIN_CONTENT_LENGTH}`,
    fail: () => ({
      name: CONTENT_LENGTH,
      title: 'Woah! Did you mean to post so soon?',
      message: 'Please add more detail to help your fellow developers.'
    })
  },
  {
    name: TAGS_LENGTH,
    condition: facts => `${facts.tagsLength} > 0`,
    fail: () => ({
      name: TAGS_LENGTH,
      title: 'Please tag at least one tool by typing ‘@’.',
      message: 'This is how devs can see your decision in their feed.'
    })
  }
]);

const Wrapper = glamorous.aside({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

const Container = glamorous.div(
  {
    display: 'flex',
    background: ALABASTER,
    flexDirection: 'column',
    borderRadius: 4,
    border: `1px solid ${ASH}`,
    boxShadow: `0 1px 0 0 ${ASH}`
  },
  ({vendorOverlay}) => ({
    borderTop: vendorOverlay ? 0 : `1px solid ${ASH}`,
    borderTopLeftRadius: vendorOverlay ? 0 : 4,
    borderTopRightRadius: vendorOverlay ? 0 : 4
  })
);

const Border = glamorous.div({
  border: `1px solid ${ASH}`,
  display: 'flex',
  flexDirection: 'column',
  margin: 22,
  marginBottom: 0,
  position: 'relative',
  background: WHITE
});

const Avatar = glamorous.img(
  {
    borderRadius: '50%'
  },
  ({size}) => ({width: size, height: size})
);

const ActionPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  margin: 22,
  marginTop: 12
});

const UserPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  zIndex: 1,
  height: 76,
  paddingLeft: 10,
  pointerEvents: 'none'
});

const UserPanelOverflow = glamorous.div({
  display: 'flex',
  overflow: 'visible'
});

const UserName = glamorous.div({
  ...TITLE_TEXT,
  fontSize: 18,
  letterSpacing: 0.3
});

const UserTitle = glamorous.div({
  ...BASE_TEXT,
  fontSize: 13,
  color: BLACK,
  lineHeight: 1.2
});

const PromptCopy = glamorous.span({
  ...BASE_TEXT,
  paddingBottom: 12
});

const List = glamorous.ul({
  paddingTop: 5,
  WebkitMarginAfter: 0
});

const ListItem = glamorous.li({
  lineHeight: 1.8
});

const ButtonGroup = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  justifyContent: 'flex-end',
  alignItems: 'center'
});

const NoticeContainer = glamorous.div({
  marginBottom: 15
});

const Chips = glamorous.div({
  display: 'flex',
  borderTop: `1px solid ${ASH}`,
  '> div:first-child': {
    borderRight: `1px solid ${ASH}`
  }
});

const RulesNotice = glamorous.div();

export class DecisionComposer extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    storageProvider: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    decision: PropTypes.shape({
      id: ID,
      htmlContent: PropTypes.string,
      rawContent: PropTypes.string,
      company: PropTypes.object,
      link: PropTypes.object
    }),
    prompt: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string
    }),
    refetchQueries: PropTypes.array,
    onCancelEdit: PropTypes.func,
    onDismissPrompt: PropTypes.func,
    setPromptInteracted: PropTypes.func,
    vendorOverlay: PropTypes.bool,
    showPromptOverlay: PropTypes.bool,
    checklistContext: PropTypes.object,
    location: PropTypes.string,
    updateFn: PropTypes.func,
    preventDefaultExpansion: PropTypes.bool,
    analyticsPayload: PropTypes.object,
    disableRuleChecker: PropTypes.bool
  };

  static defaultProps = {
    decision: {rawContent: '', id: null, company: null},
    checklistContext: {},
    refetchQueries: [],
    preventDefaultExpansion: false,
    disableRuleChecker: false
  };

  editMode = this.props.decision.id !== null;

  state = {
    showPrompt: this.props.prompt !== null,
    expanded: this.editMode,
    showNotice: false,
    showPopularDecisions: false,
    rawContent: this.props.decision.rawContent,
    htmlContent: this.props.decision.htmlContent,
    removeNotice: null,
    removePopularDecisions: null,
    taggedCompany: this.props.decision.company,
    saving: false,
    error: false,
    textAreaHeight: TEXTAREA_HEIGHT,
    changeEventFired: false,
    showDecisionSubmittedNotice: false,
    submittedDecisionId: '',
    linkUrl: this.props.decision.link ? this.props.decision.link.url : '',
    ruleCheckerResults: null
  };

  wrapper = null;
  assignWrapper = el => (this.wrapper = el);

  textarea = null;
  assignTextarea = el => (this.textarea = el);

  rulesNotice = null;
  assignRulesNotice = el => (this.rulesNotice = el);

  handleBlur = event => {
    if (
      this.state.expanded &&
      !this.state.showPrompt &&
      this.wrapper &&
      !this.wrapper.contains(event.target)
    ) {
      if (this.state.rawContent.length === 0) {
        this.handleDismissPopularDecisions();
        this.setState({expanded: false});
      }
    }
  };

  calculateTagsLength = content => {
    const tags = parseDecisionTags(content);
    return tags.filter(tag => tag.type === 'tool').length;
  };

  hideRules = () => {
    if (this.state.ruleCheckerResults) {
      animate([{element: this.rulesNotice, from: 1, to: 0}], 300, scaleY, () => {
        this.setState({ruleCheckerResults: null});
      });
    }
  };

  handleAddTool = () => {
    const {ruleCheckerResults} = this.state;

    if (ruleCheckerResults && ruleCheckerResults.name === TAGS_LENGTH) {
      this.hideRules();
    }
  };

  handleChange = (event, scrollHeight) => {
    const {rawContent, taggedCompany, linkUrl, ruleCheckerResults} = this.state;
    const decision = event.target.value;
    this.setState({textAreaHeight: Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT)});

    if (decision !== rawContent) {
      this.setState({rawContent: decision});

      if (
        ruleCheckerResults &&
        ruleCheckerResults.name === CONTENT_LENGTH &&
        rawContent.length > MIN_CONTENT_LENGTH
      ) {
        this.hideRules();
      }

      if (!this.editMode) {
        this.props.storageProvider.setObject(AUTOSAVE_STORAGE_KEY, {
          decision,
          taggedCompany,
          linkUrl
        });
      }
      if (!this.state.changeEventFired) {
        this.props.sendAnalyticsEvent(FEED_FIRST_CHANGE_COMPOSER, {editMode: this.editMode});
        this.setState({changeEventFired: true});
      }
    }
  };

  handleFocus = () => {
    const {storageProvider, sendAnalyticsEvent} = this.props;

    if (!this.editMode) {
      this.setState({expanded: true});

      const popularDecisionsSeenOnFirstFocus = storageProvider.getNumber(
        POPULAR_DECISIONS_STORAGE_KEY
      );
      if (!popularDecisionsSeenOnFirstFocus) {
        storageProvider.increment(POPULAR_DECISIONS_STORAGE_KEY);
        this.handleShowPopularDecisions(true);
      }
    }

    sendAnalyticsEvent(FEED_FOCUS_COMPOSER);
  };

  handleDismissNotice = () => {
    this.props.storageProvider.setItem(NOTICE_STORAGE_KEY, true);
    this.textarea.focus();
    this.setState({
      removeNotice: () => this.setState({showNotice: false, removeNotice: null})
    });
    this.props.sendAnalyticsEvent(FEED_CLICK_COMPOSER_HIDE_NOTICE);
  };

  handleDismissPopularDecisions = () => {
    this.setState({
      removePopularDecisions: () =>
        this.setState({showPopularDecisions: false, removePopularDecisions: null})
    });
    this.props.sendAnalyticsEvent(FEED_CLICK_COMPOSER_POPULAR_DECISIONS, {action: 'hide'});
  };

  handleShowPopularDecisions = (auto = false) => {
    this.setState({showPopularDecisions: true, removePopularDecisions: null});
    this.props.sendAnalyticsEvent(FEED_CLICK_COMPOSER_POPULAR_DECISIONS, {action: 'show', auto});
  };

  handleTagCompany = taggedCompany => {
    this.setState({taggedCompany});
    if (!this.editMode) {
      this.props.storageProvider.setObject(AUTOSAVE_STORAGE_KEY, {
        decision: this.state.rawContent,
        taggedCompany,
        linkUrl: this.state.linkUrl
      });
    }
  };

  handleLinkChange = linkUrl => {
    this.setState({linkUrl});
    if (!this.editMode) {
      this.props.storageProvider.setObject(AUTOSAVE_STORAGE_KEY, {
        decision: this.state.rawContent,
        taggedCompany: this.state.taggedCompany,
        linkUrl
      });
    }
  };

  buildAnalyticsPayload = () => {
    const {rawContent, linkUrl} = this.state;
    const tags = parseDecisionTags(rawContent);
    return {
      rawContent,
      ...tagsPresenter('taggedTools', tags.filter(t => t.type === 'tool')),
      ...tagsPresenter('taggedTopics', tags.filter(t => t.type === 'topic')),
      ...companyPresenter('taggedCompany', this.state.taggedCompany),
      ...linkPresenter('taggedLink', linkUrl)
    };
  };

  handleShareDecision = mutateFunc => {
    const {onDismissPrompt, sendAnalyticsEvent, disableRuleChecker} = this.props;
    const {rawContent, showNotice, showPrompt} = this.state;

    if (disableRuleChecker) {
      this.shareDecision(mutateFunc);
    } else {
      const ruleCheckerResults = ruleChecker.check({
        contentLength: rawContent.length,
        tagsLength: this.calculateTagsLength(rawContent)
      });

      if (ruleCheckerResults) {
        if (showPrompt) {
          this.setState({showPrompt: false});
          onDismissPrompt();
        }

        if (showNotice) this.handleDismissNotice();

        this.setState({ruleCheckerResults});
        animate([{element: this.rulesNotice, from: 0, to: 1}], 300, scaleY);
        this.textarea.focus();
        sendAnalyticsEvent(FEED_SHOW_COMPOSER_RULE, {
          ruleName: ruleCheckerResults.name,
          ...this.buildAnalyticsPayload()
        });
      } else {
        ruleChecker.reset();
        this.hideRules();
        this.shareDecision(mutateFunc);
      }
    }
  };

  shareDecision = mutateFunc => {
    const {
      decision,
      sendAnalyticsEvent,
      storageProvider,
      onCancelEdit,
      analyticsPayload,
      currentUser
    } = this.props;
    const stackDecisionId = decision.id;
    const {rawContent, saving, taggedCompany, linkUrl} = this.state;
    const stackIdentifier =
      analyticsPayload && analyticsPayload.stackIdentifier
        ? analyticsPayload.stackIdentifier
        : null;
    if (saving || rawContent.length === 0) {
      return;
    }
    this.setState({saving: true});
    const companyId = taggedCompany ? taggedCompany.id : null;
    const payload = {
      success: true,
      ...this.buildAnalyticsPayload()
    };

    mutateFunc({variables: {rawContent, companyId, linkUrl, stackDecisionId, stackIdentifier}})
      .then(() => {
        sendAnalyticsEvent(FEED_CLICK_COMPOSER_SHARE_DECISION, payload);
        if (onCancelEdit) {
          onCancelEdit();
          return;
        }
        if (currentUser && currentUser.decisionPrompt && currentUser.decisionPrompt.active) {
          this.handleDismissPrompt(DISMISS_PROMPT_ORIGIN_MUTATION);
        }
        this.setState({
          rawContent: '',
          saving: false,
          expanded: false,
          linkUrl: '',
          showDecisionSubmittedNotice: 'true'
        });
        this.handleDismissPopularDecisions();
        storageProvider.removeItem(AUTOSAVE_STORAGE_KEY);
      })
      .catch(err => {
        sendAnalyticsEvent(FEED_CLICK_COMPOSER_SHARE_DECISION, {
          ...payload,
          success: false,
          error: err.message
        });
        this.setState({
          saving: false,
          error: err.message
        });
      });
  };

  handleDismissError = () => this.setState({error: false});

  handleDismissDecisionSubmittedNotice = () => this.setState({showDecisionSubmittedNotice: false});

  prePopulatedContent = () => {
    const {currentUser} = this.props;
    const {
      promptType,
      selectedTool: {name, id}
    } = currentUser.decisionPrompt;
    if (promptType === PROMPT_TYPE_DEFAULT) {
      return `I use @{${name}}|tool:${id}| because `;
    } else if (promptType === PROMPT_TYPE_VENDOR) {
      return `I use @{${name}}|tool:${id}| because `;
    }
  };

  componentDidUpdate(prevProps) {
    const {
      prompt,
      decision,
      location,
      preventDefaultExpansion,
      checklistContext: {checklistAction, resetChecklistAction}
    } = this.props;

    if (!prevProps.prompt && prompt) {
      this.setPrompt();
    }

    if (location === COMPOSER_LOCATION_STACK_PROFILE) {
      if (prevProps.preventDefaultExpansion !== preventDefaultExpansion) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({expanded: !preventDefaultExpansion});
      }
      if (prevProps.decision.rawContent !== decision.rawContent) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({rawContent: decision.rawContent});
      }
      if (prevProps.decision.company !== decision.company) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({taggedCompany: decision.company});
      }
      if (prevProps.prompt !== null && prompt === null) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({rawContent: '', expanded: false});
      }
      if (
        !this.state.showPrompt &&
        prompt !== null &&
        prevProps.decision.rawContent !== decision.rawContent
      ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({showPrompt: true});
      }
    }

    if (checklistAction === SHARED_DECISION) {
      resetChecklistAction && resetChecklistAction();
      scrollIntoView(document.documentElement, this.wrapper, 100, 1000, () => {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({expanded: true});
        this.textarea.focus();
      });
    }
  }

  setPrompt = () => {
    this.dwellTracker = new DwellTracker(
      this._promptEl,
      time => {
        this.props.sendAnalyticsEvent(FEED_PROMPT_SEEN, {time});
      },
      1
    );
    this.setState({
      expanded: true,
      showPrompt: true
    });
  };

  componentDidMount() {
    const {storageProvider, sendAnalyticsEvent, prompt} = this.props;

    if (!storageProvider.getBoolean(NOTICE_STORAGE_KEY)) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({showNotice: true});
    }

    if (this.editMode) {
      // this.textarea.focus();
    } else {
      // The more you know™ - if the blur handling is done in the bubbling phase (not the capturing
      //                      phase) the component that is being tested will have already been
      //                      unmounted and thus fail the _contains_ check!
      document.addEventListener('click', this.handleBlur, true);

      const autoSaveContent = storageProvider.getObject(AUTOSAVE_STORAGE_KEY);
      if (prompt) {
        this.setPrompt();
      } else if (autoSaveContent) {
        const {decision, taggedCompany, linkUrl} = autoSaveContent;
        if (decision.length > 0) {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({
            expanded: true,
            rawContent: decision,
            taggedCompany,
            linkUrl
          });
          const tags = parseDecisionTags(decision);
          sendAnalyticsEvent(FEED_RESTORE_COMPOSER, {
            rawContent: decision,
            ...tagsPresenter('taggedTools', tags.filter(t => t.type === 'tool')),
            ...tagsPresenter('taggedTopics', tags.filter(t => t.type === 'topic')),
            ...companyPresenter('taggedCompany', taggedCompany),
            ...linkPresenter('taggedLink', linkUrl)
          });
        }
      }
    }
  }

  componentWillUnmount() {
    !this.editMode && document.removeEventListener('click', this.handleBlur, true);
  }

  handleDismissPrompt = eventOrigin => {
    const {onDismissPrompt, setPromptInteracted, location} = this.props;
    const {rawContent} = this.state;
    let newState;
    if (location === COMPOSER_LOCATION_STACK_PROFILE) {
      this.setState({showPrompt: false});
    } else {
      if (eventOrigin === DISMISS_PROMPT_ORIGIN_NOTICE) {
        newState = {
          rawContent: rawContent === this.prePopulatedContent() ? '' : rawContent,
          expanded: true
        };
      } else if (eventOrigin === DISMISS_PROMPT_ORIGIN_MUTATION) {
        newState = {rawContent: '', expanded: false};
      }
      setPromptInteracted().then(() => {
        this.setState(newState, () => onDismissPrompt());
      });
    }
  };

  render() {
    const {
      currentUser,
      onCancelEdit,
      vendorOverlay,
      sendAnalyticsEvent,
      showPromptOverlay,
      prompt,
      refetchQueries,
      updateFn
    } = this.props;
    const {
      showNotice,
      removeNotice,
      expanded,
      rawContent,
      showPopularDecisions,
      removePopularDecisions,
      taggedCompany,
      saving,
      error,
      textAreaHeight,
      linkUrl,
      ruleCheckerResults,
      submittedDecisionId,
      showPrompt
    } = this.state;

    const buttonText = this.editMode ? 'Save' : 'Share Decision';

    if (currentUser && currentUser.loading) {
      return null;
    }

    const mutationType = this.editMode ? UPDATE_DECISION : CREATE_DECISION;
    const mutationQuery = this.editMode ? updateStackDecision : createStackDecision;

    return (
      <Mutation
        mutation={mutationQuery}
        refetchQueries={[{query: onboardingChecklist}].concat(refetchQueries)}
        update={(store, {data: {upsertStackDecision}}) => {
          updateFn && updateFn(store, upsertStackDecision);
          if (mutationType === CREATE_DECISION) {
            this.setState({submittedDecisionId: upsertStackDecision.id});
          }
        }}
      >
        {mutateFunc => (
          <Wrapper
            innerRef={this.assignWrapper}
            style={{zIndex: prompt && showPromptOverlay ? Z_INDEX : 'auto'}}
          >
            {this.state.showDecisionSubmittedNotice && (
              <NoticeContainer>
                <Notice
                  title={
                    <span>
                      Your post was submitted. Read it{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/${currentUser &&
                          currentUser.username}/decisions/${submittedDecisionId}`}
                      >
                        <u>here</u>
                      </a>
                    </span>
                  }
                  onDismiss={this.handleDismissDecisionSubmittedNotice}
                />
              </NoticeContainer>
            )}
            <Container vendorOverlay={vendorOverlay}>
              <Border>
                <Tween active={expanded}>
                  {tween => (
                    <UserPanelOverflow style={{height: tween(0, 76)}}>
                      {currentUser && !currentUser.loading && (
                        <UserPanel>
                          <Avatar
                            src={currentUser.imageUrl}
                            alt={`Avatar of ${currentUser.displayName}`}
                            size={tween(34, 50)}
                          />
                          <div style={{marginLeft: tween(50, 10), opacity: tween(0, 1)}}>
                            <UserName>{currentUser.displayName}</UserName>
                            <UserTitle>
                              {currentUser.title}{' '}
                              {currentUser.title && currentUser.companyName ? 'at' : ''}{' '}
                              {currentUser.companyName}
                            </UserTitle>
                          </div>
                        </UserPanel>
                      )}
                    </UserPanelOverflow>
                  )}
                </Tween>
                {prompt && showPrompt && expanded && (
                  <Slide>
                    <Notice
                      theme={INLINE}
                      title={prompt.title}
                      onDismiss={() => {
                        sendAnalyticsEvent(FEED_CLICK_DISMISS_PROMPT);
                        this.handleDismissPrompt(DISMISS_PROMPT_ORIGIN_NOTICE);
                      }}
                    >
                      <PromptCopy innerRef={el => (this._promptEl = el)}>
                        {prompt.message}
                      </PromptCopy>
                    </Notice>
                  </Slide>
                )}
                {showNotice && !prompt && !this.editMode && expanded && (
                  <Slide onExit={removeNotice}>
                    <Notice
                      theme={INLINE}
                      title="You are sharing a Decision!"
                      onDismiss={this.handleDismissNotice}
                    >
                      <span>
                        Here are some ideas to get you started with your first decision post:
                      </span>
                      <List>
                        <ListItem>Describe your goal or the problem you needed to solve</ListItem>
                        <ListItem>
                          Tag the tools you selected and any alternatives you considered
                        </ListItem>
                        <ListItem>Explain the technical decision you made and why</ListItem>
                      </List>
                    </Notice>
                  </Slide>
                )}
                {!this.editMode && expanded && (
                  <RulesNotice innerRef={this.assignRulesNotice}>
                    {ruleCheckerResults && (
                      <Notice theme={INLINE} title={ruleCheckerResults.title}>
                        {ruleCheckerResults.message}
                      </Notice>
                    )}
                  </RulesNotice>
                )}
                <Tween active={expanded}>
                  {tween => (
                    <MentionsWidget
                      innerRef={this.assignTextarea}
                      style={{
                        height: tween(46, textAreaHeight),
                        fontSize: tween(16, 14),
                        paddingBottom: expanded ? 10 : 0,
                        paddingTop: tween(76 / 2 - (1.2 * 16) / 2, 10),
                        paddingLeft: tween(10 + 34 + 15, 10)
                      }}
                      onFocus={this.handleFocus}
                      placeholder={
                        expanded ? 'Add tools with @ and topics with #' : 'Share a decision'
                      }
                      value={rawContent}
                      onChange={this.handleChange}
                      onAddTool={this.handleAddTool}
                      editMode={this.editMode}
                      showMarkdownHelp={expanded}
                    />
                  )}
                </Tween>
                <Tween active={expanded}>
                  {tween => {
                    const opacity = tween(0, 1);
                    return (
                      opacity > 0 && (
                        <Chips style={{opacity, height: tween(0, 59)}}>
                          <LinkWidget onChange={this.handleLinkChange} linkUrl={linkUrl} />
                          <CompanyTagWidget
                            disabled={saving}
                            company={taggedCompany}
                            onChange={this.handleTagCompany}
                            myCompanies={
                              currentUser && !currentUser.loading ? currentUser.companies : []
                            }
                          />
                        </Chips>
                      )
                    );
                  }}
                </Tween>
              </Border>
              <ActionPanel>
                <CancelButton
                  onClick={
                    showPopularDecisions && removePopularDecisions === null
                      ? this.handleDismissPopularDecisions
                      : this.handleShowPopularDecisions
                  }
                >
                  Popular decisions
                </CancelButton>
                <ButtonGroup>
                  {this.editMode && <CancelButton onClick={onCancelEdit}>Cancel</CancelButton>}
                  <SimpleButton
                    style={{marginLeft: 10}}
                    width={'11em'}
                    disabled={saving || (!rawContent || rawContent.length === 0)}
                    onClick={() => this.handleShareDecision(mutateFunc)}
                  >
                    {saving ? <Indicator size={BUTTON} /> : buttonText}
                  </SimpleButton>
                </ButtonGroup>
              </ActionPanel>
            </Container>
            {showPopularDecisions && (
              <Slide onExit={removePopularDecisions}>
                <PopularDecisions />
              </Slide>
            )}
            {error && <ErrorModal onDismiss={this.handleDismissError} detail={error} />}
          </Wrapper>
        )}
      </Mutation>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'composer'}),
  withLocalStorage('DecisionComposer', '1'),
  withChecklistContext,
  withMutation(setPromptInteracted, mutate => ({
    setPromptInteracted: () => mutate({})
  })),
  withSendAnalyticsEvent,
  withCurrentUser
)(DecisionComposer);
