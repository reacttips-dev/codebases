import { ID_NONE, NO_LABELS } from 'app/common/lib/util/satisfies-filter';
import { LabelColor, LabelName } from 'app/src/components/BoardTableView/types';
import { FilterableCard } from 'app/src/components/ViewFilters/types';
import {
  BoardTableViewFilter,
  CardFilterCriteria,
} from './BoardTableViewFilter';

const setEquals = (
  set1: Set<string | null | undefined> | undefined,
  set2: Set<string | null | undefined> | undefined,
): boolean => {
  if (set1 === undefined && set2 === undefined) return true;
  else if (set1 === undefined || set2 === undefined) return false;
  return set1.size === set2.size && [...set1].every((value) => set2.has(value));
};

export class LabelsFilter
  extends Map<LabelColor, Set<LabelName>>
  implements BoardTableViewFilter {
  filterLength() {
    const labels = this.getLabelsForServer();
    return labels?.length ?? 0;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(color: LabelColor, name: LabelName) {
    return this.get(color)?.has(name) ?? false;
  }

  disable(color: LabelColor, name: LabelName) {
    const colorMap = this.get(color);

    if (colorMap?.has(name)) {
      colorMap.delete(name);
      if (colorMap.size === 0) {
        this.delete(color);
      }
    }
  }

  enable(color: LabelColor, name: LabelName) {
    const colorMap = this.get(color);
    if (colorMap) {
      colorMap.add(name);
    } else {
      this.set(color, new Set([name]));
    }
  }

  toggle(color: LabelColor, name: LabelName) {
    if (this.isEnabled(color, name)) {
      this.disable(color, name);
    } else {
      this.enable(color, name);
    }

    // Returns a new instance so that we can use it for `setState`.
    const newLabelsFilter = new LabelsFilter(this);
    return newLabelsFilter;
  }

  equals(otherFilter: LabelsFilter): boolean {
    const colors = new Set(this.keys());

    return (
      setEquals(colors, new Set(otherFilter.keys())) &&
      Array.from(colors).every((color) =>
        setEquals(this.get(color), otherFilter.get(color)),
      )
    );
  }

  satisfiesLabelsFilter(
    cardLabels: FilterableCard['labels'],
    isAnd?: boolean,
  ): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const showCardsWithNoLabels = this.isEnabled(NO_LABELS, NO_LABELS);

    if (isAnd) {
      if (showCardsWithNoLabels && this.filterLength() > 1) {
        return false;
      }

      if (showCardsWithNoLabels && cardLabels.length === 0) {
        return true;
      }

      const filterLabelStrings = this.getLabelsForServer() || [];
      const cardLabelStrings = cardLabels.map(({ color, name }) =>
        name ? `${color}:${name}` : `${color}`,
      );

      return filterLabelStrings.every((filterLabelString) =>
        cardLabelStrings.includes(filterLabelString),
      );
    } else {
      if (showCardsWithNoLabels && cardLabels.length === 0) {
        return true;
      }

      return cardLabels.some(({ color, name }) => this.isEnabled(color, name));
    }
  }

  getLabelsForServer(): string[] | null {
    const labels: string[] = [];

    for (const [color, colorMap] of this.entries()) {
      if (color === NO_LABELS) {
        labels.push(ID_NONE);
        continue;
      }
      for (const name of colorMap.values()) {
        labels.push(
          name.length
            ? `${color}:${
                // These characters have special meaning when parsing labels
                // so encode the whole name if we see any of them. The server
                // always decodes the name portion, but we avoid an extra
                // level of encoding if we can to keep the URL a little more
                // readable
                /[:,%]/.test(name) ? encodeURIComponent(name) : name
              }`
            : `${color}`,
        );
      }
    }

    if (labels.length === 0) {
      return null;
    }

    return labels;
  }

  toUrlParams(): {
    labels: string | null;
  } {
    const labels = this.getLabelsForServer()?.join(',') ?? null;
    return { labels };
  }

  fromUrlParams({ labels: labelsString }: { [key: string]: string | null }) {
    const labels = labelsString?.split(',') ?? [];

    for (const label of labels) {
      this.deserializeSingleLabel(label);
    }
  }

  private deserializeSingleLabel(labelString: string) {
    if (labelString === ID_NONE) {
      this.enable(NO_LABELS, NO_LABELS);
      return;
    }

    const [labelColor, labelName = ''] = labelString.split(':');

    this.enable(
      labelColor === 'null' ? null : labelColor,
      decodeURIComponent(labelName),
    );
  }

  serializeToView(): CardFilterCriteria {
    return { labels: this.getLabelsForServer() || [] };
  }

  deserializeFromView({ labels }: CardFilterCriteria) {
    labels?.forEach((label) => this.deserializeSingleLabel(label));
  }
}
