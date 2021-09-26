import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import {
  OrganisationSites as GetSites,
  UpdateUserSettings
} from '../../queries/NavigationQueries.gql'

import SearchHOC from './SearchHOC'
import SearchInput from './SearchInput'
import { Flex, Box } from '../Grid'
import { Heading, Text } from '../Type'

import { useSession } from '../../providers/SessionProvider'
import { transition } from '../../utils/style'

const Overlay = styled.div`
  bottom: 0;
  left: 0;
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  position: fixed;
  right: 0;
  top: 0;
  z-index: 11;
`

const Wrapper = styled.div`
  width: 100%;
  z-index: 11;
`

const ResultsWrapper = styled(Box)`
  left: 50%;
  margin-top: 10px;
  max-width: 600px;
  opacity: ${({ active }) => (active ? 1 : 0)};
  position: absolute;
  transform: translateX(-50%);
  ${transition('opacity')};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  width: 100%;
  z-index: 11;
`

const ResultsItems = styled.div`
  max-height: 360px;
  overflow: auto;
  padding-bottom: 5px;
`
const Results = ({ children, ...props }) => {
  return children ? (
    <ResultsWrapper {...props}>
      <ResultsItems>{children}</ResultsItems>
      <Box
        borderTopWidth={1}
        borderColor="grey100"
        borderTopStyle="solid"
        p={3}
      >
        <Flex alignItems="center">
          <Box mr={3}>
            <FormattedMessage id="navigation.search.instructions.select" />
          </Box>
          <Box>
            <FormattedMessage id="navigation.search.instructions.open" />
          </Box>
        </Flex>
      </Box>
    </ResultsWrapper>
  ) : null
}
Results.defaultProps = {
  borderRadius: '3px',
  backgroundColor: 'white',
  boxShadow: 'menu',
  pt: 2
}

const ItemWrapper = styled(Box)`
  border-radius: 3px;
  background: ${({ active, theme }) =>
    active ? theme.colors.blue100 : 'white'};
  color: ${({ active, theme }) => (active ? theme.colors.blue400 : 'inherit')};
  position: relative;

  &:focus,
  &:hover {
    background: ${({ disabled, theme }) => !disabled && theme.colors.blue100};
    > * {
      color: ${({ disabled, theme }) => !disabled && theme.colors.blue400};
    }
  }
`
ItemWrapper.propTypes = {
  active: PropTypes.bool
}

const Title = ({ children, ...props }) => (
  <Box px={3} py={2} {...props}>
    <Heading level="xs" color="grey500">
      {children}
    </Heading>
  </Box>
)

Title.propTypes = {
  children: PropTypes.any
}

const Item = ({ children, ...props }) => {
  return (
    <Box px={2}>
      <ItemWrapper {...props}>{children}</ItemWrapper>
    </Box>
  )
}
Item.defaultProps = {
  backgroundColor: 'white',
  p: 2,
  width: 1
}

const LinkIndicator = styled(Box)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
`
LinkIndicator.defaultProps = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'blue200',
  borderRadius: '3px',
  backgroundColor: 'blue50',
  px: '6px'
}

const Link = React.forwardRef(function link(link, ref) {
  const { name, teamName, active, to, onClick, ...props } = link
  return (
    <RouterLink to={to} onClick={() => onClick(link)} ref={ref}>
      <Item active={active} {...props}>
        <Text as="div" color={active ? 'inherit' : 'grey400'}>
          {name}
        </Text>
        <Text as="div" level="xs" color={active ? 'inherit' : 'grey300'}>
          in {teamName}
        </Text>
        {active ? (
          <LinkIndicator>
            <Text level="xs" color="blue400">
              ⤶
            </Text>
          </LinkIndicator>
        ) : null}
      </Item>
    </RouterLink>
  )
})

Link.propTypes = {
  active: PropTypes.bool,
  name: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

const generateLinks = sites =>
  sites.map(({ name, slug, team: { name: teamName, slug: teamId } }) => ({
    name,
    teamName,
    slug,
    to: `/teams/${teamId}/${slug}`,
    ref: React.createRef()
  }))

const NavSearch = ({ orgId, teamId }) => {
  const { currentOrganisationId, currentUser } = useSession({
    orgId,
    teamId
  })
  const history = useHistory()
  const searchRef = useRef()
  const [searching, setSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [resultsType, setResultsType] = useState('saved')
  const [focusIndex, setFocusIndex] = useState(0)
  const [keyboardControl, setKeyboardControl] = useState(true)
  const [links, setLinks] = useState([])
  const [saved, setSaved] = useState(
    generateLinks(currentUser?.recentSites || [])
  )
  const [getData, { loading }] = useLazyQuery(GetSites, {
    variables: {
      orgId: currentOrganisationId,
      sitesFilter: { nameContains: searchTerm }
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      const { organisation } = data || {}
      const {
        sitesList: { edges }
      } = organisation || { sitesList: {} }
      if (!searchTerm.length) return
      setLinks(generateLinks((edges || []).map(({ node }) => node)))
      setResultsType('results')
    }
  })
  const [updateRecentSites] = useMutation(UpdateUserSettings, {
    onCompleted: ({ updateUserSettings: { recentSites } }) => {
      setSaved(generateLinks(recentSites || []))
    }
  })

  useEffect(() => {
    if (searchTerm.length) {
      getData()
      setSearching(true)
    } else {
      setResultsType('saved')
      setLinks(saved)
    }
  }, [searchTerm])

  const focusOnIndex = index => {
    setFocusIndex(index)
    const link = links[index]
    if (link) {
      link.ref?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const clearSearch = () => {
    setSearching(false)
    searchRef.current.value = ''
    setFocusIndex(0)
    setKeyboardControl(true)
    searchRef.current.blur()
  }

  const resetSearch = () => {
    setSearchTerm('')
    setLinks(saved)
    setResultsType('saved')
    clearSearch()
  }

  const saveLink = link => {
    let updatedSaved = saved
    const index = saved.findIndex(({ slug }) => link.slug === slug)
    if (index >= 0) {
      updatedSaved.splice(index, 1)
    }
    updatedSaved.splice(0, 0, link)
    if (updatedSaved.length > 5) updatedSaved.splice(4, updatedSaved.length - 5)
    updateRecentSites({
      variables: { recentSites: saved.map(({ slug }) => slug) }
    })
  }

  const goToSite = () => {
    const link = links[focusIndex]
    if (link) {
      history.push(link.to)
      saveLink(link)
    }
    resetSearch()
  }

  const handleInputKeyUp = event => {
    switch (event.keyCode) {
      case 38:
        // up
        if (focusIndex > 0) {
          focusOnIndex(focusIndex - 1)
        } else {
          focusOnIndex(links.length - 1)
        }
        setKeyboardControl(true)
        return
      case 40:
        // down
        if (focusIndex < links.length - 1) {
          focusOnIndex(focusIndex + 1)
        } else {
          focusOnIndex(0)
        }
        setKeyboardControl(true)
        return
      case 13:
        // enter
        goToSite()
        return
      default:
        return
    }
  }

  const handleClickLink = link => {
    saveLink(link)
    resetSearch()
  }

  const startSearch = () => {
    searchRef.current.value = searchTerm
    setSearching(true)
    searchRef.current.focus()
  }

  return (
    <SearchHOC onSearch={startSearch} onCancel={clearSearch}>
      <Overlay
        active={searching}
        onClick={() => searching && setSearching(false)}
      />
      <Wrapper>
        <Box width={1} maxWidth="300px" mx="auto">
          <FormattedMessage id="navigation.menu.sites.search">
            {label => (
              <SearchInput
                data-testid="navigationSearch"
                active={searching}
                loading={loading}
                ref={searchRef}
                onFocus={startSearch}
                onBlur={() => setTimeout(clearSearch, 300)}
                onChange={setSearchTerm}
                placeholder={label}
                width={1}
                onKeyUp={handleInputKeyUp}
              />
            )}
          </FormattedMessage>
        </Box>
        <Results
          active={searching && (searchTerm.length || links.length)}
          data-testid="navigationSearchResults"
        >
          {links.length ? (
            <>
              <Title>
                <FormattedMessage
                  id={`navigation.search.${resultsType}.title`}
                />
              </Title>
              {links.map((link, index) => (
                <Link
                  key={index}
                  {...link}
                  disabled={keyboardControl}
                  active={keyboardControl && focusIndex === index}
                  onClick={handleClickLink}
                  onMouseEnter={() => {
                    setFocusIndex(index)
                    setKeyboardControl(false)
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Title>
                <FormattedMessage id="navigation.search.no_results.title" />
              </Title>
              <Item disabled={true} p={null} pt={0} px={2} pb={2}>
                <Text>
                  <FormattedMessage id="navigation.search.no_results.description" />
                </Text>
              </Item>
            </>
          )}
        </Results>
      </Wrapper>
    </SearchHOC>
  )
}

export default NavSearch
