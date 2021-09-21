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

import { isEqual } from 'lodash'

import { PlanStrategy } from './api/v1/types'

const rollingByName: PlanStrategy = {
  rolling: {
    group_by: '__name__' as const,
    allow_inline_resize: true as const,
  },
}

const rollingByZone: PlanStrategy = {
  rolling: {
    group_by: '__zone__' as const,
  },
}

const rollingAll: PlanStrategy = {
  rolling: {
    group_by: '__all__' as const,
  },
}

const growAndShrink: PlanStrategy = {
  grow_and_shrink: {},
}

const rollingGrowAndShrink: PlanStrategy = {
  rolling_grow_and_shrink: {},
}

const autodetect: PlanStrategy = {
  autodetect: {},
}

export type Strategy =
  | typeof growAndShrink
  | typeof rollingAll
  | typeof rollingByName
  | typeof rollingByZone
  | typeof rollingGrowAndShrink
  | typeof autodetect

export const strategies = {
  growAndShrink,
  rollingAll,
  rollingByName,
  rollingByZone,
  rollingGrowAndShrink,
  autodetect,
}

export function isAnyRolling(strategy: Strategy): boolean {
  return Boolean(strategy && strategy.rolling)
}

export function allowsInlineResize(strategy: Strategy): boolean {
  return isAnyRolling(strategy) && strategy.rolling!.allow_inline_resize === true
}

export function isRollingAll(strategy: Strategy): boolean {
  return isAnyRolling(strategy) && strategy.rolling!.group_by === `__all__`
}

export function isRollingByName(strategy: Strategy): boolean {
  return isAnyRolling(strategy) && strategy.rolling!.group_by === `__name__`
}

export function isRollingByNameInline(strategy: Strategy): boolean {
  return isRollingByName(strategy) && allowsInlineResize(strategy)
}

export function isRollingByZone(strategy: Strategy): boolean {
  return isAnyRolling(strategy) && strategy.rolling!.group_by === `__zone__`
}

export function isGrowAndShrink(strategy: Strategy): boolean {
  return isEqual(strategy, strategies.growAndShrink)
}

export function isRollingGrowAndShrink(strategy: Strategy): boolean {
  return isEqual(strategy, strategies.rollingGrowAndShrink)
}

export function isAutodetect(strategy: Strategy): boolean {
  return isEqual(strategy, strategies.autodetect)
}

export function isExplicitStrategy(strategy: Strategy): boolean {
  return (
    isAnyRolling(strategy) ||
    isGrowAndShrink(strategy) ||
    isRollingGrowAndShrink(strategy) ||
    isAutodetect(strategy)
  )
}
