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
import { get, isEqual } from 'lodash'
import { DifferenceArgs, DifferencePredicate } from './types'

export const hasCurrent: DifferencePredicate = ({ current }) => !!current
export const hasNext: DifferencePredicate = ({ next }) => !!next
export const isElasticsearch: DifferencePredicate = ({ sliderInstanceType }) =>
  sliderInstanceType === `elasticsearch`

type HasChangedPathBuilder = (args: {
  pathBuilder: (args: DifferenceArgs) => string[][]
  defaultValue?: any
}) => DifferencePredicate

export const hasChangedPath: HasChangedPathBuilder =
  ({ pathBuilder, defaultValue }) =>
  (args) => {
    const paths = pathBuilder(args)
    const { current, next } = args

    return paths.some((path) => {
      const currentPathValue = get(current, path, defaultValue)
      const nextPathValue = get(next, path, defaultValue)
      return !isEqual(currentPathValue, nextPathValue)
    })
  }
