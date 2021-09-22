import React, { useState, useMemo } from 'react'
import { Input, LoadingDots } from '@invisionapp/helios'
import styled from 'styled-components'
import DirectDown from '@invisionapp/helios/icons/DirectDown'
import CrossFade from './CrossFade'

import { emailNameSearch, seatTypeSearch } from '../utils/fuzzySearch'

type SearchableProps = {
  getKey: (option: any) => string
  id?: string
  loading?: boolean
  onSelect?: (option: any | null) => void
  options: any[]
  placeholder?: string
  renderInputValue: (option?: any) => string | undefined
  renderOption: (option: any) => React.ReactElement
  renderPrepend?: (member: any) => any
  searchKey?: 'email' | 'name' | 'seatType'
}

export const Searchable = (props: SearchableProps) => {
  const {
    getKey,
    id = `searchable-input-${Math.random().toString()}`,
    loading = false,
    onSelect = () => {},
    options,
    placeholder = '',
    renderInputValue,
    renderOption,
    renderPrepend = () => {},
    searchKey = 'email'
  } = props

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState<any | undefined>()

  const fuzzySearchKey = searchKey === 'seatType' ? seatTypeSearch : emailNameSearch

  const filteredOptions = useMemo(
    () => (inputValue ? fuzzySearchKey(inputValue, options) : options),
    [inputValue, options]
  )

  const handleInputChange = (event: React.FormEvent<HTMLElement>) => {
    const { value } = event.target as HTMLInputElement
    setInputValue(value)

    if (selectedOption) {
      setSelectedOption(undefined)
      onSelect(null)
    }
  }

  const handleBlur = () => {
    setOpen(false)
  }

  const handleFocus = () => {
    setOpen(true)
  }

  const handleSelectOption = (option: any) => {
    setSelectedOption(option)
    onSelect(option)
  }

  const displayValue = renderInputValue(selectedOption) ?? inputValue

  const prepend = selectedOption ? renderPrepend(selectedOption) ?? null : null

  const renderItems = () => {
    switch (loading) {
      case true: {
        return (
          <LoadingContainer>
            <LoadingDots color="text" />
          </LoadingContainer>
        )
      }
      default: {
        return filteredOptions.map(option => {
          return (
            <li key={getKey(option)} onClick={() => handleSelectOption(option)}>
              {renderOption(option)}
            </li>
          )
        })
      }
    }
  }

  return (
    <Wrapper>
      <DropdownWrapper>
        {prepend && <Prepend>{prepend}</Prepend>}
        <StyledInput
          // @ts-ignore
          customPrepend={prepend}
          id={id}
          onChange={handleInputChange}
          value={displayValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          autoFocus
        />
        <Chevron isOpen={open} style={{ pointerEvents: 'none' }}>
          <DirectDown fill="text" size={24} />
        </Chevron>
        <DropdownWrapper>
          <Menu isOpen={open}>
            <CrossFade fadeMs={250} fadeKey={loading.toString()}>
              {renderItems()}
            </CrossFade>
          </Menu>
        </DropdownWrapper>
      </DropdownWrapper>
    </Wrapper>
  )
}

const Prepend = styled.div`
  position: absolute;
  z-index: 1;
  left: 8px;
  display: flex;
  min-width: 40px;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.m};
`

const StyledInput = styled(Input)`
  ${(props: { customPrepend: boolean }) =>
    props.customPrepend ? 'padding-left: 50px; transition: none;' : ''}
`

export const SearchableOption = styled.div`
  padding: ${({ theme }) => theme.spacing.s};
  border-top: 1px solid ${({ theme }) => theme.palette.structure.lighter};

  &:first-child {
    border-top-width: 0;
  }

  &:hover {
    background-color: ${props => props.theme.palette.structure.lightest};
    cursor: pointer;
  }
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`

const DropdownWrapper = styled.div`
  position: relative;
`

type IsOpenProps = {
  isOpen: boolean
}

const Menu = styled.ul`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.elevations.medium};
  list-style: none;
  opacity: 0;
  text-align: left;
  transform: translateY(-10px);
  transition: visibility 0.2s ease 0.2s, opacity 0.2s ease, transform 0.2s ease;
  visibility: hidden;

  ${(props: IsOpenProps) =>
    props.isOpen &&
    `
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
    transition-delay: 0s, 0s, 0s;
  `}
`

const Chevron = styled.div`
  position: absolute;
  top: calc(50% - 12px);
  right: 12px;
  height: 24px;
  ${({ isOpen }: IsOpenProps) => isOpen && 'transform: rotate(180deg);'}
  transition: transform 200ms ease;
`
