import _ from 'lodash';

import BaseDiff from './baseDiff';
import { attachLines } from './algorithmUtil';

/**
 * class for handling conflict resolution and finding diff of item based on type of property
 *
 * @property {String} property - property to find diff or conflict for, for ex: name, headerData
 * @property {String} propertyName - user friendly name for property
 * @property {String} itemType - type of item, for ex: request, collection, response
 * @property {String} diffType - type of how diff is created, for ex: modified, added, deleted
 */
export class ItemArrayDiff extends BaseDiff {
  constructor (diff, itemType, property, friendlyProperty, diffType) {
    super(diff, 'table');

    this.property = property;
    this.itemType = itemType;
    this.propertyName = friendlyProperty;
    this.diffType = diffType;
    this.originalId = diff.originalId;
  }

  /**
   * Based on whether there is conflict or not, returns conflict or diff value
   */
  getDiff () {
    if (this.conflict) {
      return this.getTableConflict();
    }

    return this.getTableDiff();
  }

  /**
   * Resolves conflicts of current property based on index and type provided
   *
   * @param {String} type - type of conflict to resolve, for ex: source, dest
   * @param {Number} index - index of array for which to resolve conflict for
   */
  resolveConflict (type, index) {
    if (type === 'source') {
      this.dest[index] = this.source[index];
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }
    else if (type === 'dest') {
      this.source[index] = this.dest[index];
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }

    return this;
  }

  /**
   * Return conflicts resolved
   *
   * @description - Since we will be resolving conflicts corresponding to forked collection
   * majority of time the value of resolved conflicts will be same as source value
   */
  getResolvedConflict () {
    return (this.source || []).filter(Boolean);
  }
}

/**
 * class for handling conflict resolution and finding diff of item based on type of property
 *
 * @property {String} property - property to find diff or conflict for, for ex: name, headerData
 * @property {String} propertyName - user friendly name for property
 * @property {String} itemType - type of item, for ex: request, collection, response
 * @property {String} diffType - type of how diff is created, for ex: modified, added, deleted
 * @property {Function} parsingFunction - to used as utility function to parse renderable base, source and dest values
 */
export class ItemStringDiff extends BaseDiff {
  constructor (diff, itemType, property, friendlyProperty, diffType, parsingFunction) {
    super(diff, 'words');

    this.property = property;
    this.itemType = itemType;
    this.propertyName = friendlyProperty;
    this.diffType = diffType;
    this.originalId = diff.originalId;

    if (typeof parsingFunction === 'function') {
      if (this.conflict) {
        this.base = parsingFunction(this.base);
        this.source = parsingFunction(this.source);
        this.dest = parsingFunction(this.dest);
      }
      else {
        this.base = parsingFunction(this.base);
        this.source = parsingFunction(this.source);
      }
    }
  }

  /**
   * Based on whether there is conflict or not, returns conflict or diff value
   */
  getDiff () {
    if (this.conflict) {
      return this.getStringConflict();
    }

    return this.getStringDiff();
  }

  /**
   * Resolves conflicts of current property based on type provided
   *
   * @param {String} type - type of conflict to resolve, for ex: source, dest
   */
  resolveConflict (type) {
    if (type === 'source') {
      this.dest = this.source;
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }

    if (type === 'dest') {
      this.source = this.dest;
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }

    return this;
  }

  /**
   * Return conflicts resolved
   *
   * @description - Since we will be resolving conflicts corresponding to forked collection
   * majority of time the value of resolved conflicts will be same as source value
   */
  getResolvedConflict () {
    return this.source;
  }
}

/**
 * class for handling conflict resolution and finding diff of item based on type of property
 *
 * @property {String} property - property to find diff or conflict for, for ex: name, headerData
 * @property {String} propertyName - user friendly name for property
 * @property {String} itemType - type of item, for ex: request, collection, response
 * @property {String} diffType - type of how diff is created, for ex: modified, added, deleted
 * @property {Function} options - options specific to item property can be parsing functions or other properties
 */
export class ItemSentenceDiff extends BaseDiff {
  constructor (diff, itemType, property, friendlyProperty, diffType, options = {}) {
    super(diff, 'sentences');

    this.property = property;
    this.itemType = itemType;
    this.propertyName = friendlyProperty;
    this.diffType = diffType;
    this.options = options;
    this.originalId = diff.originalId;

    if (typeof options.parsingFunction === 'function') {
      if (this.conflict) {
        this.base = options.parsingFunction(this.base);
        this.source = options.parsingFunction(this.source);
        this.dest = options.parsingFunction(this.dest);
      }
      else {
        this.base = options.parsingFunction(this.base);
        this.source = options.parsingFunction(this.source);
      }
    }
  }

  /**
   * Based on whether there is conflict or not, returns conflict or diff value
   */
  getDiff () {
    if (this.conflict) {
      return this.getSentencesConfict();
    }

    return this.getSentencesDiff();
  }

  /**
   * Resolves conflicts of current property based on type provided
   *
   * @param {String} type - type of conflict to resolve, for ex: source, dest
   */
  resolveConflict (type) {
    if (type === 'source') {
      this.dest = this.source;
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }

    if (type === 'dest') {
      this.source = this.dest;
      this.numberOfConflicts = this.numberOfConflicts - 1;
    }

    return this;
  }

  /**
   * Return conflicts resolved
   *
   * @description - Since we will be resolving conflicts corresponding to forked collection
   * majority of time the value of resolved conflicts will be same as source value
   */
  getResolvedConflict () {
    if (this.options.idToNameMap && (this.property === 'order' || this.property === 'folders_order')) {
      if (typeof this.source !== 'string' || !this.source) {
        return [];
      }

      return this.source
        .split('\n')
        .map((itemName) => {
          return Object.keys(this.options.idToNameMap)
            .find((itemId) => { return this.options.idToNameMap[itemId] === itemName; });
        });
    }

    return this.source;
  }
}

/**
 * class for handling conflict resolution and finding diff of item based on type of property
 *
 * @property {String} property - property to find diff or conflict for, for ex: name, headerData
 * @property {String} propertyName - user friendly name for property
 * @property {String} itemType - type of item, for ex: request, collection, response
 * @property {String} diffType - type of how diff is created, for ex: modified, added, deleted
 * @property {String} [scriptType] - type of script being stored, for ex: prerequest, test
 * @property {String} [scriptId] - id of script being returned by api. this is required while resolving conflicts
 */
export class ItemScriptDiff extends BaseDiff {
  constructor (diff, itemType, property, friendlyProperty, diffType, scriptOptions) {
    super(diff, 'code');

    this.property = property;
    this.itemType = itemType;
    this.propertyName = friendlyProperty;
    this.diffType = diffType;
    this.originalId = diff.originalId;

    // script specific properties which are required to successfully reconstruct
    // the events object which will be sent to api while resolving the conflicts
    this.scriptType = _.get(scriptOptions, 'type');
    this.scriptId = _.get(scriptOptions, 'id');

    // since we are using npm module here we cannot rely on it after getting the diff first time
    this.diff = null;
  }

  /**
   * Based on whether there is conflict or not, returns conflict or diff value
   */
  getDiff () {
    if (this.diff) {
      // changed to getCodeConflict from getCodeDiff as we want to show only conflicts and not diff
      return this.getCodeConflict();
    }

    if (this.conflict) {
      this.diff = this.getCodeConflict();

      // resolving conflicts based on whatever diff is calculated to make source value
      // equal to resolved conflicts
      this.resolveConflict(null, null, this.diff);

      return this.diff;
    }

    // changed to getCodeConflict from getCodeDiff as we want to show only conflicts and not diff
    this.diff = this.getCodeConflict();

    return this.diff;
  }

  /**
   * Resolves conflicts of current property based on index and type provided
   *
   * @param {String} type - type of conflict to resolve, for ex: source, dest
   * @param {Number} index - index of array for which to resolve conflict for
   * @param {Object} uiDiff - diff returned by UI with attached index
   */
  resolveConflict (index, type, uiDiff) {
    if (!Array.isArray(uiDiff)) {
      return this;
    }

    let resolved_conflicts = [];

    // removing conflicted blocks from conflict and setting them as normal diff
    this.diff.forEach((diffBlock, arrayIndex) => {
      if (!diffBlock) {
        return;
      }
      if (diffBlock.index === index) {
        if (type === 'source') {
          (diffBlock.type === 'source') && (diffBlock.conflict = false);
          (diffBlock.type === 'dest') && (this.diff[arrayIndex] = null);

          this.numberOfConflicts = this.numberOfConflicts - 1;
        }
        else if (type === 'dest') {
          (diffBlock.type === 'dest') && (diffBlock.conflict = false);
          (diffBlock.type === 'source') && (this.diff[arrayIndex] = null);

          // since destination can have only single conflicts and we do not count
          // them as conflicts that needs to be resolved so not updating number of conflicts
          // in case of there is a single conflict
          (!diffBlock.singleConflict) && (this.numberOfConflicts = this.numberOfConflicts - 1);
        }
      }

      // once resolution is done, creating a new source based on resolved conflicts
      if (!diffBlock.conflict) {
        (diffBlock.value || []).forEach((codeLine) => {
          if (!codeLine.removed) {
            resolved_conflicts.push(codeLine.value);
          }
        });
      }
    });

    // setting the source as resolved conflicts
    this.source = resolved_conflicts.join('\n');

    // since we modified the diff, lines number will be also modified
    attachLines(this.diff);

    return this;
  }

  /**
   * Return conflicts resolved
   *
   * @description - Since we will be resolving conflicts corresponding to forked collection
   * majority of time the value of resolved conflicts will be same as source value
   */
  getResolvedConflict () {
    return this.source;
  }
}

/**
 * Intermidiate class which is used to convert the diff object returned by api into
 * a uniform structure which will be easier to render in ui
 *
 * @property {String} itemType - type of item, for ex. collection, request
 * @property {String} diffType - indicates how diff is created, for ex. created, added, modified, deleted
 * @property {Object} diff - diff object returned by api, it will look like
 *                           in case of diff -> { diff: { from: '', to: '' } }
 *                           in case of conflict -> { conflict: { base: '', source: '', dest: '' } }
 */
export default class ItemDiff {
  constructor (itemType, diffType, diff) {
    this.itemType = itemType;
    this.diffType = diffType;
    this.diff = diff;
  }

  /**
 * Since api returns both pre request script and tests as one inside one single "events" object
 * this method will parse both scripts from it and returns "ItemScriptDiff" which is easily renderable in ui
 *
 * @param {Object} diffItem - diff object returned by api for events
 * @param {String} itemType - type of item, for ex: collection, request, folder
 * @param {String} diffType - indicates how diff is generated for ex. modified, created, deleted
 * @returns {Array<ItemScriptDiff>} - array of "ItemScriptDiff" objects
 */
  parseScripts (diffItem, itemType, diffType) {
    const supportedEvents = ['test', 'prerequest'];

    let diffItemArray = [];

    if (diffItem.conflict) {
      const base = Array.isArray(_.get(diffItem, 'conflict.base.value')) ? diffItem.conflict.base.value : [],
        source = Array.isArray(_.get(diffItem, 'conflict.source.value')) ? diffItem.conflict.source.value : [],
        dest = Array.isArray(_.get(diffItem, 'conflict.dest.value')) ? diffItem.conflict.dest.value : [];

      // iterating over each event and parsing it's id, type and exec values
      // choosing the value of source since we need to show the difference relative to source
      supportedEvents.forEach((eventType) => {
        const baseEvent = base.find((scriptEvent) => { return scriptEvent.listen === eventType; }) || [],
          sourceEvent = source.find((scriptEvent) => { return scriptEvent.listen === eventType; }) || [],
          destEvent = dest.find((scriptEvent) => { return scriptEvent.listen === eventType; }) || [],
          conflictBlock = {
            conflict: {
              base: { value: (_.get(baseEvent, ['script', 'exec']) || []).join('\n') },
              source: { value: (_.get(sourceEvent, ['script', 'exec']) || []).join('\n') },
              dest: { value: (_.get(destEvent, ['script', 'exec']) || []).join('\n') }
            }
          },
          friendlyProperty = _.get(sourceEvent, 'listen') === 'prerequest' ? 'pre request script' : 'tests',
          scriptOptions = {
            id: _.get(sourceEvent, 'script.id'),
            type: _.get(sourceEvent, 'script.type')
          };

        // api returns diff regardless of values of source, base, dest
        // bailing out if all three values are same
        if (conflictBlock.conflict.base.value === conflictBlock.conflict.dest.value &&
          conflictBlock.conflict.base.value === conflictBlock.conflict.source.value) {
          return;
        }

        diffItemArray.push(
          new ItemScriptDiff(conflictBlock, itemType, eventType, friendlyProperty, diffType, scriptOptions)
        );
      });
    }
    else {
      let to = _.has(diffItem, 'diff.to') ? _.get(diffItem, 'diff.to') : _.get(diffItem, 'diff'),
        from = _.get(diffItem, 'diff.from');

      if (!Array.isArray(to)) {
        to = [];
      }

      if (!Array.isArray(from)) {
        from = [];
      }

      // iterating over each event and parse it's id, type and exec values
      // choosing the value of to since we need to show the difference relative to source
      supportedEvents.forEach((eventType) => {
        const baseEvent = from.find((scriptEvent) => { return scriptEvent.listen === eventType; }) || [],
          sourceEvent = to.find((scriptEvent) => { return scriptEvent.listen === eventType; }) || [],
          diffBlock = {
            diff: {
              from: (_.get(baseEvent, ['script', 'exec']) || []).join('\n'),
              to: (_.get(sourceEvent, ['script', 'exec']) || []).join('\n')
            },
            originalId: diffItem.originalId
          },
          friendlyProperty = _.get(sourceEvent, 'listen') === 'prerequest' ? 'pre request script' : 'tests',
          scriptOptions = {
            id: _.get(sourceEvent, 'script.id'),
            type: _.get(sourceEvent, 'script.type')
          };

        // api returns diff regardless of values of to and from
        // bailing out if both values are same
        if (diffBlock.diff.from === diffBlock.diff.to) {
          return;
        }

        diffItemArray.push(
          new ItemScriptDiff(diffBlock, itemType, eventType, friendlyProperty, diffType, scriptOptions)
        );
      });
    }

    return diffItemArray;
  }

  /**
   * Since api returns graphql body with query and variables object inside diff,
   * this function parses them to make the diff in required format for rendering.
   *
   * @param {Object} diffItem - diff object returned by api for graphlq body
   * @param {String} itemType - type of item, for ex: collection, request, folder
   * @param {String} diffType - indicates how diff is generated for ex. modified, created, deleted
   * @returns {Array<ItemScriptDiff>} - array of "ItemScriptDiff" objects
   */
  parseGraphqlBody (diffItem, itemType, diffType) {
    let diffItemArray = [];

    if (diffItem.conflict) {
      const queryConflictObject = {
          conflict: {
            base: { value: (_.get(diffItem, ['conflict', 'base', 'value', 'query']) || '') },
            source: { value: (_.get(diffItem, ['conflict', 'source', 'value', 'query']) || '') },
            dest: { value: (_.get(diffItem, ['conflict', 'dest', 'value', 'query']) || '') }
          }
        },
        variablesConflictObject = {
          conflict: {
            base: { value: (_.get(diffItem, ['conflict', 'base', 'value', 'variables']) || '') },
            source: { value: (_.get(diffItem, ['conflict', 'source', 'value', 'variables']) || '') },
            dest: { value: (_.get(diffItem, ['conflict', 'dest', 'value', 'variables']) || '') }
          }
        };

      if (variablesConflictObject.conflict.base.value !== variablesConflictObject.conflict.source.value ||
        variablesConflictObject.conflict.base.value !== variablesConflictObject.conflict.dest.value) {
        diffItemArray.push(
          new ItemScriptDiff(
            variablesConflictObject, itemType, 'graphql_variables', 'Graphql Variables', diffType, null
          )
        );
      }

      if (queryConflictObject.conflict.base.value !== queryConflictObject.conflict.source.value ||
        queryConflictObject.conflict.base.value !== queryConflictObject.conflict.dest.value) {
        diffItemArray.push(
          new ItemScriptDiff(queryConflictObject, itemType, 'graphql_query', 'Graphql Query', diffType, null)
        );
      }
    }
    else {
      const variablesDiffObject = {
          diff: {
            from: (_.get(diffItem, ['diff', 'from', 'variables']) || ''),
            to: (_.get(diffItem, ['diff', 'to', 'variables']) || '')
          },
          originalId: diffItem.originalId
        },
        queryDiffObject = {
          diff: {
            from: (_.get(diffItem, ['diff', 'from', 'query']) || ''),
            to: (_.get(diffItem, ['diff', 'to', 'query']) || '')
          },
          originalId: diffItem.originalId
        };

      if (variablesDiffObject.diff.from !== variablesDiffObject.diff.to) {
        diffItemArray.push(
          new ItemScriptDiff(variablesDiffObject, itemType, 'variables', 'Graphql Variables', diffType, null)
        );
      }

      if (queryDiffObject.diff.from !== queryDiffObject.diff.to) {
        diffItemArray.push(
          new ItemScriptDiff(queryDiffObject, itemType, 'query', 'Graphql Query', diffType, null)
        );
      }
    }

    return diffItemArray;
  }

  /**
 * Since api returns only Ids of items whose order has changed inside common schema and
 * name of them as seperate key "name". parsing those seperately here
 *
 * @param {Object} diffItem - diff object returned by api for events
 * @param {String} itemType - type of item, for ex: collection, request, folder
 * @param {String} diffType - indicates how diff is generated for ex. modified, created, deleted
 * @param {String} property - property name for order
 * @param {String} friendlyProperty - user friendly property for order
 * @returns {Array<ItemSentenceDiff>} - array of "ItemSentencesDiff" objects
 */
  parseOrder (diffItem, itemType, diffType, property, friendlyProperty) {
    if (diffItem.conflict) {
      const baseDiff = (_.get(diffItem, 'conflict.base.value') || []).map((changedOrderItemId) => {
          return _.get(diffItem, ['conflict', 'base', 'name', changedOrderItemId]);
        }).join('\n'),
        sourceDiff = (_.get(diffItem, 'conflict.source.value') || []).map((changedOrderItemId) => {
          return _.get(diffItem, ['conflict', 'source', 'name', changedOrderItemId]);
        }).join('\n'),
        destDiff = (_.get(diffItem, 'conflict.dest.value') || []).map((changedOrderItemId) => {
          return _.get(diffItem, ['conflict', 'dest', 'name', changedOrderItemId]);
        }).join('\n'),
        conflictObject = {
          conflict: {
            base: { value: baseDiff },
            source: { value: sourceDiff },
            dest: { value: destDiff }
          }
        },
        idToNameMap = Object.assign(
          {},
          _.get(diffItem, 'conflict.base.name', {}),
          _.get(diffItem, 'conflict.source.name', {}),
          _.get(diffItem, 'conflict.dest.name', {})
        );

      if (!baseDiff && !sourceDiff && !destDiff) {
        return [];
      }

      return new ItemSentenceDiff(conflictObject, itemType, property, friendlyProperty, diffType, { idToNameMap });
    }

    const baseDiff = (_.get(diffItem, 'diff.from') || []).map((changedOrderItemId) => {
        return _.get(diffItem, ['diff', 'name', changedOrderItemId]);
      }).join('\n'),

      sourceDiff = (_.get(diffItem, 'diff.to') || []).map((changedOrderItemId) => {
        return _.get(diffItem, ['diff', 'name', changedOrderItemId]);
      }).join('\n'),

      diffObject = {
        diff: {
          from: baseDiff,
          to: sourceDiff
        }
      };

    if (!baseDiff && !sourceDiff) {
      return [];
    }

    return new ItemSentenceDiff(diffObject, itemType, property, friendlyProperty, diffType);
  }

  // helper function to stringify response code based on value returned by api
  parseResponseCode (itemValue) {
    if (!itemValue) {
      return '';
    }

    return `${itemValue.code || ''} ${itemValue.name || ''}`;
  }

  // helper function to stringify request object based on value returned by api
  parseRequestObject (requestObject) {
    let stringifiedRequestObject;

    try {
      stringifiedRequestObject = JSON.stringify(JSON.parse(requestObject), null, 2);
    }
    catch (e) {
      stringifiedRequestObject = '';
    }

    return stringifiedRequestObject;
  }

  // helper function to stringify auth object on value returned by api
  // this is done to show key value mapping in a text form rather than table form
  // where user could select individual keys as well
  parseAuthObject (authObject) {
    if (!authObject || authObject === '') {
      return '';
    }

    const authType = _.get(authObject, 'type');

    let authArray = [];

    authArray.push(`type: ${authType}`);

    (authObject && authObject[authType] || []).forEach((authItem) => {
      authArray.push(`${authItem.key}: ${authItem.value}`);
    });

    return authArray.join('\n');
  }

  // helper function to parse headers, queryParams etc
  parseKeyValueObject (obj) {
    if (!obj || obj === '') {
      return '';
    }

    let array = [];

    array.push('Key: Value');

    (obj || []).forEach((item) => {
      array.push(`${item.key}: ${item.value}`);
    });

    return array.join('\n');
  }

  /**
   * Since api will returns diff or conflict object in different format for each of different properties
   * this function will parse all of them and returns array of objects which are easily uniform in structure
   * and easily renderable in ui
   *
   * @param {Object} diff - diff object returned by api for events
   * @param {String} itemType - type of item, for ex: collection, request, folder
   * @param {String} diffType - indicates how diff is generated for ex. modified, created, deleted
   * @returns {Array<ItemScriptDiff|ItemArrayDiff|ItemSentenceDiff|ItemSentenceDiff>}
   */
  getPropertyWiseDiff () {
    if (!Array.isArray(this.diff)) {
      return [];
    }

    return this.diff.reduce((res, diffItem) => {
      const property = diffItem && diffItem.property;

      if (this.itemType !== 'response') {
        switch (property) {
          case 'queryParams':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'queryParams', 'query params',
              this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'variables':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'variables', 'variables', this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'headerData':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'headerData', 'headers', this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'values':
              return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'values', 'values', this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'pathVariableData':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'pathVariableData', 'path variables',
              this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'description':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'description', 'description', this.diffType));
          case 'url':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'url', 'url', this.diffType));
          case 'name':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'name', 'name', this.diffType));
          case 'dataMode':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'dataMode', 'Body Type', this.diffType));
          case 'data':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'data', 'Body (urlencoded)', this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'method':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'method', 'method', this.diffType));
          case 'events':
            return res.concat(this.parseScripts(diffItem, this.itemType, this.diffType));
          case 'rawModeData':
            return res.concat(new ItemScriptDiff(diffItem, this.itemType, 'rawModeData', 'Body (raw)', this.diffType));
          case 'graphqlModeData':
            return res.concat(this.parseGraphqlBody(diffItem, this.itemType, this.diffType) || []) || [];
          case 'auth':
            return res.concat(new ItemSentenceDiff(
              diffItem, this.itemType, 'auth', 'authorization', this.diffType, { parsingFunction: this.parseAuthObject }
            ));
          case 'order':
            return res.concat(this.parseOrder(diffItem, this.itemType, this.diffType, 'order', 'order'));
          case 'folders_order':
            return res.concat(
              this.parseOrder(diffItem, this.itemType, this.diffType, 'folders_order', 'folders order')
            );
          default:
            return res;
        }
      }
      else {
        switch (property) {
          case 'headers':
            return res.concat(new ItemSentenceDiff(diffItem, this.itemType, 'headers', 'response headers', this.diffType, { parsingFunction: this.parseKeyValueObject }));
          case 'language':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'language', 'language', this.diffType));
          case 'responseCode':
            return res.concat(
              new ItemStringDiff(diffItem, this.itemType, 'responseCode',
                'response code', this.diffType, this.parseResponseCode)
            );
          case 'text':
            return res.concat(new ItemScriptDiff(diffItem, this.itemType, 'text', 'response body', this.diffType));
          case 'name':
            return res.concat(new ItemStringDiff(diffItem, this.itemType, 'name', 'name', this.diffType));
          case 'requestObject':
            return res.concat(new ItemSentenceDiff(
              diffItem,
              this.itemType,
              'requestObject',
              'Example Request',
              this.diffType,
              { parsingFunction: this.parseRequestObject }
            ));
          default:
            return res;
        }
      }
    }, []);
  }
}
