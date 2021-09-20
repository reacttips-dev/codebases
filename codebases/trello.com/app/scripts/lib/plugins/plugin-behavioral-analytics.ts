/* eslint-disable @typescript-eslint/no-explicit-any */

import { Analytics } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import { ModelCache } from 'app/scripts/db/model-cache';
import {
  UIEvent,
  TrackEvent,
  OperationalEvent,
} from '@atlassiansox/analytics-web-client';
import { SendViewedComponentEvent } from '@trello/atlassian-analytics/src/helpers/helperFunctions';

import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import type { Board } from 'app/scripts/models/board';

// these are a collection of wrapper functions to send events to GASv3 for plugins.
// it turns passed in board and card id into containers. Infers idOrganization from idBoard.
// common plugin and board info are put into attributes.
// but other event info like action, source, and other attrs must be passed in

interface SendPluginScreenEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  screenName: SourceType;
  attributes?: object;
}

interface SendPluginUIEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: UIEvent;
}

interface SendPluginTrackEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: TrackEvent;
}

interface SendPluginViewedComponentEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: SendViewedComponentEvent;
}

interface SendPluginOperationalEventArgs {
  idPlugin: string;
  idBoard: string;
  idCard?: string;
  event: OperationalEvent;
}

function getCommonPluginAttributes(idPlugin: string) {
  const plugin = ModelCache.get('Plugin', idPlugin);
  if (plugin) {
    return {
      powerUpId: plugin.get('id'),
      powerUpName: plugin.get('public')
        ? plugin.get('listing')?.name || plugin.get('name')
        : undefined,
      isPowerUpPublic: plugin.get('public'),
      idOrganizationOwner: plugin.get('idOrganizationOwner'),
    };
  } else {
    throw new Error(`Failed to get plugin info for ${idPlugin}`);
  }
}

function getCommonBoardAttributes(idBoard: string) {
  const board = ModelCache.get('Board', idBoard) as Board;
  if (board) {
    return {
      powerUpsCount: board.powerUpsCount(),
      limitedPowerUpsCount: board.limitedPowerUpsCount(),
      canEnableAdditionalPowerUps: board.canEnableAdditionalPowerUps(),
      boardPaidStatus: board.getPaidStatus(),
    };
  } else {
    throw new Error(`Failed to get board data for ${idBoard}`);
  }
}

function getCommonAttributes(idPlugin: string, idBoard: string) {
  const maxUserPaidStatus = Auth?.me()?.getMaxPaidStatus();
  const commonPluginAttributes = getCommonPluginAttributes(idPlugin);
  const commonBoardAttributes = getCommonBoardAttributes(idBoard);
  return {
    maxUserPaidStatus,
    ...commonBoardAttributes,
    ...commonPluginAttributes,
  };
}

function handleFailedPluginEvent(
  args:
    | SendPluginUIEventArgs
    | SendPluginTrackEventArgs
    | SendPluginScreenEventArgs
    | SendPluginViewedComponentEventArgs
    | SendPluginOperationalEventArgs,
  type:
    | 'pluginUIEvent'
    | 'pluginTrackEvent'
    | 'pluginScreenEvent'
    | 'pluginViewedComponentEvent'
    | 'pluginOperationalEvent',
  errorMessage: string,
) {
  Analytics.sendOperationalEvent({
    action: 'failed',
    actionSubject: type,
    source: 'lib:pluginBehavioralAnalytics',
    attributes: {
      errorMessage,
      sendPluginEventArgs: args,
    },
  });
}

export function sendPluginScreenEvent(args: SendPluginScreenEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, screenName, attributes } = args;
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    Analytics.sendScreenEvent({
      name: screenName,
      attributes: { ...commonAttributes, ...attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    handleFailedPluginEvent(args, 'pluginScreenEvent', error.message);
  }
}

export function sendPluginUIEvent(args: SendPluginUIEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);

    const { action, actionSubject, actionSubjectId, ...eventRest } = event;
    if (action === 'clicked' && actionSubject === 'button' && actionSubjectId) {
      Analytics.sendClickedButtonEvent({
        buttonName: actionSubjectId,
        ...eventRest,
        attributes: { ...commonAttributes, ...event.attributes },
        containers: {
          card: idCard ? { id: idCard } : undefined,
          board: { id: idBoard },
          organization: { id: idOrg },
        },
      });
    } else {
      Analytics.sendUIEvent({
        ...event,
        attributes: { ...commonAttributes, ...event.attributes },
        containers: {
          card: idCard ? { id: idCard } : undefined,
          board: { id: idBoard },
          organization: { id: idOrg },
        },
      });
    }
  } catch (error) {
    handleFailedPluginEvent(args, 'pluginUIEvent', error.message);
  }
}

export function sendPluginTrackEvent(args: SendPluginTrackEventArgs) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    Analytics.sendTrackEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    handleFailedPluginEvent(args, 'pluginTrackEvent', error.message);
  }
}

export function sendPluginOperationalEvent(
  args: SendPluginOperationalEventArgs,
) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    Analytics.sendOperationalEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    handleFailedPluginEvent(args, 'pluginOperationalEvent', error.message);
  }
}

export function sendPluginViewedComponentEvent(
  args: SendPluginViewedComponentEventArgs,
) {
  try {
    const { idPlugin, idBoard, idCard, event } = args;
    const idOrg = (ModelCache.get('Board', idBoard) as Board).get(
      'idOrganization',
    );
    const commonAttributes = getCommonAttributes(idPlugin, idBoard);
    Analytics.sendViewedComponentEvent({
      ...event,
      attributes: { ...commonAttributes, ...event.attributes },
      containers: {
        card: idCard ? { id: idCard } : undefined,
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  } catch (error) {
    handleFailedPluginEvent(args, 'pluginViewedComponentEvent', error.message);
  }
}
