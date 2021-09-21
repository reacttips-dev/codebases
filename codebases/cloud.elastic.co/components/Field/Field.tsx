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

import React, { Component, ComponentType, ReactNode, ReactElement } from 'react'
import { compact, get, isString } from 'lodash'

import {
  EuiFieldNumber,
  EuiFieldPassword,
  EuiFieldText,
  EuiSelect,
  EuiSwitch,
  EuiTextArea,
} from '@elastic/eui'

import CompositeField from './CompositeField'
import Fieldset from './Fieldset'
import FormGroupLayout from './FormGroupLayout'
import RadioList from './RadioList'

import nonce from '../../lib/nonce'

import { PlainHashMap } from '../../types'

type Props = {
  layout: ComponentType
  children: ReactNode
}

type State = {
  labelId?: string
  descriptionId?: string
  controlId?: string
  helpId?: string
  errorsId?: string
}

type FieldRole = 'control' | 'description' | 'label' | 'help' | 'errors'

type FieldControl = ReactElement & {
  key: string | number | null
  type: ReactElement & {
    defaultLayout: ReactElement
    formRole: FieldRole
  }
  props: {
    children?: ReactElement
    htmlFor?: string
  }
}

type CategorizedRoles = {
  [key in FieldRole]?: FieldControl
}

class Field extends Component<Props, State> {
  state: State = derivedStateFromProps(this.props)

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    return derivedStateFromProps(nextProps, prevState)
  }

  render() {
    const { layout, children, ...props } = this.props
    const { labelId, controlId, descriptionId, helpId, errorsId } = this.state

    const roles = categorizeFieldRoles(children)
    const Layout = getLayout(layout, roles.control)

    // wire together field elements
    const labelProps: PlainHashMap = {}
    const descriptionProps: PlainHashMap = { id: descriptionId }
    const controlProps: PlainHashMap = { id: controlId }
    const helpProps: PlainHashMap = { id: helpId }
    const errorsProps: PlainHashMap = { id: errorsId }

    if (roles.control) {
      if (roles.control.type === Fieldset) {
        // copy label into control for fieldsets…
        if (roles.label != null) {
          labelProps[`aria-hidden`] = true
          controlProps.legend = roles.label.props.children
        }
      } else if (roles.control.type !== CompositeField) {
        // …and tie label to control for everything else but CompositeField
        if (roles.label != null && roles.label.props.htmlFor == null) {
          if (roles.control.type === RadioList) {
            labelProps.id = labelId
            controlProps.labelId = labelId
          } else {
            labelProps.htmlFor = controlId
          }
        }
      }
    }

    const describedby = compact([
      roles.description && descriptionId,
      roles.help && helpId,
      roles.errors && errorsId,
    ])

    if (describedby.length > 0) {
      controlProps[`aria-describedby`] = describedby.join(` `)
    }

    // rewrite children with accessibility metadata
    if (roles.label) {
      roles.label = React.cloneElement(roles.label, labelProps) as FieldControl
    }

    if (roles.control) {
      roles.control = React.cloneElement(roles.control, controlProps) as FieldControl
    }

    if (roles.description) {
      roles.description = React.cloneElement(roles.description, descriptionProps) as FieldControl
    }

    if (roles.help) {
      roles.help = React.cloneElement(roles.help, helpProps) as FieldControl
    }

    if (roles.errors) {
      roles.errors = React.cloneElement(roles.errors, errorsProps) as FieldControl
    }

    return <Layout {...props} {...roles} />
  }
}

export default Field

function derivedStateFromProps(props: Props, state: State = {}): State {
  const { children } = props
  const roles = categorizeFieldRoles(children)

  // use explicit ids when present, or generate a random nonce per role
  return {
    labelId: get(roles, [`label`, `props`, `id`]) || state.labelId || nonce(),
    descriptionId: get(roles, [`description`, `props`, `id`]) || state.descriptionId || nonce(),
    controlId: get(roles, [`control`, `props`, `id`]) || state.controlId || nonce(),
    helpId: get(roles, [`help`, `props`, `id`]) || state.helpId || nonce(),
    errorsId: get(roles, [`errors`, `props`, `id`]) || state.errorsId || nonce(),
  }
}

function categorizeFieldRoles(children: ReactNode): CategorizedRoles {
  const roles: CategorizedRoles = {}

  React.Children.forEach(children, (child: FieldControl) => {
    if (child == null) {
      return
    }

    // html elements
    const tag = isString(child.type) ? child.type : null

    switch (tag) {
      case `label`:
        roles.label = child
        break
      case `input`:
      case `select`:
        roles.control = child
        break
      default:
        break
    }

    const role = child.type.formRole

    if (role) {
      roles[role] = child
    } else {
      switch (child.type) {
        case EuiFieldNumber:
        case EuiFieldPassword:
        case EuiFieldText:
        case EuiSelect:
        case EuiSwitch:
        case EuiTextArea:
          roles.control = child
          break

        default:
          break
      }
    }
  })

  return roles
}

function getLayout(layout: ComponentType | undefined, control: FieldControl | undefined) {
  // layout priority:
  //   1. explicit prop
  //   2. default for control
  //   3. FormGroupLayout

  if (layout != null) {
    return layout
  }

  if (control && control.type && control.type.defaultLayout) {
    return control.type.defaultLayout
  }

  return FormGroupLayout
}
