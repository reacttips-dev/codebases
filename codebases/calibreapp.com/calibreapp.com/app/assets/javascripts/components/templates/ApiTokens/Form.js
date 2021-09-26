import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useQuery } from '@apollo/client'

import { GetApiScopes } from '../../../queries/ApiManagementQueries.gql'

import { Section, Lockup } from '../../Layout'
import { Flex, Box } from '../../Grid'
import Button from '../../Button'
import {
  Checkbox,
  CheckboxCard,
  FieldSet,
  FieldGroup,
  Input,
  Select,
  Elements,
  Label
} from '../../Forms'
import { LoadingLayout } from '../../Loading/'
import Feedback from '../Feedback'

import useFeedback from '../../../hooks/useFeedback'
import { useSession } from '../../../providers/SessionProvider'

const Avatar = React.lazy(() =>
  import(/* webpackChunkName: "avatar" */ '../../Avatar')
)

const ManageApiForm = ({
  orgId,
  onSubmit,
  saving,
  submitButtonText,
  ...initialAttributes
}) => {
  const intl = useIntl()
  const formRef = useRef()
  const { currentUser, memberships } = useSession()
  const [membership, setMembership] = useState()
  const [attributes, setAttributes] = useState(initialAttributes)
  const { feedback, clearFeedback } = useFeedback()
  const {
    tokenName,
    expiresIn,
    ipAddresses,
    permissions,
    lastUsed,
    createdBy,
    team
  } = attributes

  const [scopeCategoriesSelected, setScopeCategoriesSelected] = useState([])

  useEffect(() => {
    orgId ? setOrganisation(orgId) : setMembership(memberships[0])
  }, [orgId, memberships])

  const setOrganisation = orgId => {
    const membership = memberships.find(
      ({ organisation }) => organisation.slug === orgId
    )
    setMembership(membership)
  }
  const {
    organisation: { slug: organisation },
    teams
  } = membership || { organisation: {}, teams: [] }
  const teamOptions = [
    {
      label: intl.formatMessage({ id: 'apiToken.noTeam' }),
      value: ''
    },
    ...teams.map(({ name, slug }) => ({
      label: name,
      value: slug
    }))
  ]

  const { data, loading } = useQuery(GetApiScopes, {
    variables: {
      role: membership?.role
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      const scopeCategories = data.apiScopeCategories.map(scope => ({
        name: scope.name,
        selected: false
      }))
      setScopeCategoriesSelected(scopeCategories)
    }
  })

  const formatDate = date => {
    if (!date) return `Never`
    const parsedDate = parseISO(date)

    let startOfDay = new Date()
    startOfDay.setHours(0)
    startOfDay.setMinutes(0)
    startOfDay.setSeconds(0)

    if (parsedDate >= startOfDay) return 'Today'

    return `${formatDistanceToNow(parsedDate)} ago`
  }

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit({
      organisation,
      description: tokenName,
      scopes: permissions,
      ipAllowlist: ipAddresses,
      expiresIn: parseInt(expiresIn),
      team
    })
  }

  const expirationDurations = [
    { label: 'Never', value: 0 },
    { label: '1 day', value: 86400 },
    { label: '1 week', value: 604800 },
    { label: '1 month', value: 2629746 },
    { label: '3 months', value: 7889238 },
    { label: '6 months', value: 15778476 },
    { label: '1 year', value: 31556952 }
  ]

  const selectAllPermissions = scopeName => {
    let updatedSelection = scopeCategoriesSelected.map(category =>
      Object.assign({}, category)
    )

    const index = scopeCategoriesSelected.findIndex(i => i.name == scopeName)
    updatedSelection[index].selected = !scopeCategoriesSelected[index].selected

    setScopeCategoriesSelected(updatedSelection)
    const categoryIndex = data.apiScopeCategories.findIndex(
      i => i.name == scopeName
    )

    const permission = updatedSelection[index].selected ? 'select' : 'deselect'
    data.apiScopeCategories[categoryIndex].scopes.forEach(scope =>
      updatePermissions(scope.tag, permission)
    )
  }

  const updatePermissions = (tag, action) => {
    const tagIndex = permissions.indexOf(tag)
    if (action === 'select' && tagIndex === -1) {
      permissions.push(tag)
    }
    if (action === 'deselect' && tagIndex > -1) {
      permissions.splice(tagIndex, 1)
    }
    setAttributes({ ...attributes, permissions })
  }

  const togglePermission = tag => {
    const tagIndex = permissions.indexOf(tag)
    if (tagIndex > -1) {
      permissions.splice(tagIndex, 1)
    } else {
      permissions.push(tag)
    }
    setAttributes({ ...attributes, permissions })
  }

  const checkAllSelected = categoryName => {
    if (scopeCategoriesSelected.length > 0) {
      const category = data.apiScopeCategories.filter(
        category => category.name === categoryName
      )
      let tagCount = 0
      let selected = false
      category[0].scopes.forEach(scope => {
        const tagIndex = permissions.indexOf(scope.tag)
        if (tagIndex > -1) {
          tagCount++
        }
      })
      selected = tagCount === category[0].scopes.length

      let updatedSelection = scopeCategoriesSelected.map(category =>
        Object.assign({}, category)
      )
      const index = updatedSelection.findIndex(i => i.name == categoryName)

      updatedSelection[index].selected = selected
      if (
        updatedSelection[index].selected !=
        scopeCategoriesSelected[index].selected
      ) {
        setScopeCategoriesSelected(updatedSelection)
      }
      return selected
    } else {
      return false
    }
  }

  return (
    <>
      {feedback && feedback.location === 'manageApiForm' && (
        <Feedback onDismiss={() => clearFeedback()} {...feedback} />
      )}

      <form onSubmit={handleSubmit} ref={formRef} data-qa="pageForm">
        <Section p={null} px={4} pt={4}>
          <Lockup id="apiManagement.new.tokenSettings" mb={0} />

          <FieldSet mb={0}>
            <FieldGroup
              labelid="apiManagement.new.tokenSettings.label"
              span={2}
              helpid="apiManagement.new.tokenName.help"
            >
              <Input
                name="token_name"
                defaultValue={tokenName}
                required={true}
                maxLength={255}
                onChange={tokenName =>
                  setAttributes({ ...attributes, tokenName })
                }
                placeholder={'General CLI Usage'}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet mb={0}>
            <FieldGroup
              labelid="apiManagement.new.expiresIn.label"
              span={1}
              helpid="apiManagement.new.expiresIn.help"
            >
              <Select
                value={expiresIn}
                name="expires_in"
                options={expirationDurations}
                loading={false}
                onChange={expiresIn =>
                  setAttributes({ ...attributes, expiresIn })
                }
              />
            </FieldGroup>
            <FieldGroup
              labelid="apiManagement.new.allowedIp.label"
              span={1}
              helpid="apiManagement.new.allowedIp.help"
            >
              <Input
                name="ip_addresses"
                defaultValue={ipAddresses}
                required={false}
                onChange={ipAddresses =>
                  setAttributes({ ...attributes, ipAddresses })
                }
                placeholder="52.15.247.160/27"
              />
            </FieldGroup>
          </FieldSet>
          {createdBy && (
            <FieldSet mb={0}>
              <FieldGroup labelid="apiManagement.new.lastUsed">
                <Flex as="span" color="grey400">
                  {formatDate(lastUsed)}
                </Flex>
              </FieldGroup>
              {createdBy.name && (
                <FieldGroup labelid="apiManagement.new.createdBy">
                  <Flex as="span" color="grey400">
                    {createdBy.avatar && (
                      <Flex as="span" mr="8px">
                        <Suspense fallback={<div />}>
                          <Avatar
                            size="small"
                            name={createdBy.name}
                            url={createdBy.avatar}
                            variant={createdBy.membership.role}
                          />
                        </Suspense>
                      </Flex>
                    )}
                    <span>
                      {currentUser?.name === createdBy.name
                        ? 'You'
                        : createdBy.name}
                    </span>
                  </Flex>
                </FieldGroup>
              )}
            </FieldSet>
          )}
        </Section>

        <Section>
          {!loading ? (
            <>
              <Lockup id="apiManagement.new.permissions" mb={0} />
              {!orgId && memberships.length > 1 ? (
                <FieldSet mb={0}>
                  <FieldGroup
                    labelid="apiManagement.new.organisation.label"
                    span={2}
                  >
                    <Select
                      value={organisation}
                      name="organisation"
                      options={memberships.map(
                        ({ organisation: { name, slug } }) => ({
                          label: name,
                          value: slug
                        })
                      )}
                      loading={false}
                      onChange={organisation => setOrganisation(organisation)}
                    />
                  </FieldGroup>
                </FieldSet>
              ) : null}

              <FieldSet mb={0}>
                <FieldGroup
                  labelid="apiManagement.new.team.label"
                  span={2}
                  helpid="apiManagement.new.team.help"
                >
                  <Select
                    key={`${organisation}-team`}
                    value={team}
                    name="team"
                    options={teamOptions}
                    loading={false}
                    onChange={team => setAttributes({ ...attributes, team })}
                  />
                </FieldGroup>
              </FieldSet>

              {data.apiScopeCategories
                .filter(({ scopes }) => scopes.length)
                .map(({ name, scopes, label }) => (
                  <FieldSet key={name} mb={0}>
                    <FieldGroup span={2} key={name} mb={0}>
                      <Flex
                        flexWrap={['wrap', 'nowrap']}
                        alignItems="center"
                        mb={'15px'}
                      >
                        <Box flex={1} mb={0}>
                          <Label>{label}</Label>
                        </Box>
                        {scopes.length > 1 ? (
                          <Box mb={0}>
                            <Checkbox
                              id={`selectAll${name}`}
                              name={`selectAll${name}`}
                              checked={checkAllSelected(name)}
                              onChange={() => {
                                selectAllPermissions(name)
                              }}
                              level={'sm'}
                            >
                              <span data-qa={`selectAll${name}`}>
                                {checkAllSelected(name) ? (
                                  <FormattedMessage id="apiManagement.new.permissions.deselect" />
                                ) : (
                                  <FormattedMessage id="apiManagement.new.permissions.select" />
                                )}
                              </span>
                            </Checkbox>
                          </Box>
                        ) : null}
                      </Flex>
                      <Elements pb={1}>
                        {scopes.map(({ description, title, tag }) => (
                          <Box mb={'15px'} key={tag}>
                            <CheckboxCard
                              span={1}
                              uuid={tag}
                              label={title}
                              description={description}
                              key={tag}
                              checkboxClick={togglePermission}
                              checked={permissions?.includes(tag)}
                            />
                          </Box>
                        ))}
                      </Elements>
                    </FieldGroup>
                  </FieldSet>
                ))}
            </>
          ) : (
            <Section>
              <LoadingLayout />
            </Section>
          )}

          <Box mr={2} order={1}>
            <Button type="submit" variant="primary" loading={saving}>
              <FormattedMessage id={submitButtonText} />
            </Button>
          </Box>
        </Section>
      </form>
    </>
  )
}

export default ManageApiForm
