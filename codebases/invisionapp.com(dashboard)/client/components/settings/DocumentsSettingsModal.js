import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import withProps from 'recompose/withProps'
import {
  Dropdown,
  Toggle,
  Text,
  Link,
  Tag,
  Spaced,
  Button,
  Tooltip,
  Padded
} from '@invisionapp/helios'
import bffRequest from '../../utils/bffRequest'
import {
  selectCanStartProTrial,
  selectIsEnterprisePlan,
  selectIsFreehandPlan,
  selectIsFreePlan,
  selectIsOnTrial,
  selectIsProPlan
} from '../../stores/billing'
import { selectSeatIsAtQuota, selectSeatIsOverQuota } from '../../stores/restrictions'
import { showFlash } from '../../stores/flash'
import Feature from '../Feature'
import SettingsModal from './SettingsModal'
import {
  trackSharingCaptured,
  trackSharingClosed,
  trackSharingConfirmationModalCanceled,
  trackSharingConfirmationModalContinued,
  trackSharingConfirmationModalViewed,
  trackSharingUpdateSelected,
  trackSharingUpgradeBlockerSelected
} from '../../helpers/analytics'

const ModalSubHeading = () => (
  <>
    Decide who can see your team’s work.{' '}
    <Link
      order="secondary"
      target="_blank"
      href="https://support.invisionapp.com/hc/en-us/articles/360025875671"
    >
      <Strong>Learn more</Strong>
    </Link>
    .
  </>
)

const UpgradeTag = props => {
  return (
    <Spaced left="xs">
      <Tag compact inert>
        {props.children}
      </Tag>
    </Spaced>
  )
}

// { blocked: boolean, children: any, blockedText: any }
const BlockableRow = props => {
  return (
    <SettingsModal.Row style={{ position: 'relative' }}>
      {props.children}
      {props.blocked ? <BlockedRowOverlay>{props.blockedText}</BlockedRowOverlay> : null}
    </SettingsModal.Row>
  )
}

const Warning = ({ hideWarning, setFields, teamName, type }) => {
  const description =
    type === 'link'
      ? // Public link
        `If you turn off this setting, people will need to have the link and be a member of ` +
        `${teamName} to access a document moving forward. To undo this change, youʼll need to ` +
        `adjust each documentʼs settings individually.`
      : // Password
        'This will require passwords for all public share links to be opened. Any previously created public share links (without a password) will become inaccessible.'
  const fieldValues =
    type === 'link'
      ? { allowPublicLinkAccess: false, defaultLinkAccess: 'Members' }
      : { allowPrototypeShareLinksWithoutPassword: false }

  const onCancel = () => {
    hideWarning()
    trackSharingConfirmationModalCanceled(type)
  }

  const onSubmit = () => {
    setFields(fieldValues)
    hideWarning()
    trackSharingConfirmationModalContinued(type)
  }

  return (
    <>
      <Text order="title" size="smaller" color="text-darker" align="center">
        Are you sure?
      </Text>
      <Spaced top="s">
        <Text order="body" size="larger" align="center">
          {description}
        </Text>
      </Spaced>
      <ButtonRow centered>
        <Spaced right="s" top="xl">
          <Button type="cancel" order="secondary" size="larger" onClick={onCancel}>
            Never mind
          </Button>
        </Spaced>
        <Button type="submit" order="primary" size="larger" onClick={onSubmit}>
          Yes, continue
        </Button>
      </ButtonRow>
    </>
  )
}

const loadSettings = notifyError => {
  return bffRequest
    .get('/teams/api/team/settings/documents')
    .then(response => {
      const {
        allowPublicLinkAccess,
        allowTeamInvitesByMembers,
        allowUnauthenticatedPublicLinkViewing,
        allowPrototypeShareLinksWithoutPassword,
        defaultLinkAccess
      } = response.data

      trackSharingCaptured({
        allowPublicLinkAccess,
        allowTeamInvitesByMembers,
        allowUnauthenticatedPublicLinkViewing,
        allowPrototypeShareLinksWithoutPassword,
        defaultLinkAccess
      })
      return { ...response.data, teamID: undefined }
    })
    .catch(() => {
      notifyError('There was a problem loading your settings. Please try again.')
    })
}

const DocumentsSettingsModal = props => {
  const dispatch = useDispatch()

  // --- Selectors ---
  const isOnTrial = useSelector(selectIsOnTrial)
  const canStartProTrial = useSelector(selectCanStartProTrial)
  const isEnterprisePlan = useSelector(selectIsEnterprisePlan)
  const isFreePlan = useSelector(selectIsFreePlan)
  const isFreehandPlan = useSelector(selectIsFreehandPlan)
  const isProPlan = useSelector(selectIsProPlan)
  const seatIsAtQuota = useSelector(selectSeatIsAtQuota)
  const seatIsOverQuota = useSelector(selectSeatIsOverQuota)
  const quotaRestriction = seatIsAtQuota || seatIsOverQuota

  // --- Hooks ---
  const [showWarning, setShowWarning] = useState(false)
  const [warningType, setWarningType] = useState('link')

  // --- Dispatchers ---
  const updateDocumentsSettings = settings =>
    bffRequest.patch('/teams/api/team/settings/documents', settings)
  const notifyError = message => dispatch(showFlash({ message, status: 'danger' }))

  const initialFields = loadSettings(notifyError)

  useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      trackSharingClosed()
    }
  }, [])

  const onSubmit = fields => {
    trackSharingUpdateSelected()

    return updateDocumentsSettings(fields).then(() => {
      const {
        allowPrototypeShareLinksWithoutPassword,
        allowPublicLinkAccess,
        allowTeamInvitesByMembers,
        allowUnauthenticatedPublicLinkViewing,
        defaultLinkAccess
      } = fields

      trackSharingCaptured({
        allowPrototypeShareLinksWithoutPassword,
        allowPublicLinkAccess,
        allowTeamInvitesByMembers,
        allowUnauthenticatedPublicLinkViewing,
        defaultLinkAccess,
        updatedAt: new Date()
      })
      return 'Your document settings have been saved'
    })
  }

  const hideWarning = () => {
    setShowWarning(false)
  }

  const isAtLeastProPlan = isProPlan || isEnterprisePlan || isFreehandPlan

  const fieldBlocked = field => {
    switch (field) {
      case 'allowPublicLinkAccess':
      case 'allowTeamInvitesByMembers': {
        return isAtLeastProPlan === false
      }
      case 'allowPrototypeShareLinksWithoutPassword':
      case 'allowUnauthenticatedPublicLinkViewing': {
        return isEnterprisePlan === false
      }
      default: {
        return false
      }
    }
  }

  const shouldRequestEntepriseDemo = () =>
    isFreePlan || (isProPlan && isOnTrial) || (isProPlan && !quotaRestriction)

  const handleAllowPublicLinkAccessChange = (fieldValue, setFields) => {
    if (fieldValue === false) {
      setShowWarning(true)
      setWarningType('link')
      trackSharingConfirmationModalViewed('link')
    } else {
      setFields({
        allowPublicLinkAccess: true
      })
    }
  }

  const handleShareLinksWithoutPasswordChange = (fieldValue, setFields) => {
    if (fieldValue === true) {
      setShowWarning(true)
      setWarningType('password')
      trackSharingConfirmationModalViewed('password')
    } else {
      setFields({
        allowPrototypeShareLinksWithoutPassword: true
      })
    }
  }

  const renderLinkAccessBlocker = () => {
    const linkText = canStartProTrial ? 'Start a trial' : 'Upgrade to pro'
    const linkUrl = canStartProTrial ? '/billing/trial' : '/billing/upgrade'

    return (
      <>
        <Padded horizontal="s">
          <Text style={{ flex: 1 }} order="body">
            Upgrade to the <strong style={{ fontWeight: 500 }}>Pro plan</strong> to share
            documents through their link
          </Text>
          <div>
            <Button
              onClick={() => trackSharingUpgradeBlockerSelected('pro')}
              element="a"
              href={linkUrl}
              data-test-selector="link-access-button"
            >
              {linkText}
            </Button>
          </div>
        </Padded>
      </>
    )
  }

  const renderTeamInvitesBlocker = () => {
    const linkText = canStartProTrial ? 'Start a trial' : 'Upgrade to pro'
    const linkUrl = canStartProTrial ? '/billing/trial' : '/billing/upgrade'

    return (
      <>
        <Padded horizontal="s">
          <Text style={{ flex: 1 }} order="body">
            Upgrade to the <strong style={{ fontWeight: 500 }}>Pro plan</strong> to let members
            grow the team
          </Text>
          <div>
            <Button
              onClick={() => trackSharingUpgradeBlockerSelected('pro')}
              element="a"
              href={linkUrl}
              data-test-selector="team-invites-button"
            >
              {linkText}
            </Button>
          </div>
        </Padded>
      </>
    )
  }

  const renderPrototypeShareBlocker = () => {
    const upgradeText = shouldRequestEntepriseDemo() ? 'Request a demo' : 'Start a trial'
    const upgradeUrl = shouldRequestEntepriseDemo()
      ? '/billing/enterprise-contact'
      : '/billing/trial'

    return (
      <>
        <Padded horizontal="s">
          <Text style={{ flex: 1 }} order="body">
            Upgrade to the <strong style={{ fontWeight: 500 }}>Enterprise plan</strong> to
            password protect <br /> public share links
          </Text>
          <div>
            <Button
              onClick={() => trackSharingUpgradeBlockerSelected('enterprise')}
              element="a"
              data-test-selector="enterprise-request-button"
              order={isProPlan ? 'primary' : 'primary-alt'}
              href={upgradeUrl}
            >
              {upgradeText}
            </Button>
          </div>
        </Padded>
      </>
    )
  }

  const renderLinkAccessDropdown = (setFields, fields) => {
    // Only allow this field to change if the related field is active
    const handleClick = data => fields.allowPublicLinkAccess && setFields(data)

    const anyoneValue = 'Anyone with link access'
    const membersValue = 'Team members with the link'
    const humanizedValue = fields.defaultLinkAccess === 'Anyone' ? anyoneValue : membersValue

    return (
      <LinkAccessDropdown
        id="defaultLinkAccess"
        align="right"
        closeOnClick
        placement="bottom"
        trigger={humanizedValue}
        disabled={!fields.allowPublicLinkAccess}
        items={[
          {
            label: anyoneValue,
            type: 'item',
            onClick: () => handleClick({ defaultLinkAccess: 'Anyone' })
          },
          {
            label: membersValue,
            type: 'item',
            onClick: () => handleClick({ defaultLinkAccess: 'Members' })
          }
        ]}
      />
    )
  }

  const renderFields = ({ setFields, form }) => {
    const fields = form.getFields()

    return (
      <>
        <Feature
          flag="team-management-web-accts-5353-config-view-links"
          renderActive={
            <BlockableRow
              blocked={fieldBlocked('allowUnauthenticatedPublicLinkViewing')}
              blockedText={renderPrototypeShareBlocker()}
            >
              <SettingsModal.Label>
                <label htmlFor="allowUnauthenticatedPublicLinkViewing">
                  <LabelTitle>
                    Let anyone view public links{' '}
                    {fieldBlocked('allowUnauthenticatedPublicLinkViewing') ? (
                      <UpgradeTag>Ent</UpgradeTag>
                    ) : null}
                  </LabelTitle>
                  <LabelSubtitle>
                    Allow all viewers—including those who aren{"'"}t part of the team—to access
                    public links
                  </LabelSubtitle>
                </label>
              </SettingsModal.Label>
              <SettingsModal.Field>
                <Toggle
                  id="allowUnauthenticatedPublicLinkViewing"
                  checked={fields?.allowUnauthenticatedPublicLinkViewing ?? false}
                  disabled={fieldBlocked('allowUnauthenticatedPublicLinkViewing')}
                  onChange={() =>
                    setFields({
                      allowUnauthenticatedPublicLinkViewing: !fields.allowUnauthenticatedPublicLinkViewing
                    })
                  }
                />
              </SettingsModal.Field>
            </BlockableRow>
          }
        />

        <BlockableRow
          blocked={fieldBlocked('allowPublicLinkAccess')}
          blockedText={renderLinkAccessBlocker()}
        >
          <SettingsModal.Label>
            <label htmlFor="allowPublicLinkAccess">
              <LabelTitle>
                Let the team make document links open to anyone{' '}
                {fieldBlocked('allowPublicLinkAccess') ? <UpgradeTag>Pro</UpgradeTag> : null}
              </LabelTitle>
              <LabelSubtitle>
                Give everyone on the team (excluding guests) the authority to make documents
                viewable by anonymous users with the document link. This will allow anonymous
                users to register and join your account with the guest role.
              </LabelSubtitle>
            </label>
          </SettingsModal.Label>
          <SettingsModal.Field>
            <Toggle
              id="allowPublicLinkAccess"
              checked={fields?.allowPublicLinkAccess ?? false}
              disabled={fieldBlocked('allowPublicLinkAccess')}
              onChange={() => {
                handleAllowPublicLinkAccessChange(!fields.allowPublicLinkAccess, setFields)
              }}
            />
          </SettingsModal.Field>
        </BlockableRow>

        <SettingsModal.Row>
          <SettingsModal.Label>
            <label htmlFor="defaultLinkAccess">
              <LabelTitle>Set the default document setting</LabelTitle>
              <LabelSubtitle>Select who can open new documents by default.</LabelSubtitle>
            </label>
          </SettingsModal.Label>
          <SettingsModal.Field>
            {fields.allowPublicLinkAccess ? (
              renderLinkAccessDropdown(setFields, fields)
            ) : (
              <CenteredTooltip
                chevron="center"
                color="dark"
                placement="top"
                trigger={renderLinkAccessDropdown(setFields, fields)}
                withRelativeWrapper
              >
                Enable {"'"}Anyone with the link{"'"} access
                <br /> to change this setting
              </CenteredTooltip>
            )}
          </SettingsModal.Field>
        </SettingsModal.Row>

        <BlockableRow
          blocked={fieldBlocked('allowTeamInvitesByMembers')}
          blockedText={renderTeamInvitesBlocker()}
        >
          <SettingsModal.Label>
            <label htmlFor="allowTeamInvitesByMembers">
              <LabelTitle>
                Let members invite people from within documents and spaces{' '}
                {fieldBlocked('allowTeamInvitesByMembers') ? (
                  <UpgradeTag>Pro</UpgradeTag>
                ) : null}
              </LabelTitle>
              <LabelSubtitle>
                Allow team members (not guests) to add new people to your team from a doc
                <br />
                or space.
              </LabelSubtitle>
            </label>
          </SettingsModal.Label>
          <SettingsModal.Field>
            <Toggle
              id="allowTeamInvitesByMembers"
              checked={fields?.allowTeamInvitesByMembers ?? false}
              disabled={fieldBlocked('allowTeamInvitesByMembers')}
              onChange={() =>
                setFields({
                  allowTeamInvitesByMembers: !fields.allowTeamInvitesByMembers
                })
              }
            />
          </SettingsModal.Field>
        </BlockableRow>

        <BlockableRow
          blocked={fieldBlocked('allowPrototypeShareLinksWithoutPassword')}
          blockedText={renderPrototypeShareBlocker()}
        >
          <SettingsModal.Label>
            <label htmlFor="allowPrototypeShareLinksWithoutPassword">
              <LabelTitle>
                Require passwords for public share links{' '}
                {fieldBlocked('allowPrototypeShareLinksWithoutPassword') ? (
                  <UpgradeTag>Ent</UpgradeTag>
                ) : null}
              </LabelTitle>
              <LabelSubtitle>
                Add a password to every document’s public share link.
              </LabelSubtitle>
            </label>
          </SettingsModal.Label>
          <SettingsModal.Field>
            <Toggle
              id="allowPrototypeShareLinksWithoutPassword"
              checked={!fields.allowPrototypeShareLinksWithoutPassword}
              disabled={fieldBlocked('allowPrototypeShareLinksWithoutPassword')}
              onChange={() => {
                handleShareLinksWithoutPasswordChange(
                  fields.allowPrototypeShareLinksWithoutPassword,
                  setFields
                )
              }}
            />
          </SettingsModal.Field>
        </BlockableRow>
      </>
    )
  }

  const { ...forwardProps } = props
  return (
    <SettingsModal
      initialFields={initialFields}
      {...forwardProps}
      heading="Team sharing settings"
      subheading={<ModalSubHeading />}
      onSubmit={onSubmit}
      renderCustom={({ teamName, setFields }) => (
        <Warning
          hideWarning={hideWarning}
          setFields={setFields}
          teamName={teamName}
          type={warningType}
        />
      )}
      showCustom={showWarning}
    >
      {renderFields}
    </SettingsModal>
  )
}

const CenteredTooltip = styled(Tooltip)`
  text-align: center;
`

const LabelTitle = withProps({ order: 'body' })(styled(Text)`
  font-weight: 500;
`)

const LabelSubtitle = withProps({
  size: 'smaller',
  color: 'text-lighter',
  order: 'body'
})(styled(Text)`
  padding-top: ${props => props.theme.spacing.xxs};
`)

const LinkAccessDropdown = styled(Dropdown)`
  [role='menu'] {
    width: 220px;
  }

  ${props =>
    props.disabled
      ? `
          position: relative;

          &:after {
            background-color: rgba(255,255,255,0.7);
            content: '';
            display: block;
            left: 0;
            position: absolute;
            height: 100%;
            top: 0;
            width: 100%;
          }
        `
      : ''};
`

const BlockedRowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  opacity: 0;
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`

const Strong = styled.strong`
  color: ${props => props.theme.palette.text.darker};
  font-weight: 500;
`
const ButtonRow = styled.div(
  props => `
  ${props.centered ? 'text-align: center;' : ''};
`
)

export default DocumentsSettingsModal
