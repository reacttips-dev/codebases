import * as ACTIONS from './actions';
import * as contentUtils from '../content';
import {
  TOOL_LIST_DEFAULT,
  TOOL_LIST_FROM,
  STRUCTURE_GIVE_ADVICE,
  STRUCTURE_GET_ADVICE,
  STRUCTURE_MIGRATION,
  TOOL_LIST_TO,
  TOOL_LIST_TO_FROM,
  STRUCTURE_TOOL
} from '../constants';
import {passToolsCheck} from './rules';
import {taggableStack, getStructureDetails} from '../utils';

export const initTools = post => {
  let state = {
    tools: [],
    fromTools: [],
    toTools: [],
    toolError: ''
  };
  if (post) {
    post.subjectTools && (state.tools = post.subjectTools);
    post.fromTools && (state.fromTools = post.fromTools);
    post.toTools && (state.toTools = post.toTools);
  }
  return state;
};

export const promptReducer = (state, post) => {
  let newState = state;
  const cs = getStructureDetails(state.selectedStructure);
  if (
    (state.selectedStructure === STRUCTURE_GIVE_ADVICE ||
      state.selectedStructure === STRUCTURE_GET_ADVICE) &&
    cs.splitInputsEnabled &&
    !state.id
  ) {
    newState = {
      ...newState,
      rawContent: contentUtils.initSplitInputs(newState, cs.splitInputs)
    };
  }
  if (post && post.prompt && post.toTools && post.toTools.length > 0) {
    newState = {
      ...newState,
      active: true,
      selectedStructure: STRUCTURE_TOOL,
      showStructureChoices: false,
      tools: initTools(post),
      prompt: {
        title: post.prompt.title,
        message: post.prompt.message,
        analyticsPayload: {
          promptId: post.prompt.promptId,
          promptType: post.prompt.promptType,
          promptSelectedToolId: post.toTools[0].id,
          promptSelectedToolName: post.toTools[0].name
        },
        promptContent: post.rawContent // save this for comparison later
      },
      taggedCompany: post.company ? post.company : state.taggedCompany
    };
    return {
      ...newState,
      rawContent: contentUtils.reset(newState)
    };
  }
  return newState;
};

export const giveAdviceReducer = (state, post) => {
  if (post && post.decisionType === STRUCTURE_GIVE_ADVICE && post.subjectTools) {
    return {
      ...state,
      active: true,
      selectedStructure: STRUCTURE_GIVE_ADVICE,
      tools: initTools(post),
      prompt: {
        title: 'Thanks for offering to give advice!',
        message: `Select the tool you recommend and provide an explanation to help your fellow devs understand your thought process.`,
        analyticsPayload: {},
        promptContent: ''
      }
    };
  }
  return state;
};

export const resetReducer = state => {
  return {
    ...state,
    dirty: false,
    submitting: false,
    submitResponse: null,
    rawContent: contentUtils.initDefault(),
    taggedCompany: null,
    taggedStack: null,
    linkUrl: '',
    showContextMenu: false,
    showContentError: false,
    errorMessage: null,
    selectedStructure: null,
    showStructureChoices: true,
    tools: initTools()
  };
};

export const init = (props = {}) => {
  const {post, privateMode = false} = props;
  let state = {
    dirty: false,
    id: post ? post.id : null,
    parentId: post ? post.parentId : null,
    submitting: false,
    submitResponse: null,
    active: Boolean(post),
    showStructureChoices: false,
    selectedStructure: post ? post.decisionType : null,
    rawContent: contentUtils.initDefault(post),
    taggedCompany: post ? post.company : null,
    taggedStack: post && post.stack ? taggableStack(post.stack) : null,
    linkUrl: post && post.link ? post.link.url : '',
    showContextMenu: false,
    showContentError: false,
    errorMessage: null,
    scrollIntoView: 0,
    private: post ? post.private : null,
    tools: initTools(post),
    prompt: null,
    privateMode: privateMode
  };

  state = promptReducer(state, post);
  state = giveAdviceReducer(state, post);

  return state;
};

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case ACTIONS.COMPOSER_ACTIVATE:
      if (state.active) {
        return state;
      }
      return {
        ...state,
        active: true,
        showStructureChoices: !state.selectedStructure,
        showContextMenu: false
      };
    case ACTIONS.COMPOSER_ACTIVATE_WITH_STRUCTURE:
      return reducer(
        {...state, showStructureChoices: true, active: true},
        {type: ACTIONS.COMPOSER_STRUCTURE_CHANGE, structure: action.structure}
      );
    case ACTIONS.COMPOSER_DEACTIVATE:
      if (
        !state.id &&
        !contentUtils.isDirty(state) &&
        state.tools.tools.length === 0 &&
        state.tools.fromTools.length === 0 &&
        state.tools.toTools.length === 0
      ) {
        return {
          ...state,
          active: false,
          showStructureChoices: false,
          showContextMenu: false,
          showContentError: false
        };
      }
      return {...state, showContextMenu: false};
    case ACTIONS.COMPOSER_STRUCTURE_CHANGE:
      newState = {
        ...state,
        selectedStructure: action.structure,
        showStructureChoices: !state.showStructureChoices,
        showContextMenu: false,
        showContentError: false
      };

      if (state.selectedStructure !== action.structure) {
        newState.tools = initTools();
        newState.rawContent = contentUtils.transformStructure(newState, action);

        if (
          action.structure !== STRUCTURE_TOOL ||
          state.selectedStructure === STRUCTURE_GET_ADVICE
        ) {
          newState.prompt = null;
        }
        if (action.structure === STRUCTURE_GET_ADVICE) {
          newState.prompt = {
            title: 'Request advice from the community!',
            message: `Tag 2-3 tools you're comparing and explain your situation. Any developer on StackShare following or using them will see your post and be able to respond! Getting Stack Advice is still in beta so please be patient as we roll it out.`,
            analyticsPayload: {},
            promptContent: newState.rawContent // save this for comparison later
          };
        }
        if (state.selectedStructure !== null) {
          // only dirty if changing from one structure to another
          newState.dirty = true;
        }
      }
      return newState;
    case ACTIONS.COMPOSER_SUBMIT:
      if (state.submitting) {
        return state;
      }
      if (
        state.id ||
        contentUtils.passContentCheck(state, state.rawContent) ||
        state.privateMode ||
        (!state.privateMode && state.showContentError)
      ) {
        // do not check for content errors in edit mode (has id set)
        return {
          ...state,
          showContentError: false,
          showContextMenu: false,
          submitting: true
        };
      } else {
        return {
          ...state,
          showContextMenu: false,
          showContentError: true
        };
      }
    case ACTIONS.COMPOSER_SUBMIT_SUCCESS:
      return {
        ...resetReducer(state),
        showStructureChoices: false,
        submitResponse: {id: action.id, username: action.username},
        active: false
      };
    case ACTIONS.COMPOSER_SUBMIT_ERROR:
      return {
        ...state,
        errorMessage: action.message
      };
    case ACTIONS.COMPOSER_SUBMIT_ERROR_DISMISS:
      return {
        ...state,
        submitting: false,
        errorMessage: null
      };
    case ACTIONS.COMPOSER_SUBMIT_NOTICE_DISMISS:
      return {
        ...state,
        submitResponse: null
      };
    case ACTIONS.COMPOSER_CONTEXT_MENU_ACTIVATE:
      return {
        ...state,
        showContextMenu: true
      };
    case ACTIONS.COMPOSER_CONTEXT_MENU_DEACTIVATE:
      return {
        ...state,
        showContextMenu: false
      };
    case ACTIONS.COMPOSER_RESET:
      return resetReducer(state);
    case ACTIONS.COMPOSER_CONTENT_CHANGE:
      if (action.value === state.rawContent) {
        return state;
      }
      newState = {
        ...state,
        showContextMenu: false,
        rawContent: contentUtils.updateText(state, action)
      };
      if (state.showContentError && contentUtils.passContentCheck(state, newState.rawContent)) {
        newState.showContentError = false;
      }
      newState.dirty = contentUtils.isDirty(newState);
      return newState;
    case ACTIONS.COMPOSER_COMPANY_CHANGE:
      return {
        ...state,
        dirty: !(action.company && action.company.ignoreDirty),
        showContextMenu: false,
        taggedCompany: action.company
      };
    case ACTIONS.COMPOSER_STACK_CHANGE:
      return {
        ...state,
        dirty: true,
        showContextMenu: false,
        taggedStack: action.stack
      };
    case ACTIONS.COMPOSER_LINK_CHANGE:
      return {
        ...state,
        dirty: true,
        showContextMenu: false,
        linkUrl: action.value
      };
    case ACTIONS.COMPOSER_CONTENT_FOCUS:
      return {
        ...state,
        showContextMenu: false,
        tools: validateToolsReducer(state.tools, state.selectedStructure, action)
      };
    case ACTIONS.COMPOSER_TOOL_ADD:
      newState = {
        ...state,
        dirty: true,
        showContextMenu: false,
        tools: validateToolsReducer(
          updateToolsReducer(state.tools, action),
          state.selectedStructure,
          action
        )
      };
      if (!newState.id) {
        newState.rawContent = contentUtils.updateSplitInputPlaceholders(newState);
      }
      return newState;
    case ACTIONS.COMPOSER_TOOL_REMOVE:
      newState = {
        ...state,
        dirty: true,
        showContextMenu: false,
        tools: validateToolsReducer(
          updateToolsReducer(state.tools, action),
          state.selectedStructure,
          action
        )
      };
      if (!newState.id) {
        newState.rawContent = contentUtils.updateSplitInputPlaceholders(newState);
      }
      return newState;
    case ACTIONS.COMPOSER_TOOL_UNSELECT:
      newState = {
        ...state,
        dirty: true,
        showContextMenu: false,
        tools: validateToolsReducer(
          updateToolsReducer(state.tools, action),
          state.selectedStructure,
          action
        )
      };
      newState.rawContent = contentUtils.updateSplitInputPlaceholders(newState);
      return newState;
    case ACTIONS.COMPOSER_TOOL_CHOOSE:
      newState = {
        ...state,
        dirty: true,
        showContextMenu: false,
        tools: validateToolsReducer(
          updateToolsReducer(state.tools, action),
          state.selectedStructure,
          action
        )
      };
      newState.rawContent = contentUtils.updateSplitInputPlaceholders(newState);
      return newState;
    case ACTIONS.COMPOSER_PROMPT_DISMISS:
      if (state.prompt && !contentUtils.isDirty(state)) {
        // if content has not changed, reset tools and rawContent
        newState = {
          ...state,
          showContextMenu: false,
          prompt: null,
          tools: initTools()
        };
        return {
          ...newState,
          rawContent: contentUtils.reset(state)
        };
      } else {
        return {
          ...state,
          showContextMenu: false,
          prompt: null
        };
      }
    case ACTIONS.COMPOSER_POST_CHANGE:
      // only reset state if changing from a structure to nothing
      if (state.selectedStructure && !action.post) {
        return {...resetReducer(state), active: false};
      }
      return promptReducer(state, action.post);
    default:
      return state;
  }
};

const validateToolsReducer = (state, structure, action) => {
  const {isPrivate} = action;
  if (structure === STRUCTURE_MIGRATION || (isPrivate === false && structure === STRUCTURE_TOOL)) {
    const fromError = structure === !passToolsCheck(state.fromTools.length, structure);
    const toError = !passToolsCheck(state.toTools.length, structure);
    return {
      ...state,
      toolError:
        fromError && toError
          ? TOOL_LIST_TO_FROM
          : fromError
          ? TOOL_LIST_FROM
          : toError
          ? TOOL_LIST_TO
          : ''
    };
  } else if (structure === STRUCTURE_TOOL) {
    const fromError = !passToolsCheck(state.fromTools.length, structure);
    const toError = !passToolsCheck(state.toTools.length, structure);
    return {
      ...state,
      toolError: fromError && toError ? toError : ''
    };
  } else if (structure === STRUCTURE_GIVE_ADVICE) {
    const length = state.toTools.length + state.tools.filter(t => t.chosen).length;
    return {
      ...state,
      toolError: passToolsCheck(length, structure) && ''
    };
  } else {
    return {
      ...state,
      toolError: passToolsCheck(state.tools.length, structure) ? '' : TOOL_LIST_DEFAULT
    };
  }
};

const getToolListAndKey = (state, type) => {
  switch (type) {
    case TOOL_LIST_FROM:
      return [state.fromTools, 'fromTools'];
    case TOOL_LIST_TO:
      return [state.toTools, 'toTools'];
    default:
      return [state.tools, 'tools'];
  }
};

const resetChosenTools = state => {
  return {
    ...state,
    tools: state.tools
  };
};

const updateToolsReducer = (state, action) => {
  const {type, tool, listType} = action;
  const [toolList, listKey] = getToolListAndKey(state, listType);

  switch (type) {
    case ACTIONS.COMPOSER_TOOL_ADD:
      tool.chosen = true;
      return {
        ...resetChosenTools(state),
        [listKey]: [...toolList, tool]
      };
    case ACTIONS.COMPOSER_TOOL_REMOVE:
      return {
        ...state,
        [listKey]: toolList.filter(t => t.id !== tool.id)
      };
    case ACTIONS.COMPOSER_TOOL_UNSELECT:
      return {
        ...state,
        [listKey]: toolList.map(t => ({...t, chosen: t.id === tool.id ? false : t.chosen}))
      };
    case ACTIONS.COMPOSER_TOOL_CHOOSE:
      return {
        ...resetChosenTools(state),
        [listKey]: toolList.map(t => ({...t, chosen: t.id === tool.id ? true : t.chosen}))
      };
    default:
      return state;
  }
};

export default reducer;
