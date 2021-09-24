import React from 'react';
import AdviceIcon from '../../icons/option/advice.svg';
import GiveAdviceIcon from '../../icons/option/give-advice.svg';
import ToolIcon from '../../icons/option/tool.svg';
import MigrationIcon from '../../icons/option/migration.svg';
import ProtipIcon from '../../icons/option/protip.svg';
import FreeformIcon from '../../icons/option/freeform.svg';

export const POST_TYPE_FREEFORM = 'freeform';
export const POST_TYPE_PROTIP = 'protip';
export const POST_TYPE_MIGRATION = 'migration';
export const POST_TYPE_TOOL = 'tool';
export const POST_TYPE_GIVE_ADVICE = 'giveAdvice';
export const POST_TYPE_GET_ADVICE = 'getAdvice';

export const CONTEXT_ITEM_TYPE_COMPANY = 'company';
export const CONTEXT_ITEM_TYPE_STACK = 'stack';

export const POST_TYPE_ICONS = {
  [POST_TYPE_FREEFORM]: <FreeformIcon />,
  [POST_TYPE_PROTIP]: <ProtipIcon />,
  [POST_TYPE_MIGRATION]: <MigrationIcon />,
  [POST_TYPE_TOOL]: <ToolIcon />,
  [POST_TYPE_GIVE_ADVICE]: <GiveAdviceIcon />,
  [POST_TYPE_GET_ADVICE]: <AdviceIcon />
};

export const POST_TYPE_DESCRIPTIONS = {
  [POST_TYPE_FREEFORM]: 'Shared insights',
  [POST_TYPE_PROTIP]: 'Shared a protip',
  [POST_TYPE_MIGRATION]: 'Migrated',
  [POST_TYPE_TOOL]: 'Chose',
  [POST_TYPE_GIVE_ADVICE]: 'Recommends',
  [POST_TYPE_GET_ADVICE]: 'Needs advice'
};
