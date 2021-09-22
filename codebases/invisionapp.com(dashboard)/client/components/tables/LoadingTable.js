import React from 'react'
import styled from 'styled-components'
import { Search, Spaced } from '@invisionapp/helios'
import SimpleTable from './SimpleTable'

export const LoadingTable = props => {
  return (
    <>
      {props.withSearch && (
        <Spaced bottom="s">
          <StyledSearch />
        </Spaced>
      )}
      <SimpleTable items={[]} loading loadingRowCount={3} renderRow={() => {}} willLoad />
    </>
  )
}

LoadingTable.defaultProps = {
  withSearch: true
}

const StyledSearch = styled(Search)`
  opacity: 0.2;
  pointer-events: 'none';
  transition: opacity 300ms linear;
`
