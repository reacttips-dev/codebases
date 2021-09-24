import React from 'react'

import { Section } from '../Layout'
import Table, { Thead, Th, Tr, Td, Tbody } from '../Table'
import LoadingLine from './Line'

const LoadingTable = ({ label, colSpan, ...props }) => (
  <Section borderBottom="none" {...props}>
    <Table bleed={0} overflow="auto">
      <Thead>
        <Tr>
          <Th>{label}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td borderBottomWidth="1px" colSpan={colSpan}>
            <LoadingLine />
          </Td>
        </Tr>
        <Tr>
          <Td borderBottomWidth="1px" colSpan={colSpan}>
            <LoadingLine />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  </Section>
)

LoadingTable.defaultProps = {
  label: 'Loading',
  colSpan: 3
}

export default LoadingTable
