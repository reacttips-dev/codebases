import {PROMPT_TYPE_STACK_DECISION, PROMPT_TYPE_VENDOR, STRUCTURE_TOOL} from '../constants';
import {PROMPT_TYPE_DEFAULT} from '../../../../bundles/feed/components/decision-composer';

const formatContentSingular = tool => `I use @{${tool.name}}|tool:${tool.id}| because `;
const formatContentPlural = tool => `We use @{${tool.name}}|tool:${tool.id}| because `;

export const buildPostForUserPrompt = user => {
  if (
    user &&
    user.decisionPrompt &&
    user.decisionPrompt.active &&
    user.decisionPrompt.selectedTool
  ) {
    const {
      decisionPrompt: {promptId, promptType, selectedTool}
    } = user;
    if (promptType === PROMPT_TYPE_DEFAULT) {
      return {
        id: null,
        decisionType: STRUCTURE_TOOL,
        toTools: [selectedTool],
        prompt: {
          title: `Thanks for recommending ${selectedTool.name}!`,
          message: `Please share how ${
            selectedTool.name
          } got into your stack, what tools you use it with (tag them with '@') and why you recommend it.  We'll show it to developers in the StackShare community making a similar decision.`,
          promptId,
          promptType
        },
        rawContent: formatContentSingular(selectedTool)
      };
    } else if (promptType === PROMPT_TYPE_VENDOR) {
      return {
        id: null,
        decisionType: STRUCTURE_TOOL,
        toTools: [selectedTool],
        prompt: {
          title: `Thanks for sharing your experience with ${selectedTool.name}!`,
          message: `Please share why you chose ${
            selectedTool.name
          } and how you use it in your stack so that the developer community can learn from your experience!`,
          promptId,
          promptType
        },
        rawContent: formatContentSingular(selectedTool)
      };
    }
  }
  return null;
};

export const buildPostForStackProfilePrompt = (tool, company) => {
  if (tool) {
    return {
      id: null,
      decisionType: STRUCTURE_TOOL,
      toTools: [tool],
      prompt: {
        title: 'Share a Stack Decision!',
        message: `Share a stack decision on why you chose ${
          tool.name
        } and how you use it in your stack!`,
        promptId: null,
        promptType: PROMPT_TYPE_STACK_DECISION
      },
      rawContent: formatContentPlural(tool),
      company
    };
  }
  return null;
};
