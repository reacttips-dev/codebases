import React from 'react'

export { Tooltip } from './element'

export interface IProps {
  above?: boolean
  children: React.ReactNode
  text?: string
  eyebrow?: string
  icon?: string
}
