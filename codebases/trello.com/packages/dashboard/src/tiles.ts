import { AdvancedDate } from './advanced-date';

export interface Tile {
  id: string;
  type: string;
  from?: AdvancedDate | null;
  pos: number;
  dateLastActivity: string;
  graph: Graph;
}

export interface Graph {
  type: string;
}

export enum GraphType {
  Bar = 'bar',
  Pie = 'pie',
  List = 'list',
}

export enum DataType {
  CardsPerList = 'cardsPerList',
  CardsPerMember = 'cardsPerMember',
  CardsPerDueDate = 'cardsPerDueDate',
  CardsPerLabel = 'cardsPerLabel',
  CardsPerListHistory = 'cardsPerListHistory',
  CardsPerLabelHistory = 'cardsPerLabelHistory',
  CardsPerMemberHistory = 'cardsPerMemberHistory',
  CardsPerDueDateHistory = 'cardsPerDueDateHistory',
}

export function updateGraphType<T extends Partial<Tile>>(
  tile: T,
  graphType: GraphType,
): T {
  return {
    ...tile,
    graph: {
      ...tile.graph,
      type: graphType,
    },
  };
}
