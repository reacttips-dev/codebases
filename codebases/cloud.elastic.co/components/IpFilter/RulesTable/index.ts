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

import { connect } from 'react-redux'
import { get } from 'lodash'
import RulesTable from './RulesTable'

import {
  createIpFilterRuleRequest,
  deleteIpFilterRuleRequest,
  getIpFilterRuleset,
  updateIpFilterRuleRequest,
} from '../../../reducers'

const mapStateToProps = (state, { currentRuleset }) => {
  const ruleset = getIpFilterRuleset(state, currentRuleset.id)
  const rules = get(ruleset, ['rules'], [])
  return {
    rules,
    createIpFilterRuleRequest: createIpFilterRuleRequest(state, currentRuleset.id),
    deleteIpFilterRuleRequest: deleteIpFilterRuleRequest(state, currentRuleset.id),
    updateIpFilterRuleRequest: updateIpFilterRuleRequest(state, currentRuleset.id),
  }
}

export default connect(mapStateToProps, {})(RulesTable)
