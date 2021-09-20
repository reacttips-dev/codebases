/* eslint-disable @trello/disallow-filenames */
import {
  BUTLER_APPLICATION_ID,
  BUTLER_POWER_UP_ID,
} from 'app/scripts/data/butler-id';

interface AppCreatorModel {
  // if exists, will be used to open Plugin
  idPlugin: string;
  // currently only for Butler - will use appCreator.icon.url in the future
  iconClass: string;
  // currently only for Butler - url from which the Plugin can be reached
  urlSuffix: string;
}

const butlerCreatorModel: AppCreatorModel = {
  idPlugin: BUTLER_POWER_UP_ID,
  iconClass: 'icon-butler-bot',
  urlSuffix: '/butler',
};

const applicationToAppCreatorModel: Record<string, AppCreatorModel> = {
  [BUTLER_APPLICATION_ID]: butlerCreatorModel,
};

export const getAppCreatorModelForApplication = (
  idApplication: string,
): AppCreatorModel => applicationToAppCreatorModel[idApplication];
