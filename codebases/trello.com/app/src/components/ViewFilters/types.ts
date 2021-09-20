/* eslint-disable @trello/disallow-filenames */
import { LabelColor, LabelName } from 'app/src/components/BoardTableView/types';
import { TimelineDataQuery } from 'app/src/components/TimelineViewWrapper/TimelineDataQuery.generated';
import {
  ViewCard,
  Checklist,
} from 'app/src/components/BoardViewContext/BoardViewContext';

import {
  CompleteFilter,
  DueFilter,
  MembersFilter,
  LabelsFilter,
} from './filters';

import { TitleFilter } from './TitleFilter';

type Board = NonNullable<TimelineDataQuery['board']>;
export type BoardPlugins = Board['boardPlugins'];
export type Card = Board['cards'][number];
export type CalendarCard = ViewCard;

export type ChecklistItem = Checklist['checkItems'][number];
export type CustomFields = Board['customFields'];
export type CustomField = CustomFields[number];
export type CustomFieldItem = Card['customFieldItems'][number];

export interface LabelType {
  color: LabelColor;
  name: LabelName;
}

export enum FilterMode {
  And,
  Or,
}

export interface FilterableCard {
  idMembers: string[];
  labels: LabelType[];
  due: Date | null;
  complete: CompleteFilter;
  words: string[];
}

export interface ViewsFilters {
  members: MembersFilter;
  labels: LabelsFilter;
  due: DueFilter;
  title: TitleFilter;
  mode?: FilterMode;
}
