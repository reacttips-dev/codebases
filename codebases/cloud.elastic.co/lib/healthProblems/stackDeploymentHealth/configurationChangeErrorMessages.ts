/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages, MessageDescriptor } from 'react-intl'

type ConfigurationChangeErrorCategories =
  | 'ClusterFailure'
  | 'InfrastructureFailure'
  | 'UnknownFailure'
  | 'UserInteractionFailure'
  | 'ValidationFailure'

type ConfigurationChangeErrorDescriptions = {
  [category in ConfigurationChangeErrorCategories]: { [failure in string]: MessageDescriptor }
}

const clusterFailureDescriptions = defineMessages({
  DataMigrationStuck: {
    id: 'configuration-change-errors.descriptions.cluster-failure.data-migration-stuck',
    defaultMessage:
      'The data migration failed. No progress was observed in the last {duration} seconds. Check that the cluster is healthy and try again.',
  },
  DataMigrationFailedDueToUnavailableShards: {
    id: 'configuration-change-errors.descriptions.cluster-failure.data-migration-failed-due-to-unavailable-shards',
    defaultMessage:
      'The data migration failed because the cluster contains unassigned shards. Remove or recover any unavailable shards and try again.',
  },
  InstanceDidNotStartWhileWaitingForRunning: {
    id: 'configuration-change-errors.descriptions.cluster-failure.instance-did-not-start-while-waiting-for-running',
    defaultMessage:
      'The cluster was not detected to be running. Check that the cluster is healthy, check the cluster logs to see if there were any issues starting, and try again.',
  },
  MultipleFailures: {
    id: 'configuration-change-errors.descriptions.cluster-failure.multiple-failures',
    defaultMessage:
      'Multiple failures occurred. Please check the instance logs for any configuration or plugin errors and retry.',
  },
  InstanceDidNotStopWhileWaitingForStopped: {
    id: 'configuration-change-errors.descriptions.cluster-failure.instance-did-not-stop-while-waiting-for-stopped',
    defaultMessage:
      'The cluster was not detected to have stopped. Check that the cluster is healthy, check the cluster logs to see if there were any issues stopping, and try again.',
  },
  InstanceWasNotDeallocatedWhileWaitingForDeallocation: {
    id: 'configuration-change-errors.descriptions.cluster-failure.instance-was-not-deallocated-while-waiting-for-deallocation',
    defaultMessage: 'The cluster could not be deleted.',
  },
  MasterNotDetectedInTime: {
    id: 'configuration-change-errors.descriptions.cluster-failure.master-not-detected-in-time',
    defaultMessage:
      'The cluster was not detected to have elected a master. Check the health of the cluster, and look at the cluster logs to determine if there were any issues with cluster formation or leadership election.',
  },
  InstanceBootloopingWhileWaitingForRunning: {
    id: 'configuration-change-errors.descriptions.cluster-failure.instance-bootlooping-while-waiting-for-running',
    defaultMessage:
      'The instance was detected to be boot looping. Check the instance logs for any configuration or plugin errors and try again.',
  },
  InstanceNotRestartingDuringClusterReboot: {
    id: 'configuration-change-errors.descriptions.cluster-failure.instance-not-restarting-during-cluster-reboot',
    defaultMessage:
      'The instance did not restart. Check the instance logs for any configuration or plugin errors and try again.',
  },
  ClusterPrerequisiteValidationFailed: {
    id: 'configuration-change-errors.descriptions.cluster-failure.cluster-prerequisite-validation-failed',
    defaultMessage:
      'The cluster health or prerequisites failed validation. Resolve each of the errors identified and try again.',
  },
  FailedToPerformSnapshot: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-perform-snapshot',
    defaultMessage:
      'A snapshot could not be taken. Check that the snapshot repository is correct, check that the cluster is healthy, and try again.',
  },
  FailedToRestoreSnapshotDueToElasticsearchError: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-restore-snapshot-due-to-elasticsearch-error',
    defaultMessage:
      'The snapshot could not be restored due to an Elasticsearch error, check the instance logs.',
  },
  FailedToFindValidSnapshot: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-find-valid-snapshot',
    defaultMessage:
      'The snapshot {snapshot_used} could not be found or is invalid. Check that the snapshot is available and not corrupted, and try again.',
  },
  FailedToRestoreSnapshotDueToSnapshotError: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-restore-snapshot-due-to-snapshot-error',
    defaultMessage:
      'The snapshot restoration failed with an exception. Check the details of the failure, address any issues with connectivity, the snapshot, or the cluster, and try again.',
  },
  FailedToRestoreSnapshotDueToClusterRecoverTimeout: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-restore-snapshot-due-to-cluster-recover-timeout',
    defaultMessage:
      'A timeout occurred waiting for the cluster to restore a snapshot. These indices are still initializing: {initializing_indices}',
  },
  FailedToResolveLatestSnapshot: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-resolve-latest-snapshot',
    defaultMessage:
      'The latest snapshot could not be found. Check the details of the failure, check that repository and snapshot are specified correctly and available, and try again.',
  },
  CouldNotEnsureSnapshotRepository: {
    id: 'configuration-change-errors.descriptions.cluster-failure.could-not-ensure-snapshot-repository',
    defaultMessage:
      'The snapshot repository could not be found. Check that the repository is accessible and try again.',
  },
  FailedToConfigureRemoteClusters: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-configure-remote-clusters',
    defaultMessage:
      'The remote clusters could not be configured. Please check the cause and retry after resolving any issues.',
  },
  NoAvailableInstanceFound: {
    id: 'configuration-change-errors.descriptions.cluster-failure.no-available-instance-found',
    defaultMessage:
      'An available instance was not found during step {step_name}. Check that the cluster is healthy and try again.',
  },
  ClusterNotReachable: {
    id: 'configuration-change-errors.descriptions.cluster-failure.cluster-not-reachable',
    defaultMessage:
      'The cluster {cluster_type} could not be reached. Check that the cluster is healthy and try again.',
  },
  ServerRepliedWithError: {
    id: 'configuration-change-errors.descriptions.cluster-failure.server-replied-with-error',
    defaultMessage:
      'The cluster reported an error message during step {step_name}. Check the response details, correct any issues indicated, and try again.',
  },
  FailedToSetQuorumSizeSettings: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-set-quorum-size-settings',
    defaultMessage:
      'The cluster quorum settings cloud not be set: {user_message}. Check the error, check that the cluster is available and healthy, and try again.',
  },
  NoClusterInstanceAclNodeFound: {
    id: 'configuration-change-errors.descriptions.cluster-failure.no-cluster-instance-acl-node-found',
    defaultMessage:
      'The cluster secrets (ACL) could not be acquired for cluster {cluster_id}. Check the ACL node information and try again.',
  },
  FailedToRestartEs6Watcher: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-restart-es-6-watcher',
    defaultMessage:
      'Failed to restart ElasticSearch Watcher. Please check the response code/body, ensure instances are accessible, and retry the plan.',
  },
  FailedToCloseIndices: {
    id: 'configuration-change-errors.descriptions.cluster-failure.failed-to-close-indices',
    defaultMessage:
      'The indices {indices} could not be closed. Check the cause in the instance logs and retry after resolving any issues.',
  },
  IndicesLockedFailure: {
    id: 'configuration-change-errors.descriptions.cluster-failure.indices-locked-failure',
    defaultMessage:
      'The following indices are currently locked: {indices}. Unlock the indices and try again.',
  },
  IndicesMissingFailure: {
    id: 'configuration-change-errors.descriptions.cluster-failure.indices-missing-failure',
    defaultMessage:
      'The following indices could not be found: {indices}. Check that the specified indices are correct and try again.',
  },
  UnsupportedMigration: {
    id: 'configuration-change-errors.descriptions.cluster-failure.unsupported-migration',
    defaultMessage:
      'The requested type of migration is not supported. Check that the migration settings are correct and try again.',
  },
  CouldNotSuspendSnapshotting: {
    id: 'configuration-change-errors.descriptions.cluster-failure.could-not-suspend-snapshotting',
    defaultMessage:
      'Snapshotting could not be suspended. Check the reason for the failure, check that your deployment is healthy, and try again.',
  },
  UnableToMigrateShieldToXPackException: {
    id: 'configuration-change-errors.descriptions.cluster-failure.unable-to-migrate-shield-to-x-pack-exception',
    defaultMessage: 'Unable to migrate {kind}, cluster rejected create request.',
  },
  RoleMappingFailure: {
    id: 'configuration-change-errors.descriptions.cluster-failure.role-mapping-failure',
    defaultMessage: 'The role mapping {role_mapping_name} could not be configured.',
  },
  CouldNotCleanAllocations: {
    id: 'configuration-change-errors.descriptions.cluster-failure.could-not-clean-allocations',
    defaultMessage: 'The shard allocations could not be reset: {user_message}.',
  },
})

const infrastructureFailureDescriptions = defineMessages({
  ConnectionAttemptFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.connection-attempt-failure',
    defaultMessage:
      'A connection exception occurred. Check that the components are available and healthy, and try again.',
  },
  AllocationFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.allocation-failure',
    defaultMessage: 'Allocation failed. See details for information on the cause, and try again.',
  },
  DeallocationFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.deallocation-failure',
    defaultMessage: 'Deallocation failed. See details for information on the cause, and try again.',
  },
  ResizeInstanceFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.resize-instance-failure',
    defaultMessage:
      'The instance could not be resized. Please see the details to resolve the issue, and try again.',
  },
  UnableToAssignStorageResources: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.unable-to-assign-storage-resources',
    defaultMessage:
      'The storage resources could not be assigned. See the details to resolve the issue, and try again.',
  },
  DeletingInstanceFailed: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.deleting-instance-failed',
    defaultMessage:
      'The instance could not be deleted. Check the instance logs to resolve the issue, and try again.',
  },
  EnterpriseLicenseInvalidFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.enterprise-license-invalid-failure',
    defaultMessage:
      'The enterprise license could not be validated. Check that the license is available and valid, and try again.',
  },
  TimeoutExceeded: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.timeout-exceeded',
    defaultMessage:
      'The plan change took too long to complete. Adjust the plan timeout value and try again.',
  },
  ExtensionsResolvingFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.extensions-resolving-failure',
    defaultMessage:
      'One or more extensions could not be resolved. Make sure that the extensions are available and try again.',
  },
  ExtensionResolverNotConfiguredFailure: {
    id: 'configuration-change-errors.descriptions.infrastructure-failure.extension-resolver-not-configured-failure',
    defaultMessage:
      'Plan contains plugins that are stored in a repository but resolver is not configured.',
  },
})

const unknownFailureDescriptions = defineMessages({
  UnknownErrorEncountered: {
    id: 'configuration-change-errors.descriptions.unknown-failure.unknown-error-encountered',
    defaultMessage:
      'An error occurred during step {step_id}. Check that your deployment is healthy and try again.',
  },
})

const userInteractionFailureDescriptions = defineMessages({
  ForcedAbortReceived: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.forced-abort-received',
    defaultMessage: 'The plan was aborted while it was being applied.',
  },
  ForcedRollbackReceived: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.forced-rollback-received',
    defaultMessage:
      'The plan was cancelled due to a rollback. Check the cause of the rollback and try again.',
  },
  PlanCancelledByUser: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.plan-cancelled-by-user',
    defaultMessage:
      'The plan was cancelled while it was being applied. Try applying the plan again.',
  },
  PlanRollbackedByUser: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.plan-rollbacked-by-user',
    defaultMessage:
      'The plan was cancelled by the user while it was being applied. Try applying the plan again.',
  },
  PlanCancelledByPlanDeletion: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.plan-cancelled-by-plan-deletion',
    defaultMessage:
      'Plan aborted by deletion of pending plan while it was being applied. The plan can be retried/reapplied.',
  },
  PlanCancelledByConstructorInterruption: {
    id: 'configuration-change-errors.descriptions.user-interaction-failure.plan-cancelled-by-constructor-interruption',
    defaultMessage:
      'The plan was cancelled while being applied, possibly due to a shutdown or network connectivity issue. Try applying the plan again.',
  },
})

const validationFailureDescriptions = defineMessages({
  IdentifiedIgnoredChangesInMoveOnlyPlan: {
    id: 'configuration-change-errors.descriptions.validation-failure.identified-ignored-changes-in-move-only-plan',
    defaultMessage:
      'The move-only plan succeeded but the cluster is still not in a consistent state because of prior failures. Try applying the plan again.',
  },
  PlanValidationFailed: {
    id: 'configuration-change-errors.descriptions.validation-failure.plan-validation-failed',
    defaultMessage: 'The plan could not be validated. Correct the issue and try again.',
  },
  FailedUpgradeRule: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-upgrade-rule',
    defaultMessage:
      'The upgrade was cancelled because the rule {upgrade_rule} failed. The issue reported is: {user_message} Correct the issue and try the upgrade again.',
  },
  FailedToValidatePlanSafety: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-to-validate-plan-safety',
    defaultMessage:
      'The plan change was cancelled because one or more safety checks failed. Check the reasons, correct any issues, and try again.',
  },
  FailedToValidateSafeRemovalOfInstance: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-to-validate-safe-removal-of-instance',
    defaultMessage:
      'The plan change was cancelled because one or more instances to be removed contain the only healthy copy of some shards, which would result in data loss in the cluster. Check that the cluster is healthy and has at least one copy of each shard in the instance to be removed, and try again.',
  },
  FailedToEnsureAppAuthToken: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-to-ensure-app-auth-token',
    defaultMessage:
      'The AppAuthToken could not be loaded from the deployment data. Check that AppAuthToken is present and has a valid JWT token.',
  },
  FailedToValidateDiskSpace: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-to-validate-disk-space',
    defaultMessage:
      'There is not enough disk space to complete the plan change. Make sure there is enough disk capacity and try again.',
  },
  PluginClusterVersionMismatchFailure: {
    id: 'configuration-change-errors.descriptions.validation-failure.plugin-cluster-version-mismatch-failure',
    defaultMessage:
      'The cluster version {cluster_version} does not support plugin versions {invalid_plugins}. Correct the versions specified in the plan and try again.',
  },
  FailedToValidateVersionSafety: {
    id: 'configuration-change-errors.descriptions.validation-failure.failed-to-validate-version-safety',
    defaultMessage:
      'The Elasticsearch versions specified in the plan could not be validated. Check that the version information in the plan is valid and try again.',
  },
})

const configurationChangeErrorDescriptions: ConfigurationChangeErrorDescriptions = {
  ClusterFailure: clusterFailureDescriptions,
  InfrastructureFailure: infrastructureFailureDescriptions,
  UnknownFailure: unknownFailureDescriptions,
  UserInteractionFailure: userInteractionFailureDescriptions,
  ValidationFailure: validationFailureDescriptions,
}

export default configurationChangeErrorDescriptions
