import React from 'react'

import { Section } from '../Layout'
import LoadingLine from './Line'

const List = props => (
  <Section {...props}>
    <LoadingLine />
  </Section>
)

export default List
