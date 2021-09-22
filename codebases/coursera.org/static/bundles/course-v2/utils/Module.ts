import _ from 'underscore';

import { Module } from 'bundles/course-v2/types/Week';
import { Item } from 'bundles/course-v2/types/Item';

import { getIsGradable, getIsHonors, getIsOptional } from 'bundles/course-v2/utils/Item';

export function getGradableItemsWithoutHonorsInModule(module: Module): Array<Item> {
  return _(module.items).filter((item) => getIsGradable(item) && !getIsHonors(item));
}

export function getGradableItemsWithoutHonorsAndOptionalsInModule(module: Module): Array<Item> {
  return _(module.items).filter((item) => getIsGradable(item) && !getIsHonors(item) && !getIsOptional(item));
}

export function hasGradableItemsOnly(module: Module): boolean {
  return !_(module.items).find((item) => !getIsGradable(item));
}
