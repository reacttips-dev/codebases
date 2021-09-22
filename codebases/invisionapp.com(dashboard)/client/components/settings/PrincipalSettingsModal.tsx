import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import withProps from 'recompose/withProps'
import debounce from 'lodash/debounce'
import {
  Adjacent,
  Button,
  Input,
  Label,
  List,
  LoadingDots,
  Spaced,
  Text
} from '@invisionapp/helios'

import { selectTeam, updateTeam } from '../../stores/team'
import { showFlash } from '../../stores/flash'
import { bindActionToPromise } from '../../stores/utils/promiseActions'

import API from '../../api'
import { BFFResponse } from '../../utils/bffRequest'

import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import Wrapper from '../modals/Wrapper'

import { validTeamName, validSubdomain } from '../../helpers/validators'
import {
  trackSettingsPrincipalClosed,
  trackSettingsPrincipalName,
  trackSettingsPrincipalDomain,
  trackSettingsPrincipalFailed
} from '../../helpers/analytics'

type PrincipalSettingsData = { name?: string; subdomain?: string }

type PrincipalSettingsModalProps = {
  name: string
  subdomain: string
  updatePrincipalSettings: (data: PrincipalSettingsData) => Promise<any>
  notifySuccess: (message: string) => void
  notifyError: (message: string) => void
  closePortal: () => void
  onBack: () => void
  isVisible?: boolean
}

const PrincipalSettingsModal = (props: PrincipalSettingsModalProps) => {
  const { onBack, isVisible } = props

  // Selectors
  const team = useSelector(selectTeam)

  // Hooks
  const [isPristine, setIsPristine] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [currentName, setCurrentName] = useState(team.name)
  const [currentNameError, setCurrentNameError] = useState('')
  const [currentSubdomain, setCurrentSubdomain] = useState(team.subdomain)
  const [currentSubdomainError, setCurrentSubdomainError] = useState('')

  // Dispatchers
  const dispatch = useDispatch()
  const update = bindActionToPromise(dispatch, updateTeam.request)
  // we always send both 'name' and 'subdomain' values
  const updatePrincipalSettings = (settings: PrincipalSettingsData) =>
    update({ data: settings })
  const notifyError = (message: string) => dispatch(showFlash({ message, status: 'danger' }))
  const notifySuccess = (message: string) =>
    dispatch(showFlash({ message, status: 'success' }))

  const checkIsPristine = ({ name, subdomain }: { name?: string; subdomain?: string }) => {
    if (name) {
      return currentSubdomain === team.subdomain && name === team.name
    }
    if (subdomain) {
      return subdomain === team.subdomain && currentName === team.name
    }
    return false
  }

  const checkSubdomain = debounce(subdomain => {
    const response = API.checkSubdomain(subdomain)

    setIsValidating(true)

    response.then((response: BFFResponse) => {
      if (response.status !== 204 && subdomain !== team.subdomain) {
        // inline error
        setCurrentSubdomainError('That domain is taken or not valid')
        setIsValid(false)
      } else {
        // subdomain is available
        setIsValidating(false)
        setIsValid(true)
      }
    })
  }, 300)

  const onChangeSubdomain = (event: ChangeEvent<HTMLInputElement>) => {
    const subdomain = event.target.value
    const error = validSubdomain(subdomain) ?? ''

    setCurrentSubdomain(subdomain)
    setIsPristine(checkIsPristine({ subdomain }))
    setCurrentSubdomainError(error)
    setIsValid(!!error === false)

    // don't continue if there's an error from validators
    if (!!error === true) {
      return
    }

    checkSubdomain(subdomain)
  }

  const editName = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    const error = validTeamName(name) ?? ''

    setCurrentName(name)
    setIsPristine(checkIsPristine({ name }))
    setCurrentNameError(error)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)

    return updatePrincipalSettings({ name: currentName, subdomain: currentSubdomain })
      .then(() => {
        // the value on `team` is the initialValue and state is the current value
        if (team.name !== currentName) {
          trackSettingsPrincipalName()
        }
        if (team.subdomain !== currentSubdomain) {
          trackSettingsPrincipalDomain()

          // INSERT THE REDIRECT HERE <-----------<<
        }
        notifySuccess('Your principal settings have been saved.')
        props.closePortal()
      })
      .catch(() => {
        trackSettingsPrincipalFailed()
        notifyError('There was a problem saving your settings. Please try again.')
        setIsLoading(false)
      })
  }

  const handleClosePortal = () => {
    trackSettingsPrincipalClosed()

    props.closePortal()
  }

  return (
    <ModalContent
      closePortal={handleClosePortal}
      showWarning={isPristine === false}
      // @ts-ignore
      closeWarning={<ModalCloseWarning />}
      onBack={onBack}
      isVisible={isVisible}
    >
      <SkinnyWrapper>
        <StyledHeading order="title" size="smaller" color="text-darker" align="center">
          Principal Settings
        </StyledHeading>
        <StyledSubheading order="body" size="larger" color="text-lighter" align="center">
          Your team name is <Strong>{team.name}</Strong> and your domain is{' '}
          <Strong>{team.subdomain}.invisionapp.com</Strong>
        </StyledSubheading>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="name">Team name</Label>
          <Input
            id="name"
            type="text"
            value={currentName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => editName(e)}
            inputStatus={currentNameError ? 'danger' : undefined}
          />
          <Danger>{currentNameError}</Danger>

          <Spaced top="m">
            <Label htmlFor="domain">Team domain</Label>
          </Spaced>
          <Adjacent spacing="xxs" style={{ alignItems: 'center' }}>
            <Input
              id="domain"
              type="text"
              value={currentSubdomain}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeSubdomain(e)}
              inputStatus={currentSubdomainError ? 'danger' : undefined}
            />
            <Domain order="body">.invisionapp.com</Domain>
          </Adjacent>
          <Danger>{currentSubdomainError}</Danger>

          <Spaced top="m">
            <Text order="subtitle" size="smaller" color="text-darker">
              <Strong>What to know before changing your team domain</Strong>
            </Text>
            <BulletList
              order="unordered"
              size="smaller"
              items={[
                'All document links that have been shared externally will stop working',
                'Public links will not redirect, and embedded screen links will stop working',
                'You will need to resend pending invitations',
                'You will need to update services that use your domain (like SSO)',
                'InVision will eventually release your old domain for others to claim'
              ]}
            />
          </Spaced>

          <ButtonWrapper>
            <Button
              type="submit"
              order="primary"
              size="larger"
              disabled={isPristine || isLoading || isValidating || !isValid}
            >
              {isLoading || isValidating ? <CenteredLoadingDots color="white" /> : 'Confirm'}
            </Button>
          </ButtonWrapper>
        </form>
      </SkinnyWrapper>
    </ModalContent>
  )
}

const SkinnyWrapper = styled(Wrapper)`
  width: 600px;
`

const StyledHeading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`

const StyledSubheading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const Strong = styled.strong`
  color: ${props => props.theme.palette.text.darker};
  font-weight: 500;
`

const Domain = styled(Text)`
  vertical-align: middle;
`

const Danger = withProps({
  order: 'body',
  color: 'danger',
  size: 'smaller'
  // @ts-ignore
})(styled(Text)`
  position: absolute;
  padding-top: 2px;
`)

const ButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const CenteredLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const BulletList = styled(List)`
  margin-top: ${({ theme }) => theme.spacing.xs};
  list-style-type: disc;
`

// @ts-ignore - ignoring because this will get repalced with hooks when this file gets converted
export default PrincipalSettingsModal
