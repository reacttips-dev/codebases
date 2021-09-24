import {
  TYPE_ALL,
  TYPE_USER,
  TYPE_USER_DECISION,
  TYPE_SERVICE,
  TYPE_COMPANY,
  TYPE_TOOL,
  FEED,
  ITEM_TYPE_DECISIONS,
  ITEM_TYPE_ARTICLES,
  TITLE_MY_DECISIONS,
  TITLE_FEED,
  TYPE_MY_DECISION,
  TYPE_ADVICE,
  TITLE_ADVICE,
  TYPE_PRIVATE_FEED,
  TYPE_PRIVATE_ADVICE
} from '../../../data/feed/constants';
import {
  CATCH_ALL_ROUTE,
  PUBLIC_ID_CAPTURE,
  SIGN_IN_ROUTE,
  SLUG_CAPTURE
} from '../../../shared/constants/routes';
import {__REDIRECT__} from '../../../shared/enhancers/router-enhancer';

export const routes = {
  [SIGN_IN_ROUTE]: (match, props, prevRouteContext) => ({
    feedType: TYPE_ALL,
    typeSlug: '',
    ...prevRouteContext,
    signin: true
  }),
  '/feed/manage_tools$': (match, props, prevRouteContext) => ({
    feedType: TYPE_ALL,
    typeSlug: '',
    ...prevRouteContext,
    manageTools: true
  }),
  '/feed/compose$': (match, props, prevRouteContext) => ({
    feedType: TYPE_ALL,
    typeSlug: '',
    ...prevRouteContext,
    composer: true
  }),
  // Q&A Prompts
  '/feed/stackup/share$': () => ({
    feedType: TYPE_USER,
    typeSlug: '',
    showPromptOverlay: true
  }),
  // Vendor Prompts - redirects /feed/tool/toolname/share to /tool/toolname/decisions/share
  [`/feed/tool/${SLUG_CAPTURE}/share$`]: match => ({
    [__REDIRECT__]: `/${TYPE_TOOL}/${match[1].toLowerCase()}/decisions/share`
  }),
  // Vendor Prompts
  [`/tool/${SLUG_CAPTURE}/decisions/share$`]: match => ({
    feedType: TYPE_SERVICE,
    typeSlug: match[1].toLowerCase(),
    showPromptOverlay: true
  }),
  // Decision Permalinks - /[username]/decisions/[decision_id]
  [`/${SLUG_CAPTURE}/decisions/${PUBLIC_ID_CAPTURE}$`]: match => ({
    feedType: TYPE_USER_DECISION,
    typeSlug: match[1].toLowerCase(),
    decisionId: match[2]
  }),
  // My Feed (decisions only) - /feed/decisions
  // Logged Out (decisions only) - /feed/decisions
  '/feed/decisions$': (match, props) => ({
    feedType: props.userId ? TYPE_USER : TYPE_ALL,
    typeSlug: '',
    itemType: ITEM_TYPE_DECISIONS
  }),

  // User Decisions - /[username]/decisions
  [`^/${SLUG_CAPTURE}/decisions$`]: (match, props) => {
    const typeSlug = match[1].toLowerCase();
    const {idNotFound} = props;
    const routeContext = {
      feedType: typeSlug === props.userSlug ? TYPE_MY_DECISION : TYPE_USER_DECISION,
      typeSlug,
      idNotFound: idNotFound && idNotFound.type === TYPE_USER_DECISION ? idNotFound : null
    };
    if (typeSlug === props.userSlug) {
      routeContext.documentTitle = TITLE_MY_DECISIONS;
    }
    return routeContext;
  },
  // Company Decisions - /company/[company_slug]/decisions
  [`^/company/${SLUG_CAPTURE}/decisions$`]: match => ({
    feedType: TYPE_COMPANY,
    typeSlug: match[1].toLowerCase()
  }),
  // Tool Decisions - /tool/[tool_slug]/decisions
  [`/tool/${SLUG_CAPTURE}/decisions$`]: match => ({
    feedType: TYPE_SERVICE,
    typeSlug: match[1].toLowerCase()
  }),
  // Tool Decisions (will be Decisions + Articles in the future) - /tool/[tool_slug]/feed
  [`/tool/${SLUG_CAPTURE}/feed$`]: match => ({
    feedType: TYPE_SERVICE,
    typeSlug: match[1].toLowerCase()
  }),
  // /feed/tool/[tool_slug] redireccts to /tool/[tool_slug]/feed
  [`/feed/(tool|category|layer|function)/${SLUG_CAPTURE}$`]: match => {
    const type = match[1];
    const typeSlug = match[2].toLowerCase();
    if (type === TYPE_TOOL) {
      return {[__REDIRECT__]: `/${TYPE_TOOL}/${typeSlug}/${FEED}`};
    } else {
      return {
        feedType: type === TYPE_TOOL ? TYPE_SERVICE : type,
        typeSlug: typeSlug
      };
    }
  },
  // TODO: Redirect to /feed/trending (on BE),then remove route
  '/feed/all$': () => ({feedType: TYPE_ALL, typeSlug: ''}),
  // My Feed (articles + decisions) - /feed
  // Logged Out ((articles + decisions) - /feed
  '/feed$': (match, props) => {
    let feedType = TYPE_ALL;

    if (props.userId) {
      feedType = props.isPrivateMode ? TYPE_PRIVATE_FEED : TYPE_USER;
    }

    return {
      feedType: feedType,
      typeSlug: '',
      documentTitle: TITLE_FEED
    };
  },
  '/feed/public': () => {
    return {
      feedType: TYPE_USER,
      typeSlug: '',
      documentTitle: TITLE_FEED
    };
  },
  // My Feed (articles only) - /feed/articles
  // Logged Out (articles only) - /feed/articles
  '/feed/articles$': (match, props) => {
    const feedType = props.userId ? TYPE_USER : TYPE_ALL;
    return {feedType, typeSlug: '', itemType: ITEM_TYPE_ARTICLES};
  },
  // Trending Feed (articles + decisions)
  '/feed/trending$': (match, props) => ({
    feedType: TYPE_ALL,
    typeSlug: '',
    idNotFound: props.idNotFound,
    documentTitle: TITLE_FEED
  }),
  '/feed/advice/public': (match, props) => {
    if (!props.userId) {
      return {[__REDIRECT__]: '/feed/advice'};
    }

    return {
      feedType: TYPE_ADVICE,
      typeSlug: '',
      idNotFound: props.idNotFound,
      documentTitle: TITLE_ADVICE
    };
  },
  '/feed/advice': (match, props) => {
    let feedType = TYPE_ADVICE;
    if (props.userId) {
      feedType = props.isPrivateMode ? TYPE_PRIVATE_ADVICE : TYPE_ADVICE;
    }
    return {
      feedType: feedType,
      typeSlug: '',
      idNotFound: props.idNotFound,
      documentTitle: TITLE_ADVICE
    };
  },
  // Trending Feed (articles / decisions only)
  '/feed/trending/(articles|decisions)$': match => ({
    feedType: TYPE_ALL,
    typeSlug: '',
    itemType: match[1]
  }),
  [CATCH_ALL_ROUTE]: () => ({feedType: TYPE_ALL, typeSlug: ''})
};
