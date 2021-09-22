import { Week } from 'bundles/course-v2/types/Week';
import { Item } from 'bundles/course-v2/types/Item';

const mapItemsWithItemIdFromWeeks = (weeks?: Week[]): { [id: string]: Item } => {
  const map = {} as { [id: string]: Item };
  if (weeks) {
    weeks.forEach((week) => {
      week.modules.forEach((module) => {
        module.items.forEach((item) => {
          map[item.id] = item;
        });
      });
    });
  }
  return map;
};

export default mapItemsWithItemIdFromWeeks;
