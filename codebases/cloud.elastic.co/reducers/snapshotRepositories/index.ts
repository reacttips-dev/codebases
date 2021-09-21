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

import { keyBy, omit } from 'lodash'

import { mergeIn } from '../../lib/immutability-helpers'

import {
  FETCH_SNAPSHOT_REPOSITORY,
  FETCH_SNAPSHOT_REPOSITORIES,
  DELETE_SNAPSHOT_REPOSITORY,
  UPSERT_SNAPSHOT_REPOSITORY,
} from '../../constants/actions'
import { AsyncAction, RegionId } from '../../types'
import {
  RepositoryConfig,
  RepositoryConfigs,
  SnapshotRepositoryConfiguration,
} from '../../lib/api/v1/types'

export interface State {
  [regionId: string]: { [repositoryName: string]: RepositoryConfig }
}

interface FetchSnapshotRepositoriesAction
  extends AsyncAction<typeof FETCH_SNAPSHOT_REPOSITORIES, RepositoryConfigs> {
  meta: {
    regionId: RegionId
    state: 'started' | 'failed' | 'success'
  }
}

interface FetchSnapshotRepositoryAction
  extends AsyncAction<typeof FETCH_SNAPSHOT_REPOSITORY, RepositoryConfig> {
  meta: {
    regionId: RegionId
    state: 'started' | 'failed' | 'success'
  }
}

interface DeleteSnapshotRepositoryAction extends AsyncAction<typeof DELETE_SNAPSHOT_REPOSITORY> {
  meta: {
    regionId: RegionId
    id: string
    state: 'started' | 'failed' | 'success'
  }
}

interface UpsertSnapshotRepositoryAction
  extends AsyncAction<typeof UPSERT_SNAPSHOT_REPOSITORY, SnapshotRepositoryConfiguration> {
  meta: {
    regionId: RegionId
    id: string
    state: 'started' | 'failed' | 'success'
  }
}

type Action =
  | FetchSnapshotRepositoriesAction
  | FetchSnapshotRepositoryAction
  | DeleteSnapshotRepositoryAction
  | UpsertSnapshotRepositoryAction

export default function snapshotRepositoriesReducer(
  snapshotRepositories: State = {},
  action: Action,
): State {
  if (action.type === FETCH_SNAPSHOT_REPOSITORIES) {
    if (action.meta.state === `success` && action.payload) {
      const { regionId } = action.meta
      return {
        ...snapshotRepositories,
        [regionId]: createSnapshotRepositories(action.payload),
      }
    }
  }

  if (action.type === FETCH_SNAPSHOT_REPOSITORY) {
    if (action.meta.state === `success` && action.payload) {
      const { regionId } = action.meta
      return {
        ...snapshotRepositories,
        [regionId]: {
          ...(snapshotRepositories[regionId] || {}),
          ...createSnapshotRepositories({ configs: [action.payload] }),
        },
      }
    }
  }

  if (action.type === DELETE_SNAPSHOT_REPOSITORY) {
    if (action.meta.state === `success`) {
      const { regionId, id } = action.meta
      return {
        ...snapshotRepositories,
        [regionId]: omit(snapshotRepositories[regionId], id),
      }
    }
  }

  if (action.type === UPSERT_SNAPSHOT_REPOSITORY) {
    if (action.meta.state === `success`) {
      const { regionId, id } = action.meta
      return mergeIn(snapshotRepositories, [regionId, id], action.payload)
    }
  }

  return snapshotRepositories
}

function createSnapshotRepositories(payload: RepositoryConfigs) {
  return keyBy<RepositoryConfig>(payload.configs, `repository_name`)
}

export const getByRegion = (state: State, regionId: RegionId) => state[regionId]

export const getById = (state: State, regionId: RegionId, repositoryId: string) => {
  const repositories = getByRegion(state, regionId)

  if (!repositories) {
    return undefined
  }

  return repositories[repositoryId]
}
