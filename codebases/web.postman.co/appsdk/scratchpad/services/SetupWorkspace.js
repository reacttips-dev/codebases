import { createEvent } from '../../../js/modules/model-event';
import dispatchUserAction from '../../../js/modules/pipelines/user-action';
import CurrentUserController from '../../../js/modules/controllers/CurrentUserController';
import { observable, action } from 'mobx';
import { defaultOfflineWorkspaceId } from '../../../js/utils/default-workspace';
import { deterministicUUID } from '../../../js/utils/uuid-helper';
import { onChangesetResponse } from '../../../js/modules/services/SyncChangesetEventService';
import ThemeManager from '../../../js/controllers/theme/ThemeManager';
import initializeMigrationFirmware from '../../../js/apps/boot/bootMigrationFirmware';
import { syncAndSubscribeTimeline } from '../../../js/modules/sync-timeline-helpers';

const MAX_COUNT = {
  HISTORY: 1000,
  ENVIRONMENT: 1000,
  COLLECTION: 1000,
  HEADER_PRESET: 1000,
  COLLECTION_RUN: 1000
};

const CATEGORIES = {
  COLLECTION: 'collections',
  ENVIRONMENT: 'environments',
  GLOBALS: 'globals',
  HISTORY: 'history',
  HEADER_PRESET: 'header presets',
  COLLECTION_RUN: 'collection runs',
  SETTINGS: 'settings',
  OTHERS: 'preferences'
};

const importersMap = {
  [CATEGORIES.COLLECTION]: importCollections,
  [CATEGORIES.ENVIRONMENT]: importEnvironments,
  [CATEGORIES.HEADER_PRESET]: importHeaderPresets,
  [CATEGORIES.GLOBALS]: importGlobals,
  [CATEGORIES.HISTORY]: importHistory,
  [CATEGORIES.COLLECTION_RUN]: importCollectionRun,
  [CATEGORIES.SETTINGS]: importSettings,
  [CATEGORIES.OTHERS]: importOtherModels
};

const importOrder = [
  [CATEGORIES.SETTINGS],
  [CATEGORIES.COLLECTION],
  [CATEGORIES.ENVIRONMENT, CATEGORIES.GLOBALS, CATEGORIES.HEADER_PRESET],
  [CATEGORIES.HISTORY, CATEGORIES.COLLECTION_RUN],
  [CATEGORIES.OTHERS]
];

const DEFAULT_TIMEOUT = 60 * 1000; // 60 secs

/**
 *
 * @param {*} criteria
 */
function onChangesetResponsePromise (criteria) {
  return new Promise((res, rej) => {
    onChangesetResponse(criteria, (err) => {
      if (err) {
        rej(err);
        return;
      }

      res();
    });
  });
}

// list of models to be moved to indexeddb
let modelsToMove = [
  'oauth2accesstoken',
  'authhelperstate',
  'authsession',
  'userdata',
  'userpreference',
  'cookie',
  'runtimepreference'
];

/**
 *
 */
async function importEnvironments (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importEnvironments : started');

  let environmentCount = await pm.migrator.models.environment.count();

  if (environmentCount > MAX_COUNT.ENVIRONMENT) {
    pm.logger.info(`SetupWorkspace~importEnvironments : environment count ${environmentCount} greater than max ${MAX_COUNT.ENVIRONMENT}`);
    throw new Error('Could not import environment. You have more than ' + MAX_COUNT.ENVIRONMENT + 'items');
  }

  let user = await CurrentUserController.get();
  let environments = await pm.migrator.models.environment.find();
  let totalEnvironments = environments.length;
  let completedEnvironments = 0;

  for (let i = 0; i < environmentCount; i++) {
    let environment = environments[i],
    isErrored = false;

    environment.owner = user.id;

    try {
      await dispatchUserAction(createEvent('create', 'environment', environment, null, { workspace: workspaceId, workspaceType: workspaceType }));

      await syncAndSubscribeTimeline({ model: 'environment', modelId: `${user.id}-${environment.id}` });

      let sessions = await pm.migrator.models.variablesession.find({ model: 'environment', modelId: environment.id });

      let sessionPromises = sessions.map((session) => {
        session.workspace = workspaceId;
        session.id = `environment/${environment.id}/${workspaceId}`;

        return dispatchUserAction(createEvent('createOrUpdate', 'variablesession', session));
      });

      await Promise.allSettled(sessionPromises);

    }
    catch (e) {
      pm.logger.warn(`SetupWorkspace ~ importEnvironments : Could not complete migration for environment ${environment.id}`, e);
      isErrored = true;
    }
    finally {
      completedEnvironments++;
      setProgress(`${completedEnvironments}/${totalEnvironments}`);
    }

    if (isErrored) {
      return Promise.reject(new Error('SetupWorkspace: Errored out while importing one of the environments'));
    }
  }
}

/**
 *
 */
async function importGlobals (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importGlobals : started');

  try {
    let defaultOfflineWorkspace = await defaultOfflineWorkspaceId(),
      defaultOfflineGlobals = deterministicUUID(defaultOfflineWorkspace);

    let globals = await pm.migrator.models.globals.findOne({ id: defaultOfflineGlobals });
    let originalGlobalsId = globals.id,
      newGlobalsId = deterministicUUID(workspaceId);

    // change id to current workspace globals
    globals.workspace = workspaceId;
    globals.id = newGlobalsId;

    await dispatchUserAction(createEvent('update', 'globals', globals, null, { workspace: workspaceId, workspaceType: workspaceType }));

    syncAndSubscribeTimeline({ model: 'workspace', modelId: workspaceId });
    onChangesetResponsePromise({ model: 'globals', action: 'update', modelId: newGlobalsId });

    let sessions = await pm.migrator.models.variablesession.find({ model: 'globals', modelId: originalGlobalsId });

    let sessionPromises = sessions.map((session) => {
      session.workspace = workspaceId;
      session.id = `globals/${newGlobalsId}/${workspaceId}`;

      return dispatchUserAction(createEvent('createOrUpdate', 'variablesession', session));
    });

    return Promise.all(sessionPromises);
  }
  catch (e) {
    pm.logger.warn('SetupWorkspace ~ importGlobals : Could not complete migration for globals', e);
    throw e;
  }
  finally {
    setProgress('1/1');
  }
}

/**
 *
 */
async function importHeaderPresets (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importHeaderPresets : started');

  let hpCount = await pm.migrator.models.headerpreset.count();

  if (hpCount > MAX_COUNT.HEADER_PRESET) {
    pm.logger.info(`SetupWorkspace~importHeaderPresets : header preset count ${hpCount} greater than max ${MAX_COUNT.HEADER_PRESET}`);
    throw new Error('Could not import header preset. You have more than ' + MAX_COUNT.HEADER_PRESET + 'items');
  }

  let user = await CurrentUserController.get();
  let headerPresets = await pm.migrator.models.headerpreset.find();
  let totalHeaderPresets = headerPresets.length;
  let completedHeaderPresets = 0;

  let promises = headerPresets.map(async (headerPreset) => {

    headerPreset.owner = user.id;
    headerPreset.workspace = workspaceId;

    try {
      return dispatchUserAction(createEvent('create', 'headerpreset', headerPreset, null, { workspace: workspaceId, workspaceType: workspaceType }))
        .then(() => {
          syncAndSubscribeTimeline({ model: 'workspace', modelId: workspaceId });
          return onChangesetResponsePromise({ model: 'headerpreset', action: 'import', modelId: headerPreset.id });
        });
    }
    catch (e) {
      pm.logger.warn(`SetupWorkspace ~ importHeaderPresets : Could not complete migration for headerPreset ${headerPreset.id}`, e);
      throw e;
    }
    finally {
      completedHeaderPresets++;
      setProgress(`${completedHeaderPresets}/${totalHeaderPresets}`);
    }
  });

  return Promise.allSettled(promises)
    .then((results) => {
      _.forEach(results, (result) => {
        if (result.status === 'rejected') {
          throw new Error('Failure when importing header presets');
        }
      });
    });
}

/**
 *
 */
async function importHistory (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importHistory : started');

  let user = await CurrentUserController.get();

  let historyCount = await pm.migrator.models.history.count();

  if (historyCount > MAX_COUNT.HISTORY) {
    pm.logger.info(`SetupWorkspace~importHistory : history count ${historyCount} greater than max ${MAX_COUNT.HISTORY}`);
    throw new Error('Could not import history. You have more than ' + MAX_COUNT.HISTORY + 'items');
  }


  let historyList = await pm.migrator.models.history.find();

  let totalHistory = historyList.length;
  let completedHistory = 0;

  let promises = historyList.map(async (history) => {
    try {
      history.owner = user.id;
      history.workspace = workspaceId;

      await dispatchUserAction(createEvent('create', 'history', history, null, { workspace: workspaceId, workspaceType: workspaceType }));

      // trigger sync but don't wait
      syncAndSubscribeTimeline({ model: 'workspace', modelId: workspaceId });

      await onChangesetResponsePromise({ model: 'history', action: 'import', modelId: history.id });

      let historyResponse = await pm.migrator.models.historyresponse.findOne({ history: history.id });

      if (historyResponse) {
        await dispatchUserAction(createEvent('create', 'historyresponse', historyResponse, null, { workspace: workspaceId, workspaceType: workspaceType }));
      }

    }
    catch (e) {
      pm.logger.warn(`SetupWorkspace ~ importHistory : Could not complete migration for headerPreset ${history.id}`, e);
      throw e;
    }
    finally {
      completedHistory++;
      setProgress(`${completedHistory}/${totalHistory}`);
    }
  });

  return Promise.allSettled(promises)
    .then((results) => {
      _.forEach(results, (result) => {
        if (result.status === 'rejected') {
          throw new Error('Failure when importing history');
        }
      });
    });
}

/**
 *
 */
async function importCollectionRun (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importCollectionRun : started');

  let collectionRunCount = await pm.migrator.models.runnerrun.count();

  if (collectionRunCount > MAX_COUNT.COLLECTION) {
    pm.logger.info(`SetupWorkspace~importCollectionRun : collection run count ${collectionRunCount} greater than max ${MAX_COUNT.COLLECTION_RUN}`);
    throw new Error('Could not import collection run. You have more than ' + MAX_COUNT.COLLECTION_RUN + 'items');
  }

  let user = await CurrentUserController.get();
  let runnerRuns = await pm.migrator.models.runnerrun.find({});

  let totalRuns = runnerRuns.length;
  let completedRuns = 0;

  let promises = runnerRuns.map(async (run) => {
    try {
      run.owner = user.id;
      run.workspace = workspaceId;
      await dispatchUserAction(createEvent('create', 'runnerrun', run, null, { workspace: workspaceId, workspaceType: workspaceType }));

      let runnerEvents = await pm.migrator.models.runnerevent.find({ run: run.id });

      if (!_.isEmpty(runnerEvents)) {
        runnerEvents.forEach(async (runnerEvent) => {
          await dispatchUserAction(createEvent('create', 'runnerevent', runnerEvent, null, { workspace: workspaceId, workspaceType: workspaceType }));
        });
      }

      await dispatchUserAction(createEvent('create', 'collectionrun', run, null, { workspace: workspaceId, workspaceType: workspaceType }));
      syncAndSubscribeTimeline({ model: 'workspace', modelId: workspaceId });
      await onChangesetResponsePromise({ model: 'collectionrun', action: 'import', modelId: run.id });

    }
    catch (e) {
      pm.logger.warn(`SetupWorkspace ~ importCollectionRun : Could not complete migration for collection run ${run.id}`, e);
      throw e;
    }
    finally {
      completedRuns++;
      setProgress(`${completedRuns}/${totalRuns}`);
    }
  });

  return Promise.allSettled(promises)
    .then((results) => {
      _.forEach(results, (result) => {
        if (result.status === 'rejected') {
          throw new Error('Failure when importing collection run');
        }
      });
    });
}

/**
 *
 */
async function importCollections (setProgress, { workspaceId, workspaceType }) {

  pm.logger.info('SetupWorkspace~importCollections : started');

  let collectionCount = await pm.migrator.models.collection.count();

  if (collectionCount > MAX_COUNT.COLLECTION) {
    pm.logger.info(`SetupWorkspace~importCollections : collection count ${collectionCount} greater than max ${MAX_COUNT.COLLECTION}`);
    throw new Error('Could not import collection. You have more than ' + MAX_COUNT.COLLECTION + 'items');
  }


  let user = await CurrentUserController.get();
  let collections = await pm.migrator.models.collection.find();

  let totalCollections = collections.length;
  let completedCollections = 0;

  // JS Doesn't like async/await in callbacks
  // Stick to loops
  for (let i = 0; i < collectionCount; i++) {
    let collection = collections[i],
    isErrored = false;

    collection.owner = user.id;
    collection.uid = `${user.id}-${collection.id}`;

    try {

      let [folders, requests, responses] = await Promise.all([
        pm.migrator.models.folder.find({ collection: collection.id }),
        pm.migrator.models.request.find({ collection: collection.id }),
        pm.migrator.models.response.find({ collection: collection.id })
      ]);

      collection.folders = folders;
      collection.requests = requests;

      let reqMap = new Map();

      requests.forEach((req) => {
        reqMap.set(req.id, req);
      });

      responses.forEach((res) => {
        let request = reqMap.get(res.request);
        if (request) {
          request.responses = Array.isArray(request.responses) ? request.responses : [];

          request.responses.push(res);
        }
      });

      await dispatchUserAction(createEvent('create_deep', 'collection', { collection }, null, { workspace: workspaceId, workspaceType: workspaceType }));

      await syncAndSubscribeTimeline({ model: 'collection', modelId: collection.uid });

    }
    catch (e) {
      pm.logger.warn(`SetupWorkspace ~ importCollections : Could not complete migration for collection ${collection.uid}`, e);
      isErrored = true;
    }
    finally {
      completedCollections++;
      setProgress(`${completedCollections}/${totalCollections}`);
    }

    if (isErrored) {
      return Promise.reject(new Error('SetupWorkspace: Errored out while importing one of the collections'));
    }
  }
}

/**
 *
 */
async function importSettings () {

  pm.logger.info('SetupWorkspace~importSettings : started');

  let scratchpadSettingsString = await pm.migrator.localStorage.getItem('settings');

  try {
    let scratchpadSettings;
    if (!_.isEmpty(scratchpadSettingsString)) {
      scratchpadSettings = JSON.parse(scratchpadSettingsString);
      ThemeManager.changeTheme(scratchpadSettings.postmanTheme);
    }
  }
  catch (e) {
    pm.logger.warn('SetupWorkspace~importSettings : Could not load settings from scratchpad', e);
    throw e;
  }
}

/**
 *
 */
async function importOtherModels () {

  pm.logger.info('SetupWorkspace~importOtherModels : started');

  let migrationPromises = modelsToMove.map((modelName) => {
    return pm.migrator.models[modelName].find({}).then((values) => {
      return pm.models[modelName].createEach(values);
    });
  });
  return Promise.allSettled(migrationPromises)
    .then((results) => {
      _.forEach(results, (result) => {
        if (result.status === 'rejected') {
          throw new Error('Failure when importing other models');
        }
      });
    });
}

class ScratchpadSetupService {

  @observable
  static _progress = {};

  @observable
  static _errors = new Map();

  @observable
  static _completed = new Set();

  @observable
  static isAllCompleted = false;

  @observable
  static timedOut = false;

  @action
  static getProgress () {
    return this._progress;
  }

  @action
  static setProgress (category, progress) {
    this._progress[category] = progress;
  }

  @action
  static setError (category) {
    this._errors.set(category, true);
  }

  @action
  static setTimedout (val) {
    this.timedOut = val;
  }

  static getErrorCategories () {
    return this._errors;
  }

  static hasErrors () {
    return this._errors.size > 0;
  }

  @action
  static setCompleted (category) {
    this._completed.add(category);
  }

  @action
  static setAllCompleted () {
    this.isAllCompleted = true;
  }

  static getCompletedCategories () {
    return this._completed;
  }
}

export { ScratchpadSetupService };

/**
 *
 */
function bootFirmware () {
  return new Promise((res, rej) => {
    initializeMigrationFirmware((err) => {
      if (err) {
        rej(err);
      }

      res();
    });
  });

}

/**
 *
 */
export async function setupWorkspace (workspace) {
  if (window.SDK_PLATFORM !== 'desktop') {
    return;
  }

  let workspaceId = workspace.id,
    workspaceType = workspace.type;

  pm.logger.info('SetupWorkspace~setupWorkspace : data migration started');

  pm.mediator.trigger('scratchpad-setup-progress');

  let timeoutId = setTimeout(() => {
    pm.logger.info('SetupWorkspace~setupWorkspace: Timed out ');
    setTimedout(true);

  }, DEFAULT_TIMEOUT);

  if (!window.pm.migrator) {
    await bootFirmware();
  }

  // wait for worksapce to exist before starting to migrate
  await syncAndSubscribeTimeline({ model: 'workspace', modelId: workspaceId });

  pm.logger.info('SetupWorkspace~setupWorkspace : subscribed to workspace timeline', workspaceId);

  /**
   *
   * @param {*} category
   * @param {*} progress
   */
  function setProgress (category, progress) {
    ScratchpadSetupService.setProgress(category, progress);
  }

  /**
   *
   * @param {*} category
   * @param {*} progress
   */
  function setError (category) {
    ScratchpadSetupService.setError(category);
  }

  /**
   *
  */
  function setCompleted (category) {
    ScratchpadSetupService.setCompleted(category);
  }

  /**
  *
  */
  function setTimedout (val) {
    ScratchpadSetupService.setTimedout(val);
  }

  for (let i = 0; i < importOrder.length; i++) {
    let importers = importOrder[i];

    await Promise.allSettled(importers.map((category) => {
      let importer = importersMap[category];

      if (!importer || ScratchpadSetupService.timedOut) {
        return Promise.resolve();
      }

      return importer(setProgress.bind(null, category), { workspaceId, workspaceType })
        .then(() => { pm.logger.info('SetupWorkspace~setupWorkspace: Successful import', category); })
        .catch((err) => { pm.logger.warn('SetupWorkspace~setupWorkspace: Error in import ' + category, err); setError(category); })
        .finally(() => { pm.logger.info('SetupWorkspace~setupWorkspace: Completed ' + category); setCompleted(category); });
    }));
  }

  clearTimeout(timeoutId);
  pm.logger.info('SetupWorkspace: Completed successfully');
  ScratchpadSetupService.setAllCompleted();
}

/**
 * Returns if there is any data in Scratch Pad for migration
 */
export async function hasScratchpadData () {

  if (!window.pm.migrator) {
    await bootFirmware();
  }

  let hasScratchpadData = false;

  let models = ['collection', 'history', 'environment', 'runnerrun', 'headerpreset'];

  for (const model of models) {
    let count = await pm.migrator.models[model].count();
    if (count > 0) {
      hasScratchpadData = true;
      break;
    }
  }

  return hasScratchpadData;
}
