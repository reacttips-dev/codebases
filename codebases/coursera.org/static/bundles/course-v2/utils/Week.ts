/* eslint-disable import/prefer-default-export */

import _ from 'underscore';

import { Week } from 'bundles/course-v2/types/Week';
import { Item } from 'bundles/course-v2/types/Item';

import { getGradableItemsWithoutHonorsInModule } from 'bundles/course-v2/utils/Module';

export function getGradableItemsWithoutHonors(week: Week): Array<Item> {
  return _(week.modules)
    .chain()
    .map((module) => getGradableItemsWithoutHonorsInModule(module))
    .flatten()
    .value();
}
