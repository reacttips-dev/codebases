import {
  EventContainerType,
  EventContainer,
} from '@atlassiansox/analytics-web-client';

interface InputContainerIds {
  idEnterprise?: string | null | undefined;
  idOrganization?: string | null | undefined;
  idWorkspace?: string | null | undefined;
  idBoard?: string | null | undefined;
  idList?: string | null | undefined;
  idCard?: string | null | undefined;
}

const inputToContainer: {
  [key in keyof InputContainerIds]: EventContainerType;
} = Object.freeze({
  idEnterprise: 'enterprise',
  idOrganization: 'organization',
  idWorkspace: 'workspace',
  idBoard: 'board',
  idList: 'list',
  idCard: 'card',
});

/**
 * Conveniently formats an EventContainer from common ID keys.
 *
 * @param {InputContainerIds} ids Container IDs with named keys.
 *
 * @example
 * // Creates containers structures in a single line.
 * Analytics.sendTrackEvent({
 *    action: 'created',
 *    actionSubject: 'card',
 *    containers: formatContainers({ idOrganization, idBoard }),
 * });
 * @example
 * // Formats containers with valid values.
 * formatContainers({
 *    idList: null,
 *    idCard: '5f7ca1ad307cc152471a3f2c',
 * });
 * // Outputs `{ card: { id: '5f7ca1ad307cc152471a3f2c' } }`;
 */
export const formatContainers = (ids: InputContainerIds): EventContainer =>
  Object.entries(ids).reduce((acc, [key, id]) => {
    if (!id) {
      return acc;
    }
    const container = inputToContainer[key as keyof InputContainerIds];
    if (container) {
      acc[container] = { id };
    }
    return acc;
  }, {} as EventContainer);
