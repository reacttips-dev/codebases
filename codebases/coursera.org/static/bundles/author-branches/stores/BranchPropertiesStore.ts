// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';
import _ from 'lodash';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { ConflictMetadata } from 'bundles/author-branches/types/BranchProperties';
import type { PrivateOnlyMaterials } from 'bundles/authoring/course-level/types/PrivateOnlyMaterials';

const SERIALIZED_PROPS: (keyof BranchPropertiesStore$DehydratedState)[] = [
  'branchPropertiesById',
  'conflictMetadataById',
  'privateOnlyMaterialsById',
];

export type ReceivedBranchForCoursePayload = Array<{
  id: string;
  properties: AuthoringCourseBranch;
  conflictMetadata: ConflictMetadata;
}>;

type BranchPropertiesStore$DehydratedState = {
  branchPropertiesById: { [branchId: string]: AuthoringCourseBranch };
  conflictMetadataById: { [branchId: string]: ConflictMetadata };
  privateOnlyMaterialsById: { [branchId: string]: PrivateOnlyMaterials };
};

const BranchPropertiesStore = createStore({
  storeName: 'BranchPropertiesStore',

  dehydrate() {
    return _.pick(this, ...SERIALIZED_PROPS);
  },

  rehydrate(state: BranchPropertiesStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  },

  initialize() {
    this.branchPropertiesById = {};
    this.conflictMetadataById = {};
    this.privateOnlyMaterialsById = {};
  },

  getAllBranchProperties() {
    return this.branchPropertiesById;
  },

  getAllConflictMetadata() {
    return this.conflictMetadataById;
  },

  getBranchPropertiesById(branchId: string) {
    return this.branchPropertiesById[branchId];
  },

  getConflictMetadataById(branchId: string) {
    return this.conflictMetadataById[branchId];
  },

  getPrivateOnlyMaterialsById(branchId: string) {
    return this.privateOnlyMaterialsById[branchId];
  },

  updateBranchProperties(branchId: string, newProperties: AuthoringCourseBranch) {
    this.branchPropertiesById[branchId] = newProperties;
    this.branchPropertiesById[branchId].id = branchId;
  },

  updateConflictMetadata(branchId: string, conflictMetadata: ConflictMetadata) {
    this.conflictMetadataById[branchId] = conflictMetadata;
  },

  updatePrivateOnlyMaterials(branchId: string, privateOnlyMaterials: PrivateOnlyMaterials) {
    this.privateOnlyMaterialsById[branchId] = privateOnlyMaterials;
  },
});

BranchPropertiesStore.handlers = {
  RECEIVED_BRANCHES_FOR_COURSE(branches: ReceivedBranchForCoursePayload) {
    branches.forEach((branch) => {
      const { id, properties, conflictMetadata } = branch;

      this.updateBranchProperties(id, properties);
      this.updateConflictMetadata(id, conflictMetadata);
    });

    this.emitChange();
  },

  RECEIVED_BRANCH_PROPERTIES({ branchId, properties }: { branchId: string; properties: AuthoringCourseBranch }) {
    this.updateBranchProperties(branchId, properties);
    this.emitChange();
  },

  SAVE_CONFLICT_METADATA_FOR_BRANCH({
    branchId,
    conflictMetadata,
  }: {
    branchId: string;
    conflictMetadata: ConflictMetadata;
  }) {
    this.updateConflictMetadata(branchId, conflictMetadata);
    this.emitChange();
  },

  SAVE_PRIVATE_ONLY_MATERIALS_FOR_BRANCH({
    branchId,
    privateOnlyMaterials,
  }: {
    branchId: string;
    privateOnlyMaterials: PrivateOnlyMaterials;
  }) {
    this.updatePrivateOnlyMaterials(branchId, privateOnlyMaterials);
    this.emitChange();
  },

  SAVE_BRANCH({ branchId, conflictMetadata }: { branchId: string; conflictMetadata: ConflictMetadata }) {
    this.updateConflictMetadata(branchId, conflictMetadata);
    this.emitChange();
  },
};

export default BranchPropertiesStore;
