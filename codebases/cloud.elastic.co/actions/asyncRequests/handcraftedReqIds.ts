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

import { reqIdFactory } from '../../lib/reqId'

import * as actions from '../../constants/actions'

export const enableTwoFactorReqId = reqIdFactory(actions.ENABLE_TWO_FACTOR_AUTH)
export const stopDeploymentReqId = reqIdFactory(actions.STOP_DEPLOYMENT)
export const createClusterReqId = reqIdFactory(actions.CREATE_CLUSTER)
export const createTempShieldUserReqId = reqIdFactory(actions.CREATE_TEMP_SHIELD_USER)
export const deleteTempShieldUserReqId = reqIdFactory(actions.DELETE_TEMP_SHIELD_USER)
export const fetchRecoveryInfoReqId = reqIdFactory(actions.FETCH_RECOVERY_INFO)
export const fetchUserReqId = reqIdFactory(actions.FETCH_USER)
