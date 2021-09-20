import _ from 'underscore';

import {
  MembersFilter,
  LabelsFilter,
  DueFilter,
  CompleteFilter,
  UrlParams,
  BoardsFilter,
  ListFilter,
  SortFilter,
} from './filters';
import { TitleFilter } from './TitleFilter';
import { CardFilterCriteria } from './filters/BoardTableViewFilter';

import {
  FilterableCard,
  FilterMode,
  CustomFields,
  Card,
  ChecklistItem,
} from './types';

import { getWords } from 'app/common/lib/util/satisfies-filter';
import { CustomFieldItem } from './CustomFieldItem';

interface ViewFiltersParams {
  members?: MembersFilter;
  labels?: LabelsFilter;
  due?: DueFilter;
  title?: TitleFilter;
  mode?: FilterMode;
  boards?: BoardsFilter;
  list?: ListFilter;
  sort?: SortFilter;
}

export class ViewFilters {
  public members: MembersFilter;
  public labels: LabelsFilter;
  public due: DueFilter;
  public title: TitleFilter;
  public mode: FilterMode;
  public boards: BoardsFilter;
  public list: ListFilter;
  public sort: SortFilter;

  constructor({
    members,
    labels,
    due,
    title,
    mode,
    boards,
    list,
    sort,
  }: ViewFiltersParams = {}) {
    this.members = members || new MembersFilter();
    this.labels = labels || new LabelsFilter();
    this.due = due || new DueFilter();
    this.title = title || new TitleFilter();
    this.mode = mode !== undefined ? mode : FilterMode.Or;
    this.boards = boards || new BoardsFilter();
    this.list = list || new ListFilter();
    this.sort = sort || new SortFilter();
  }

  isFiltering() {
    return this.isNonBoardsFiltersActive() || !this.boards.isEmpty();
  }

  isNonBoardsFiltersActive() {
    return _.some([
      !this.members.isEmpty(),
      !this.labels.isEmpty(),
      !this.title.isEmpty(),
      !this.due.isEmpty(),
      !this.list.isEmpty(),
      !this.sort.isEmpty(),
    ]);
  }

  satisfiesFilter(filterable: FilterableCard): boolean {
    const isAnd = this.mode === FilterMode.And;

    if (!this.labels.satisfiesLabelsFilter(filterable.labels, isAnd)) {
      return false;
    }

    if (!this.members.satisfiesMembersFilter(filterable.idMembers, isAnd)) {
      return false;
    }

    if (
      !this.due.satisfiesDueFilter({
        due: filterable.due,
        complete: filterable.complete,
      })
    ) {
      return false;
    }

    if (!this.title.satisfiesTitleFilter(filterable.words)) {
      return false;
    }

    return true;
  }

  checkAdvancedChecklistItem({
    name,
    state,
    due,
    idMember,
  }: ChecklistItem): boolean {
    const filterableChecklistItem = {
      idMembers: idMember ? [idMember] : [],
      labels: [],
      due: due ? new Date(due) : null,
      complete:
        state === 'complete'
          ? CompleteFilter.Complete
          : CompleteFilter.Incomplete,
      words: getWords(name),
    };

    return this.satisfiesFilter(filterableChecklistItem);
  }

  checkFilterableCard(
    card: Pick<
      Card,
      'idMembers' | 'labels' | 'due' | 'dueComplete' | 'name' | 'idShort'
    > &
      Partial<Pick<Card, 'customFieldItems'>>,
    customFields: CustomFields,
    isCustomFieldsEnabled: boolean,
  ): boolean {
    const {
      idMembers,
      labels,
      due,
      dueComplete,
      name,
      idShort,
      customFieldItems,
    } = card;
    const filterableCustomFieldWords = customFieldItems?.map(
      (customFieldItem) => {
        const filterableCustomFieldItem = new CustomFieldItem(customFieldItem);

        const mappedCustomField = filterableCustomFieldItem.getCustomField(
          customFields,
        );

        if (!mappedCustomField) {
          return undefined;
        }

        return filterableCustomFieldItem.getFilterableWords(mappedCustomField);
      },
    );

    const filterableCard = {
      idMembers,
      labels: labels?.map(({ color, name }) => {
        return { color, name };
      }),
      due: due ? new Date(due) : null,
      complete: dueComplete
        ? CompleteFilter.Complete
        : CompleteFilter.Incomplete,
      words: _.chain([
        getWords(name),
        getWords(idShort?.toString()),
        isCustomFieldsEnabled ? filterableCustomFieldWords : undefined,
      ])
        .compact()
        .flatten()
        .value(),
    };

    return this.satisfiesFilter(filterableCard);
  }

  toQueryParams(): UrlParams {
    if (this.isFiltering()) {
      const queryParams: UrlParams = {};

      const { labels } = this.labels.toUrlParams();
      const { idMembers } = this.members.toUrlParams();
      const { due, dueComplete } = this.due.toUrlParams();
      const { title } = this.title.toUrlParams();
      const { idBoards } = this.boards.toUrlParams();

      if (labels) {
        queryParams.labels = labels;
      }
      if (idMembers) {
        queryParams.idMembers = idMembers;
      }
      if (due) {
        queryParams.due = due;
      }
      if (dueComplete) {
        queryParams.dueComplete = dueComplete;
      }
      if (title) {
        queryParams.title = title;
      }
      if (this.mode === FilterMode.And) {
        queryParams.mode = 'and';
      }
      if (idBoards) {
        queryParams.idBoards = idBoards;
      }

      return queryParams;
    }

    return {};
  }

  static fromQueryParams(urlParams: UrlParams) {
    const viewsFilter: ViewFilters = new ViewFilters();

    if (urlParams.mode) {
      if (urlParams.mode.toLowerCase() === 'and') {
        viewsFilter.mode = FilterMode.And;
      }
    }

    viewsFilter.due.fromUrlParams(urlParams);
    viewsFilter.members.fromUrlParams(urlParams);
    viewsFilter.labels.fromUrlParams(urlParams);
    viewsFilter.title.fromUrlParams(urlParams);
    viewsFilter.boards.fromUrlParams(urlParams);
    viewsFilter.sort.fromUrlParams(urlParams);
    viewsFilter.list.fromUrlParams(urlParams);

    return viewsFilter;
  }

  static fromSavedView(cardFilterCriteria: CardFilterCriteria): ViewFilters {
    const viewFilters: ViewFilters = new ViewFilters();

    viewFilters.boards.deserializeFromView(cardFilterCriteria);
    viewFilters.due.deserializeFromView(cardFilterCriteria);
    viewFilters.members.deserializeFromView(cardFilterCriteria);
    viewFilters.list.deserializeFromView(cardFilterCriteria);
    viewFilters.labels.deserializeFromView(cardFilterCriteria);
    viewFilters.sort.deserializeFromView(cardFilterCriteria);
    viewFilters.title.deserializeFromView(cardFilterCriteria);

    return viewFilters;
  }
}
