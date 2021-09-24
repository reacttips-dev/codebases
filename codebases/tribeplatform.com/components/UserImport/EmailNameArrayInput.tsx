import React, { FC, useEffect, useRef, useState } from 'react'

import { Box, ButtonProps, Grid, LinkProps } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import AddCircleFillIcon from 'remixicon-react/AddCircleFillIcon'

import {
  CloseButton,
  FormLabel,
  Icon,
  Link,
  Text,
  TextInput,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

import { isAdminEmailNotConfirmed } from 'utils/auth'
import { EMAIL_PATTERN } from 'utils/validator.utils'

import { ImportFormContext } from './useUserImportForm'

type ToggleImportModeLinkProps = Pick<ButtonProps, 'isDisabled'> &
  Pick<LinkProps, 'onClick'>

const ToggleImportModeLink: FC<ToggleImportModeLinkProps> = ({
  isDisabled,
  onClick,
  children,
}) => (
  <Link
    opacity={
      isDisabled ? 'var(--tribe-opacity-disabled)' : 'var(--tribe-opacity-none)'
    }
    onClick={isDisabled ? undefined : onClick}
    color="accent.base"
    href="#"
  >
    {children}
  </Link>
)

export interface EmailNameArrayInputProps {
  name: string
}

export const EmailNameArrayInput: React.FC<EmailNameArrayInputProps> = ({
  name,
}) => {
  const { t } = useTranslation()
  const {
    register,
    errors,
    entries,
    showManyAtOnce,
    appendEntry,
    removeEntry,
  } = useFormContext() as ImportFormContext
  const fieldsContainerRef = useRef<HTMLDivElement>(null)
  const { authUser } = useAuthMember()
  const [hoverRowIndex, setHoverRowIndex] = useState<number | undefined>(
    undefined,
  )

  useEffect(() => {
    const container = fieldsContainerRef.current

    // Focus on first the input element
    setTimeout(
      () =>
        (container?.firstElementChild?.firstElementChild
          ?.firstElementChild as HTMLElement)?.focus?.(),
      0,
    )
  }, [])

  const adminEmailNotConfirmed = isAdminEmailNotConfirmed(authUser)

  return (
    <Box>
      <Grid templateColumns="6fr 6fr 1fr" gap="2">
        <FormLabel htmlFor={`${name}.0.email`} mb={0} />
        <FormLabel htmlFor={`${name}.0.name`} mb={0} />
        <div />
      </Grid>

      <Box maxH="lg" overflowX="visible" overflowY="auto" p="2" ml={-2}>
        <Box ref={fieldsContainerRef}>
          {entries?.fields?.map((item, index) => {
            const fieldName = `${name}.${index}`
            return (
              <Grid
                key={item.id}
                templateColumns={
                  adminEmailNotConfirmed ? '6fr 6fr' : '6fr 6fr 1fr'
                }
                gap="2"
                borderRadius="md"
                sx={{
                  _hover: {
                    background:
                      hoverRowIndex === index ? 'danger.hover' : 'bg.secondary',
                  },
                }}
                p="2"
                m={-2}
              >
                <TextInput
                  name={`${fieldName}.email`}
                  placeholder={t('userimport.email.label', 'Email address')}
                  data-testid={`${fieldName}.email`}
                  ref={register({
                    required: {
                      value: true,
                      message: t(
                        'common:validation.empty',
                        "This field can't be empty",
                      ),
                    },
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: t(
                        'common:validation.emailFormat',
                        'Invalid email address',
                      ),
                    },
                  })}
                  defaultValue={item.email}
                  error={errors[name]?.[index]?.email?.message}
                  isDisabled={adminEmailNotConfirmed}
                />

                <TextInput
                  name={`${fieldName}.name`}
                  data-testid={`${fieldName}.name`}
                  defaultValue={item.name}
                  placeholder={t('userimport:name.label', 'Name (optional)')}
                  ref={register()}
                  isDisabled={adminEmailNotConfirmed}
                />

                {!adminEmailNotConfirmed && (
                  <Box pt="1">
                    <CloseButton
                      onClick={() => removeEntry(index)}
                      data-testid={`${fieldName}.remove`}
                      aria-label={t('common:remove', 'Remove')}
                      sx={{
                        color: 'label.primary',
                      }}
                      onMouseLeave={() => {
                        setHoverRowIndex(undefined)
                      }}
                      onMouseEnter={() => {
                        setHoverRowIndex(index)
                      }}
                    />
                  </Box>
                )}
              </Grid>
            )
          })}
        </Box>
      </Box>

      <Text lineHeight={2} data-testid="invite-modal-toggle-mode">
        <Trans
          i18nKey="userimport:togglemode"
          defaults="<0><0></0>Add another</0> or <4>multiple at once</4>"
        >
          <ToggleImportModeLink
            isDisabled={adminEmailNotConfirmed}
            onClick={appendEntry}
          >
            <Icon as={AddCircleFillIcon} h={6} w={6} mr={2} />
          </ToggleImportModeLink>{' '}
          or{' '}
          <ToggleImportModeLink
            isDisabled={adminEmailNotConfirmed}
            onClick={showManyAtOnce}
          >
            multiple at once
          </ToggleImportModeLink>
        </Trans>
      </Text>
    </Box>
  )
}
