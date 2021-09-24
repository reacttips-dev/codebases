import PropTypes from 'prop-types';
import {ID} from '../../utils/graphql';
import {
  PROMPT_TYPE_EMAIL,
  PROMPT_TYPE_STACK_DECISION,
  PROMPT_TYPE_VENDOR,
  TOOL_LIST_DEFAULT,
  TOOL_LIST_FROM,
  TOOL_LIST_TO
} from './constants';

export const PostType = PropTypes.shape({
  id: ID,
  htmlContent: PropTypes.string,
  rawContent: PropTypes.string,
  company: PropTypes.object,
  link: PropTypes.object,
  tools: PropTypes.array,
  decisionType: PropTypes.string.isRequired,
  prompt: PropTypes.shape({
    promptId: PropTypes.any,
    promptType: PropTypes.oneOf([
      PROMPT_TYPE_VENDOR,
      PROMPT_TYPE_EMAIL,
      PROMPT_TYPE_STACK_DECISION
    ]),
    title: PropTypes.string,
    message: PropTypes.string
  })
});

export const ToolListType = PropTypes.oneOf([TOOL_LIST_FROM, TOOL_LIST_TO, TOOL_LIST_DEFAULT]);
