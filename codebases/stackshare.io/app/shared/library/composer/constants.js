import React from 'react';
import AdviceIcon from '../../library/icons/option/advice.svg';
import ToolIcon from '../../library/icons/option/tool.svg';
import MigrationIcon from '../../library/icons/option/migration.svg';
import ProtipIcon from '../../library/icons/option/protip.svg';
import FreeformIcon from '../../library/icons/option/freeform.svg';

export const IMAGE_TYPE_STACK = 'stack';
export const IMAGE_TYPE_USER = 'user';
export const IMAGE_TYPE_COMPANY = 'company';
export const STACK_OWNER_TYPE_COMPANY = 'Company';
export const STACK_OWNER_TYPE_USER = 'User';

export const PROMPT_TYPE_VENDOR = 'vendor';
export const PROMPT_TYPE_EMAIL = 'prompt';
export const PROMPT_TYPE_STACK_DECISION = 'stack-decision';

export const STRUCTURE_GET_ADVICE = 'getAdvice';
export const STRUCTURE_GIVE_ADVICE = 'giveAdvice';
export const STRUCTURE_TOOL = 'tool';
export const STRUCTURE_MIGRATION = 'migration';
export const STRUCTURE_PROTIP = 'protip';
export const STRUCTURE_FREEFORM = 'freeform';

export const TOOL_LIST_FROM = 'from';
export const TOOL_LIST_TO = 'to';
export const TOOL_LIST_TO_FROM = 'to_from';
export const TOOL_LIST_DEFAULT = 'default';

export const PLACEHOLDER_INACTIVE = 'Get advice or share a decision';
export const PLACEHOLDER_CONTENT =
  'Add details about your post. Tag more tools with @ and tag topics with #.';

export const STRUCTURE_CHANGE_CONFIRMATION_MESSAGE =
  'Changing the post structure will clear your in-progress post.';

export const MIN_CONTENT_LENGTH = 300;

export const TEXTAREA_HEIGHT = 94;
export const MAX_TEXTAREA_HEIGHT = TEXTAREA_HEIGHT * 3;

export const STRUCTURES = [
  {
    key: STRUCTURE_GIVE_ADVICE,
    icon: null,
    title: null,
    description: null,
    splitInputsEnabled: false,
    altStyle: true,
    minToolLength: 0,
    placeholder: () => 'Recommend another tool',
    inputPlaceholder: 'Describe why you’re recommending this tool',
    splitInputs: []
  },
  {
    key: STRUCTURE_GET_ADVICE,
    icon: <AdviceIcon />,
    title: 'Get advice',
    description: 'Ask the community for tools & stack advice',
    splitInputsEnabled: false,
    altStyle: true,
    minToolLength: 2,
    maxTools: 3,
    placeholder: () => "Tool you're considering",
    inputPlaceholder: 'Describe your situation and the context for this decision',
    splitInputs: []
  },
  {
    key: STRUCTURE_TOOL,
    icon: <ToolIcon />,
    title: 'Share why you chose a tool',
    description: 'Share your process of selecting a tool in your stack',
    splitInputsEnabled: false,
    minToolLength: 1,
    placeholder: listType =>
      listType === TOOL_LIST_FROM ? `Tool you didn't choose` : 'Tool you chose',
    inputPlaceholder: 'Describe your situation and the context for this decision',
    splitInputs: []
  },
  {
    key: STRUCTURE_MIGRATION,
    icon: <MigrationIcon />,
    title: 'Share a migration you made',
    description: 'Share how and why you switched tools',
    splitInputsEnabled: false,
    minToolLength: 1,
    placeholder: listType => (listType === TOOL_LIST_FROM ? 'From this tool' : 'To this tool'),
    inputPlaceholder: 'Describe your situation and what led you to switch',
    splitInputs: []
  },
  {
    key: STRUCTURE_PROTIP,
    icon: <ProtipIcon />,
    title: 'Share a protip',
    description: 'Teach the community something new',
    splitInputsEnabled: false,
    maxTools: 5,
    minToolLength: 1,
    placeholder: () => 'Tool that your tip is about',
    inputPlaceholder: 'Share something useful that you’ve learned about a tool after using it',
    splitInputs: []
  },
  {
    key: STRUCTURE_FREEFORM,
    icon: <FreeformIcon />,
    title: 'Share something else',
    description: 'Freely share tool insights',
    splitInputsEnabled: false,
    maxTools: 5,
    minToolLength: 0,
    placeholder: () => 'Tag a tool',
    inputPlaceholder: 'Share your thoughts on this tool',
    splitInputs: []
  }
];
