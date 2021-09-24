'use es6';

import { combineReducers } from 'redux';
import Auth from 'FileManagerCore/reducers/Auth';
import Folders from 'FileManagerCore/reducers/Folders';
import Files from 'FileManagerCore/reducers/Files';
import Canva from 'FileManagerCore/reducers/Canva';
import UploadingFiles from 'FileManagerCore/reducers/UploadingFiles';
import Limits from 'FileManagerCore/reducers/Limits';
import { SEARCH, SELECT_FILE, SELECT_STOCK_FILE } from '../actions/ActionTypes';
import Panel from './Panel';
import withHistory from './withHistory';
import BulkImageImport from './BulkImageImport';
import getShutterstockReducer from 'FileManagerCore/reducers/Shutterstock';
import Configuration from './Configuration';
import EditFile from './EditFile';
import EditAndCreateImage from 'FileManagerCore/reducers/EditAndCreateImage';
import portalMeta from 'FileManagerCore/reducers/PortalMeta';
import IdentityRepository from 'FileManagerCore/reducers/IdentityRepository';
import VideoThumbnails from 'FileManagerCore/reducers/VideoThumbnails';
import video2Migration from 'FileManagerCore/reducers/video2Migration';
import suspension from 'FileManagerCore/reducers/Suspension';
import partitioning from 'FileManagerCore/reducers/Partitioning';
import fileDetails from 'FileManagerCore/reducers/FileDetails';
import embedCode from 'FileManagerCore/reducers/EmbedCode';
import teams from 'FileManagerCore/reducers/Teams';
import Filter from './Filter';
import ImageOptimizationSettings from './ImageOptimizationSettings';
import fireAlarm from './FireAlarm';
export default combineReducers({
  auth: Auth,
  bulkImageImport: BulkImageImport,
  configuration: Configuration,
  canva: Canva,
  editFile: EditFile,
  editAndCreateImage: EditAndCreateImage,
  folders: Folders,
  files: Files,
  fileDetails: fileDetails,
  uploadingFiles: UploadingFiles,
  panel: withHistory(Panel, [SEARCH, SELECT_FILE, SELECT_STOCK_FILE]),
  shutterstock: getShutterstockReducer({
    concatenateResults: true
  }),
  imageOptimizationSettings: ImageOptimizationSettings,
  identityRepository: IdentityRepository,
  portalMeta: portalMeta,
  limits: Limits,
  videoThumbnail: VideoThumbnails,
  filter: Filter,
  suspension: suspension,
  fireAlarm: fireAlarm,
  partitioning: partitioning,
  embedCode: embedCode,
  video2Migration: video2Migration,
  teams: teams
});