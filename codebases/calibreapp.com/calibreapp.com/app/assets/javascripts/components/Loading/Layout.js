import React from 'react'

import { Block, Section } from '../Layout'
import LoadingLine from './Line'

const Layout = () => (
  <Block>
    <Section>
      <LoadingLine />
    </Section>
    <Section>
      <LoadingLine />
    </Section>
  </Block>
)

export default Layout
