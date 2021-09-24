import React from 'react'
import { Heading as BaseHeading } from 'theme-ui'

export interface IHeadingProps {
  as: string,
  variant: string,
  [key: string]: any
}

const Heading = ({ as = 'h2', variant = '', ...props }: IHeadingProps): JSX.Element => (
  <BaseHeading as={as} variant={variant || as} {...props} />
)

export default Heading
