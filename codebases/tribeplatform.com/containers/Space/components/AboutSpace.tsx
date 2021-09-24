import React, { FC } from 'react'

import { Grid, VStack } from '@chakra-ui/react'
import { RemixiconReactIconComponentType } from 'remixicon-react'
import EarthFillIcon from 'remixicon-react/EarthFillIcon'
import EyeCloseFillIcon from 'remixicon-react/EyeCloseFillIcon'
import EyeFillIcon from 'remixicon-react/EyeFillIcon'
import Lock2FillIcon from 'remixicon-react/Lock2FillIcon'
import UserAddFillIcon from 'remixicon-react/UserAddFillIcon'

import { SpaceQuery } from 'tribe-api'
import { Card, Icon, SkeletonProvider, Text } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

export interface AboutSpaceProps {
  space: SpaceQuery['space']
  spaceLoading?: boolean
}

interface AboutFieldProps {
  icon: RemixiconReactIconComponentType
  title: string
  description: string
}

const AboutField: FC<AboutFieldProps> = ({ icon, title, description }) => (
  <Grid
    alignItems="center"
    columnGap={3}
    gridTemplateAreas="'icon title' 'icon description'"
    mb={4}
  >
    <Icon
      color="label.secondary"
      gridArea="icon"
      as={icon}
      width={5}
      height={5}
    />
    <Text color="label.primary" textStyle="medium/medium" gridArea="title">
      {title}
    </Text>
    <Text
      textStyle="regular/small"
      color="label.secondary"
      gridArea="description"
    >
      {description}
    </Text>
  </Grid>
)

export const AboutSpace = ({
  space,
  spaceLoading = false,
}: AboutSpaceProps) => {
  const { t } = useTranslation()
  return (
    <SkeletonProvider loading={spaceLoading}>
      <Card w="full">
        <VStack align="flex-start" spacing={4}>
          <Text textStyle="semibold/xlarge">
            <Trans i18nKey="space:about.title" defaults="About" />
          </Text>
          {space?.description && (
            <Text overflowWrap="anywhere" textStyle="regular/medium">
              {space.description}
            </Text>
          )}

          {!space?.private ? (
            <AboutField
              title={t('space:about.fields.public.title', 'Public')}
              description={t(
                'space:about.fields.public.description',
                'Anyone can view and browse this space.',
              )}
              icon={EarthFillIcon}
            />
          ) : (
            <AboutField
              title={t('space:about.fields.private.title', 'Private')}
              description={t(
                'space:about.fields.private.description',
                'Only space members can view and browse this space.',
              )}
              icon={Lock2FillIcon}
            />
          )}

          {!space?.hidden ? (
            <AboutField
              title={t('space:about.fields.visible.title', 'Visible')}
              description={t(
                'space:about.fields.visible.description',
                'Anyone can find this space.',
              )}
              icon={EyeFillIcon}
            />
          ) : (
            <AboutField
              title={t('space:about.fields.hidden.title', 'Hidden')}
              description={t(
                'space:about.fields.hidden.description',
                'Only space members can find this space.',
              )}
              icon={EyeCloseFillIcon}
            />
          )}

          {space?.inviteOnly && (
            <AboutField
              title={t('space:about.fields.invite_only.title', 'Invite-only')}
              description={t(
                'space:about.fields.invite_only.description',
                'Only invited people can join this space.',
              )}
              icon={UserAddFillIcon}
            />
          )}
        </VStack>
      </Card>
    </SkeletonProvider>
  )
}
