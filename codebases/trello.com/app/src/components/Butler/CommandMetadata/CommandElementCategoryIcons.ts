/* eslint-disable @trello/export-matches-filename */

import { freeze } from '@trello/objects';
import type { ActionType, TriggerType } from '@atlassian/butler-command-parser';
import { ACTION_METADATA } from './ActionMetadata';
import { TRIGGER_METADATA } from './TriggerMetadata';
import {
  CommandElementCategory as Category,
  IconComponent,
  UNKNOWN_CATEGORY,
} from './types';

import { AddIcon } from '@trello/nachos/icons/add';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { CardIcon } from '@trello/nachos/icons/card';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { CommentIcon } from '@trello/nachos/icons/comment';
import { CopyIcon } from '@trello/nachos/icons/copy';
import { DescriptionIcon } from '@trello/nachos/icons/description';
import { FilterIcon } from '@trello/nachos/icons/filter';
import { LabelIcon } from '@trello/nachos/icons/label';
import { ListIcon } from '@trello/nachos/icons/list';
import { MemberIcon } from '@trello/nachos/icons/member';
import { MoveIcon } from '@trello/nachos/icons/move';
import { RemoveIcon } from '@trello/nachos/icons/remove';
import { SparkleIcon } from '@trello/nachos/icons/sparkle';
import { EmailIcon } from '@trello/nachos/icons/email';

const ICONS = freeze<Record<Category, IconComponent>>({
  [Category.Add]: AddIcon,
  [Category.Archive]: ArchiveIcon,
  [Category.Calendar]: CalendarIcon,
  [Category.CardChanges]: CardIcon,
  [Category.CardsAndLists]: ListIcon,
  [Category.Checklists]: ChecklistIcon,
  [Category.Confetti]: SparkleIcon,
  [Category.Content]: CommentIcon,
  [Category.Copy]: CopyIcon,
  [Category.Dates]: ClockIcon,
  [Category.Email]: EmailIcon,
  [Category.Fields]: DescriptionIcon,
  [Category.Labels]: LabelIcon,
  [Category.Members]: MemberIcon,
  [Category.Move]: MoveIcon,
  [Category.Remove]: RemoveIcon,
  [Category.Sort]: FilterIcon,
});

export const getTriggerIcon = (type: TriggerType) =>
  ICONS[TRIGGER_METADATA[type]?.category ?? UNKNOWN_CATEGORY];
export const getActionIcon = (type: ActionType) =>
  ICONS[ACTION_METADATA[type]?.category ?? UNKNOWN_CATEGORY];
