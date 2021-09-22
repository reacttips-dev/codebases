/**
 * Javascript client library for EPIC, the
 *
 * the Experimentation Platform and Instrumention for Coursera.
 *
 * Documentation at https://docs.dkandu.me/projects/epic.html
 *
 * Only the parameters defined in epic_site.json can be overridden.
 * Please define the parameters in the epic_site if the parameter you
 * want to experiment is not defined yet.
 *
 * Usage:
 *   import epicClient from 'bundles/epic/client';
 *   const value = epicClient.get("replace by namespace", "replace by parameter name");
 *
 * WARNING: The get function may send an impression to eventing depending on
 * whether the parameter is overridden or not. So, please make sure
 * that the returned variable is used in the following code,
 * otherwise, you might have corrupted data for your experiments.
 */

import _ from 'lodash';
import epicDefaults from 'bundles/epic/data/defaults';
import localStorageEx from 'bundles/common/utils/localStorageEx';

function parameterFullname(namespaceName: $TSFixMe, parameterName: $TSFixMe) {
  return namespaceName + ':' + parameterName;
}

const DevOverridesNotValid = Symbol('DevOverridesNotValid');

class EpicClient {
  /**
   * @return {object} a dict that maps full parameter names (keys) to
   * their default values.
   */
  static buildIndexForDefaultParameters(defaultNamespaces: $TSFixMe) {
    const parameterList = _.map(defaultNamespaces, function (defaultNamespace) {
      const namespace = defaultNamespace.name;
      return _.map(defaultNamespace.parameters, function (parameter) {
        return [parameterFullname(namespace, parameter.name), parameter.value];
      });
    });

    return _.fromPairs(
      _.flatten(parameterList) // shallow flatten
    );
  }

  static defaultIndexes = EpicClient.buildIndexForDefaultParameters(epicDefaults);

  /**
   * Construct an EpicClient instance. There should be as few as necessary.
   * Before writing code that instantiates this, see discussion at
   * https://phabricator.dkandu.me/D16465?id=58443#inline-160285
   *
   * In the non-SSR browser env there is one in the `epic/client` module
   * singleton. In SSR, there is one on the server for each request. After
   * rehydration another is made from the dehydrated state. That one is in some
   * way redundant to the module singleton, but it is needed to live within the
   * dehydrate/rehydrate flow. This isn't a problem as long as the overrides
   * are identical. (The default will be by virtue of the module loader.)
   *
   * @param {Function} eventRecordingFn takes an array of key, value pars. E.g. Multitracker.push
   * @param {Array} overrides a list of overrides, from Naptime `overrideParameters.v1` resource
   */
  constructor(eventRecordingFn: $TSFixMe, overrides: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'record' does not exist on type 'EpicClie... Remove this comment to see the full error message
    this.record = eventRecordingFn;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'overrideIndexes' does not exist on type ... Remove this comment to see the full error message
    this.overrideIndexes = this.buildIndexForOverrideParameters(overrides);

    // Memoize get so we don't emit multiple tracking events for epic.show
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_memoizedGetOrPreview' does not exist on... Remove this comment to see the full error message
    this._memoizedGetOrPreview = _.memoize(this._getOrPreview, (...args) => args.map(JSON.stringify).join('.'));
  }

  /**
   * @return {object} a dict that maps full parameter names (keys) to
   * their overridden parameters (including the values and other
   * logging information such as experiment names, etc.
   */
  buildIndexForOverrideParameters(overrideParameters: $TSFixMe) {
    return _.fromPairs(
      _.map(overrideParameters, function (overrideParameterWithId) {
        // Remove the id field, since the object will be sent to
        // Eventing, and this field in the object is useless in
        // logging and further analysis.
        // But don't delete it from the argument because it is required by Naptime.
        const overrideParameter = _.omit(overrideParameterWithId, 'id');
        return [parameterFullname(overrideParameter.namespace, overrideParameter.parameterName), overrideParameter];
      })
    );
  }

  /**
   * Returns the value of the parameter in the given namespace, if
   * the parameter is not defined in the epic_site.json file, it
   * will undefined instead.
   * Any provided tags will be recorded as part of the impression,
   * as well as used for determining which tag-targeted experiments
   * to include.
   * @param {String} namespaceName
   * @param {String} parameterName
   * @param {Object} tags A collection of String tags to be recorded, e.g. {course_id: '123'}
   * @param {Object} namespacedDefaults a mapping of default values for the particular namespace specified.
   *                                    note: this is optional during the transition to namespaced epic clients
   */
  get(namespaceName: $TSFixMe, parameterName: $TSFixMe, tags: $TSFixMe, namespacedDefaults = {}) {
    return this._memoizedGetOrPreviewWithLocalOverride(
      namespaceName,
      parameterName,
      tags,
      false /* isPreview */,
      namespacedDefaults
    );
  }

  /**
   * Returns the value of the parameter in the given namespace, if
   * the parameter is not defined in the epic_site.json file, it
   * will undefined instead.
   * No impression will be made.
   * @param {String} namespaceName
   * @param {String} parameterName
   * @param {Object} tags A collection of String tags to be recorded, e.g. {course_id: '123'}
   * @param {Object} namespacedDefaults a mapping of default values for the particular namespace specified.
   *                                    note: this is optional during the transition to namespaced epic clients
   */
  preview(namespaceName: $TSFixMe, parameterName: $TSFixMe, tags: $TSFixMe, namespacedDefaults = {}) {
    return this._memoizedGetOrPreviewWithLocalOverride(
      namespaceName,
      parameterName,
      tags,
      true /* isPreview */,
      namespacedDefaults
    );
  }

  _memoizedGetOrPreviewWithLocalOverride(
    namespaceName: $TSFixMe,
    parameterName: $TSFixMe,
    tags: $TSFixMe,
    isPreview: $TSFixMe,
    namespacedDefaults: $TSFixMe
  ) {
    // for debugging
    // TODO refactor this to not bring localStorage into clientFactory
    const devOverrides = localStorageEx.getItem(
      'EpicOverrides',
      JSON.parse,
      /* valueIfNotFound: */ undefined,
      /* valueIfNotAvailable: */ undefined,
      /* valueIfNotDeserialized: */ DevOverridesNotValid
    );
    if (devOverrides === DevOverridesNotValid) {
      // eslint-disable-next-line no-console
      console.error(
        'Your override string must be JSON in the form %c{"namespace":{"variable":<value>}}',
        'font-family:monospace;color:#111;background-color:#eee;'
      );
    } else {
      const devOverride = devOverrides?.[namespaceName]?.[parameterName];
      if (devOverride !== undefined) {
        return devOverride;
      }
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property '_memoizedGetOrPreview' does not exist on... Remove this comment to see the full error message
    return this._memoizedGetOrPreview(namespaceName, parameterName, tags, isPreview, namespacedDefaults);
  }

  /**
   * @param {String} namespaceName
   * @param {String} parameterName
   * @param {Object} tags A collection of String tags to be recorded, e.g. {course_id: '123'}
   * @param {boolean} isPreview If just previewing, don't make an impression.
   * @param {Object} namespacedDefaults a mapping of default values for the particular namespace specified.
   *                                    note: this is optional during the transition to namespaced epic clients
   */
  _getOrPreview(
    namespaceName: $TSFixMe,
    parameterName: $TSFixMe,
    tags: $TSFixMe,
    isPreview: $TSFixMe,
    namespacedDefaults: $TSFixMe
  ) {
    const fullname = parameterFullname(namespaceName, parameterName);
    const defaultValue =
      namespacedDefaults[parameterName] !== undefined
        ? namespacedDefaults[parameterName]
        : EpicClient.defaultIndexes[fullname];

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'overrideIndexes' does not exist on type ... Remove this comment to see the full error message
    let overrideValue = this.overrideIndexes[fullname];

    if (overrideValue !== undefined) {
      // we only override if there is a default value for the same
      // parameter
      if (defaultValue !== undefined) {
        // if you want to log extra information, please consider
        // changing the overrideParameter case class in the EPIC
        // service code or changing multitracker.
        if (tags && _.isObject(tags)) {
          // append tags to the overrideValue we record as part of the impression
          // but don't touch the copy in the store, in case it's accessed again later
          // with different (or no) tags
          overrideValue = _.clone(overrideValue);
          overrideValue.tags = tags;
        }

        if (overrideValue.tagTarget) {
          // tag targeting enabled
          const target = overrideValue.tagTarget;

          // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (!(tags && _.isObject(tags) && tags[target.tagName])) {
            // tag not set
            const msg = 'the experiment on ' + fullname + ' expects a ' + target.tagName + ' tag';
            console.error(msg); // eslint-disable-line no-console
            return defaultValue;
          }

          if (target.targetType === 'BLACKLIST') {
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (_.includes(target.tagValues, tags[target.tagName])) return defaultValue;
          } else if (target.targetType === 'WHITELIST') {
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!_.includes(target.tagValues, tags[target.tagName])) return defaultValue;
          }

          // at this point we have a tag match, so we know the override object
          // was cloned, so it's safe to modify
          // we strip tagTarget out because it can make the event too big
          delete overrideValue.tagTarget;
        }

        if (!isPreview) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'record' does not exist on type 'EpicClie... Remove this comment to see the full error message
          this.record(['epic.experiment.show', overrideValue]);
        }
        // TODO(zhaojun): placeholder for sending events back in the
        // format of the existing ab test framework. then, we can check
        // EPIC with the existing dashboards.
        return overrideValue.value;
      } else {
        const message = 'Attempting to override a parameter that does not exist in the default file: ' + fullname;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'record' does not exist on type 'EpicClie... Remove this comment to see the full error message
        this.record([
          'epic.client.js.error',
          {
            message,
            parameterOfMissingParameter: parameterName,
            namespaceOfMissingParameter: namespaceName,
          },
        ]);
      }
    }

    return defaultValue;
  }
}

export default EpicClient;
