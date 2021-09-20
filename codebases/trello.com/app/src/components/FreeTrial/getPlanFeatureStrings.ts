import { forNamespace, forTemplate, localizeCount } from '@trello/i18n';
import { BoardIcon, GlyphProps } from '@trello/nachos/icons/board';
import { PowerUpIcon } from '@trello/nachos/icons/power-up';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { HeartIcon } from '@trello/nachos/icons/heart';
import { StarIcon } from '@trello/nachos/icons/star';
import { TableIcon } from '@trello/nachos/icons/table';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { LocationIcon } from '@trello/nachos/icons/location';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';
import { AdminChevronIcon } from '@trello/nachos/icons/admin-chevron';
import { ImageIcon } from '@trello/nachos/icons/image';
import { StickerIcon } from '@trello/nachos/icons/sticker';
import { SearchIcon } from '@trello/nachos/icons/search';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';
import { CustomFieldIcon } from '@trello/nachos/icons/custom-field';
import { BoardCollectionIcon } from '@trello/nachos/icons/board-collection';
import { DownloadIcon } from '@trello/nachos/icons/download';
import { ViewTimelineIcon } from '@trello/nachos/icons/view-timeline';
import { ViewDashboardIcon } from '@trello/nachos/icons/view-dashboard';

const format = forNamespace('upgrade-prompt-plan-selection-consolidated');
const formatTemplate = forTemplate('mini_plan_comparison');

export interface FeatureListItem {
  content: string;
  tooltip: string | null;
  icon: React.FC<GlyphProps>;
}

export const getPlanFeatureStrings = (plan: string, feature: string) => {
  const namespace = [plan, 'features', feature];
  const noToolTip =
    plan === 'free-team' ||
    feature === 'boards' ||
    (plan === 'sta-team' && feature === 'pups') ||
    (plan === 'free-team-nusku' && feature === 'pups');
  return {
    content: format([
      ...namespace,
      plan.includes('nusku') || plan.includes('bc')
        ? 'content-joined'
        : 'content',
    ]),
    tooltip: noToolTip ? null : format([...namespace, 'tooltip']),
  };
};

export const bcPlanSelectionList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'boards'),
  },
  {
    icon: PowerUpIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'pups'),
  },
  {
    icon: ButlerBotIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'butler'),
  },
  {
    icon: SubscribeIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'admin'),
  },
  {
    icon: HeartIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'support'),
  },
  {
    icon: StarIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team', 'more'),
  },
];
// exported for testing
export const nuSkuBcPlanSelectionList: FeatureListItem[] = [
  {
    icon: PowerUpIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'pups'),
  },
  {
    icon: ButlerBotIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'butler'),
  },
  {
    icon: TableIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'table'),
  },
  {
    icon: CalendarIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'calendar'),
  },
  {
    icon: LocationIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'map'),
  },

  {
    icon: ChecklistIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'checklists'),
  },
  {
    icon: TemplateBoardIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'templates'),
  },
  {
    icon: SubscribeIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'observers'),
  },
  {
    icon: AdminChevronIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'admin'),
  },
  {
    icon: HeartIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('bc-team-nusku', 'support'),
  },
];

export const premiumFeatureList: FeatureListItem[] = [
  {
    icon: ButlerBotIcon,
    content: formatTemplate(['premium', 'features', 'automations']),
    tooltip: formatTemplate(['premium', 'features', 'automations-tt']),
  },
  {
    icon: BoardCollectionIcon,
    content: formatTemplate(['premium', 'features', 'collections']),
    tooltip: formatTemplate(['premium', 'features', 'collections-tt']),
  },
  {
    icon: AdminChevronIcon,
    content: formatTemplate(['premium', 'features', 'admin-security']),
    tooltip: formatTemplate(['premium', 'features', 'admin-security-tt']),
  },
  {
    icon: DownloadIcon,
    content: formatTemplate(['premium', 'features', 'data-export']),
    tooltip: formatTemplate(['premium', 'features', 'data-export-tt']),
  },
  {
    icon: TableIcon,
    content: formatTemplate(['premium', 'features', 'table-view']),
    tooltip: formatTemplate(['premium', 'features', 'table-view-tt']),
  },
  {
    icon: ViewTimelineIcon,
    content: formatTemplate(['premium', 'features', 'timeline-view']),
    tooltip: formatTemplate(['premium', 'features', 'timeline-view-tt']),
  },
  {
    icon: ViewDashboardIcon,
    content: formatTemplate(['premium', 'features', 'dashboard-view']),
    tooltip: formatTemplate(['premium', 'features', 'dashboard-view-tt']),
  },
  {
    icon: HeartIcon,
    content: formatTemplate(['premium', 'features', 'support']),
    tooltip: formatTemplate(['premium', 'features', 'support-tt']),
  },
];

export const freeTeamSelectionList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team', 'boards'),
  },
  {
    icon: PowerUpIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team', 'pups'),
  },
  {
    icon: ButlerBotIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team', 'butler'),
  },
];

export const nuSkuFreeTeamSelectionList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team-nusku', 'boards'),
  },
  {
    icon: PowerUpIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team-nusku', 'pups'),
  },
  {
    icon: ButlerBotIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('free-team-nusku', 'butler'),
  },
];

export const freeFeatureList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    content: localizeCount('up to boards', 10),
    tooltip: null,
  },
  {
    icon: PowerUpIcon,
    content: formatTemplate(['free', 'features', 'pups']),
    tooltip: null,
  },
  {
    icon: ButlerBotIcon,
    content: formatTemplate(['free', 'features', 'automations']),
    tooltip: formatTemplate(['free', 'features', 'automations-tt']),
  },
];

export const staTeamSelectionList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'boards'),
  },
  {
    icon: PowerUpIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'pups'),
  },
  {
    icon: ButlerBotIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'butler'),
  },
  {
    icon: ImageIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'custom-backgrounds'),
  },
  {
    icon: StickerIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'custom-stickers'),
  },
  {
    icon: SearchIcon,
    // eslint-disable-next-line @trello/no-module-logic
    ...getPlanFeatureStrings('sta-team', 'saved-searches'),
  },
];

export const standardFeatureList: FeatureListItem[] = [
  {
    icon: BoardIcon,
    content: formatTemplate(['standard', 'features', 'boards']),
    tooltip: null,
  },
  {
    icon: ChecklistIcon,
    content: formatTemplate(['standard', 'features', 'checklists']),
    tooltip: formatTemplate(['standard', 'features', 'checklists-tt']),
  },
  {
    icon: ButlerBotIcon,
    content: formatTemplate(['standard', 'features', 'automations']),
    tooltip: formatTemplate(['standard', 'features', 'automations-tt']),
  },
  {
    icon: AttachmentIcon,
    content: localizeCount('file attachments', 250),
    tooltip: null,
  },
  {
    icon: SearchIcon,
    content: formatTemplate(['standard', 'features', 'searches']),
    tooltip: formatTemplate(['standard', 'features', 'searches-tt']),
  },
  {
    icon: CustomFieldIcon,
    content: formatTemplate(['standard', 'features', 'fields']),
    tooltip: formatTemplate(['standard', 'features', 'fields-tt']),
  },
];
