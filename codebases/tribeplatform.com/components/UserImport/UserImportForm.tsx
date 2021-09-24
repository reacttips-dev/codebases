import React from 'react'

import { HStack, VStack } from '@chakra-ui/layout'
import { Box, Skeleton } from '@chakra-ui/react'
import { Controller, FormProvider } from 'react-hook-form'
import ErrorWarningFillIcon from 'remixicon-react/ErrorWarningFillIcon'

import { PlanName } from 'tribe-api'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Text,
  TextareaInput,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { UpgradeTouchpointLink } from 'components/common/UpgradeTouchpointLink'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useAuthMember from 'hooks/useAuthMember'
import useMemberCapacity from 'hooks/useMemberCapacity'

import { isAdminEmailNotConfirmed } from 'utils/auth'
import { enumI18nPlanName } from 'utils/enums'

import { CustomMessageInput } from './CustomMessageInput'
import { EmailNameArrayInput } from './EmailNameArrayInput'
import { SpaceMultipleAutocomplete } from './SpaceMultipleAutocomplete'
import { useUserImportContext } from './UserImportContext'
import { UserImportFormProps, useUserImportForm } from './useUserImportForm'

export interface FormProps {
  onCancel: () => void
  onSubmit: (result: UserImportFormProps) => void
}

export const UserImportForm: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation()
  const context = useUserImportContext()
  const { authUser } = useAuthMember()
  const {
    didReachLimit,
    isApproachingLimit,
    isLoading: isMemberCapacityLoading,
    memberCapacity,
    memberCapacityDeclared,
    totalInvitationCount,
  } = useMemberCapacity()
  const { network } = useGetNetwork()
  const plan = network?.subscriptionPlan
  const trial = plan?.trial

  const shouldDisplayMembersCapacity =
    trial ||
    plan?.name === PlanName.BASIC ||
    (plan?.name === PlanName.PLUS && isApproachingLimit) ||
    (plan?.name === PlanName.PLUS && didReachLimit) ||
    (plan?.name === PlanName.PREMIUM && isApproachingLimit) ||
    (plan?.name === PlanName.PREMIUM && didReachLimit) ||
    (plan?.name === PlanName.ENTERPRISE && isApproachingLimit) ||
    (plan?.name === PlanName.ENTERPRISE && didReachLimit)

  const submitDisabled = isAdminEmailNotConfirmed(authUser)

  const formMethods = useUserImportForm()
  const { form: methods, hideManyAtOnce, manyAtOnce, parseMultipleEmails } =
    formMethods || {}

  const { control, errors, handleSubmit, register, setValue } =
    formMethods.form || {}

  const submit = data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { multipleEmails, ...rest } = data

    // After deleting last entry it's not being reflected in
    // the form's state so we get rid of empty internal entries
    const entries = rest.entries.filter(({ email }) => email)

    onSubmit({ ...rest, entries })
  }

  return (
    <FormProvider {...{ ...methods, ...formMethods }}>
      <form onSubmit={handleSubmit(submit)}>
        <VStack align="stretch" spacing="5">
          {!manyAtOnce ? (
            <>
              <EmailNameArrayInput name="entries" />

              <FormControl id="spaces" isInvalid={!!errors?.spaces}>
                <FormLabel textStyle="medium/medium">
                  <Trans
                    i18nKey="userimport:spaces.label"
                    defaults="Spaces to join"
                  />
                </FormLabel>
                {context && (
                  <Controller
                    control={control}
                    name="spaces"
                    defaultValue={context?.defaultSpaces}
                    render={({ onChange, onBlur, value, name }) => (
                      <SpaceMultipleAutocomplete
                        loading={context.loading}
                        name={name}
                        options={context.spaces}
                        onSearch={context.onSpaceSearch}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                    rules={{
                      required: {
                        value: true,
                        message: t('common:validation.empty', {
                          defaultValue: "This field can't be empty",
                        }),
                      },
                      validate: {
                        minlength: value =>
                          Array.isArray(value) && value.length > 0,
                      },
                    }}
                  />
                )}
                {errors?.spaces &&
                  (errors?.spaces as any)?.type === 'minlength' && (
                    <FormErrorMessage>
                      <Trans
                        i18nKey="userimport:spaces.error.empty"
                        defaults="Select at least one space"
                      />
                    </FormErrorMessage>
                  )}
              </FormControl>

              <CustomMessageInput
                register={register}
                errors={errors}
                setValue={setValue}
              />

              <HStack justify="flex-end">
                <Box marginRight="auto">
                  {isMemberCapacityLoading && (
                    <Skeleton width={72} height={8} />
                  )}

                  {!isMemberCapacityLoading && shouldDisplayMembersCapacity && (
                    <HStack align="center" justify="flex-start" spacing={3}>
                      {(didReachLimit || isApproachingLimit) && (
                        <Icon
                          as={ErrorWarningFillIcon}
                          h="5"
                          w="5"
                          color={didReachLimit ? 'danger.base' : 'warning.base'}
                        />
                      )}

                      <VStack align="flex-start" spacing={0}>
                        <Text textStyle="regular/small" color="label.primary">
                          <Trans
                            components={{ bold: <strong /> }}
                            i18nKey="member:invitationsLeftOut"
                            defaults="<bold>{{ invitationsLeft, numberWithCommas }} invitations</bold> left out of {{ memberCapacity, numberWithCommas }} for your {{planName}} plan"
                            values={{
                              invitationsLeft:
                                memberCapacity -
                                (memberCapacityDeclared + totalInvitationCount),
                              memberCapacity,
                              planName: enumI18nPlanName(
                                plan?.name,
                              )?.toLowerCase(),
                            }}
                          />
                        </Text>

                        <UpgradeTouchpointLink>
                          <Trans
                            i18nKey="member:upgradeToSendMore"
                            defaults="Upgrade to send more"
                          />
                        </UpgradeTouchpointLink>
                      </VStack>
                    </HStack>
                  )}
                </Box>

                <HStack justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    data-testid="cancel-import-form"
                  >
                    <Trans i18nKey="common:cancel" defaults="Cancel" />
                  </Button>
                  <Button
                    type="submit"
                    buttonType="primary"
                    isDisabled={submitDisabled}
                    data-testid="submit-import-form"
                  >
                    <Trans i18nKey="common:submit" defaults="Submit" />
                  </Button>
                </HStack>
              </HStack>
            </>
          ) : (
            <>
              <TextareaInput
                name="multipleEmails"
                label={t(
                  'userimport:manyatonce.label',
                  'Enter multiple email addresses',
                )}
                helperText={t(
                  'userimport:manyatonce.helperText',
                  'Use commas to separate addresses',
                )}
                ref={register()}
                data-testid="invite-modal-multiple-emails-textarea"
                error={errors?.multipleEmails?.message}
              />
              <HStack justify="flex-end">
                <Button type="reset" variant="outline" onClick={hideManyAtOnce}>
                  <Trans i18nKey="common:back" defaults="Back" />
                </Button>
                <Button
                  data-testid="invite-modal-add-invitees-button"
                  onClick={parseMultipleEmails}
                >
                  <Trans
                    i18nKey="userimport:invitees.add"
                    defaults="Add invitees"
                  />
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </form>
    </FormProvider>
  )
}
