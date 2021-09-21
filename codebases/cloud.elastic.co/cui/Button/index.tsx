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

import React, { FunctionComponent } from 'react'

import { CuiButtonImpl } from './ButtonImpl'

import { Props, ButtonUnionProps, EuiButtonEmptyProps, EuiButtonIconProps } from './types'

type PartialButtonEmptyProps = Partial<EuiButtonEmptyProps>
type PartialButtonIconProps = Partial<EuiButtonIconProps>

export type {
  ConfirmModalProps as CuiButtonConfirmModalProps,
  CuiButtonCustomRenderFn,
  CuiButtonType,
} from './types'

export type CuiButtonProps = Omit<Props, 'buttonType'>
export type CuiButtonEmptyProps = Omit<Props<PartialButtonEmptyProps>, 'buttonType'>
export type CuiButtonIconProps = Omit<Props<PartialButtonIconProps>, 'buttonType'>
export type CuiButtonAnyProps = Props<ButtonUnionProps>

export const CuiButton: FunctionComponent<CuiButtonProps> = (props) => <CuiButtonImpl {...props} />

export const CuiButtonEmpty: FunctionComponent<CuiButtonEmptyProps> = (props) => (
  <CuiButtonImpl<PartialButtonEmptyProps> buttonType='EuiButtonEmpty' {...props} />
)

export const CuiButtonIcon: FunctionComponent<CuiButtonIconProps> = (props) => (
  <CuiButtonImpl<PartialButtonIconProps> buttonType='EuiButtonIcon' {...props} />
)

export const CuiButtonAny: FunctionComponent<CuiButtonAnyProps> = (props) => (
  <CuiButtonImpl<ButtonUnionProps> {...props} />
)
