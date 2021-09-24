import React, { useCallback } from 'react'

import { Box } from '@chakra-ui/layout'

import { DomainTransferStatus } from 'tribe-api'
import {
  Alert,
  AlertDescription,
  Divider,
  Skeleton,
  SkeletonProvider,
  TableColumnWrapper,
  TableWrapper,
  Text,
  Tooltip,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import IconCell from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/IconCell'
import TextCell from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/components/TextCell'

interface FormTableProps {
  domainStatus: DomainTransferStatus
  isLoading?: boolean
}

function FormTable({
  domainStatus,
  isLoading = false,
}: FormTableProps): JSX.Element {
  const { t } = useTranslation()

  const getData = useCallback(() => {
    const data: (Partial<DomainTransferStatus> & {
      type: string
      host: string
      value: string
      target: string
    })[] = []

    if (domainStatus?.root) {
      data.push({
        type: 'A',
        host: '@',
        value: domainStatus?.arecords.join(', '),
        success: domainStatus?.arecordSuccess,
        target: domainStatus?.tribeARecords[0],
      })
    }

    data.push({
      type: 'CNAME',
      host: (domainStatus?.root ? 'www.' : '') + domainStatus?.domain,
      value: domainStatus?.cnames.join(', '),
      success: domainStatus?.cnameSuccess,
      target: domainStatus?.tribeCname,
    })

    if (!domainStatus?.aaaarecordSuccess) {
      data.push({
        type: 'AAAA',
        host: '@',
        value: domainStatus?.aaaarecords.join(', '),
        success: domainStatus?.aaaarecordSuccess,
        target: 'Delete this record',
      })
    }

    return data
  }, [domainStatus])

  const getStatusIcon = data => {
    if (data?.success) return <IconCell success />

    const label = data?.value
      ? t(
          'admin:domain.general.tableColumns.statusTooltip',
          'Current target/value is incorrect: {{value}}',
          { value: data?.value },
        )
      : t(
          'admin:domain.general.tableColumns.statusTooltipNoValue',
          'No target/value is set currently',
          { value: data?.value },
        )
    return (
      <Tooltip textAlign="center" label={label}>
        <Text d="inline">
          <IconCell success={false} />
        </Text>
      </Tooltip>
    )
  }

  const getCloudflareAlert = () => {
    const isCloudflare =
      domainStatus?.ns &&
      domainStatus?.ns.length &&
      domainStatus?.ns.join(',').includes('cloudflare.com')

    if (!isCloudflare) return null

    return (
      <Alert status="warning" variant="left-accent" mb="3" mt="3">
        <AlertDescription fontSize="md" fontWeight="regular">
          <Trans
            i18nKey="admin:domain.general.cloudflareWarning"
            defaults="It seems you're using Cloudflare. Please ensure the records pointing to our services has a gray CloudFlare logo in front of them. In case the logo is orange, you should click on it to toggle it to gray."
          />
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <SkeletonProvider loading={isLoading}>
      <Divider mb={5} />

      <Skeleton>
        <Text mb={2} textStyle="medium/medium">
          <Trans
            i18nKey="admin:domain.general.followThisInstruction"
            defaults="Follow this instruction to complete transfer"
          />
        </Text>

        <Text textStyle="regular/xsmall">
          <Trans
            i18nKey="admin:domain.general.setupYourRecords"
            defaults="For this to work, you need to add the following settings in your DNS provider panel."
          />
        </Text>
      </Skeleton>
      <Skeleton>
        <Box>
          <TableWrapper
            dataTestId="custom-domain-table"
            data={getData()}
            hasMore={false}
            total={getData().length}
            loading={isLoading}
            skeletonRowCount={4}
          >
            <TableColumnWrapper
              id="type"
              title={t('admin:domain.general.tableColumns.type', 'Type')}
              getColumnProps={() => ({
                flexGrow: 1,
                flexBasis: '15%',
                overflow: 'hidden',
              })}
            >
              {data => <TextCell>{data?.type}</TextCell>}
            </TableColumnWrapper>
            <TableColumnWrapper
              id="host"
              title={t(
                'admin:domain.general.tableColumns.hostName',
                'Host/Name',
              )}
              getColumnProps={() => ({
                flexGrow: 1,
                flexBasis: '35%',
                overflow: 'hidden',
              })}
            >
              {data => <TextCell>{data?.host}</TextCell>}
            </TableColumnWrapper>
            <TableColumnWrapper
              id="value"
              title={t(
                'admin:domain.general.tableColumns.targetValue',
                'Target/Value',
              )}
              getColumnProps={() => ({
                flexGrow: 1,
                flexBasis: '35%',
                overflow: 'hidden',
              })}
            >
              {data => <TextCell>{data?.target}</TextCell>}
            </TableColumnWrapper>
            <TableColumnWrapper
              id="status"
              title={t('admin:domain.general.tableColumns.status', 'Status')}
              getColumnProps={() => ({
                flexGrow: 1,
                flexBasis: '15%',
                overflow: 'hidden',
                textAlign: 'center',
              })}
            >
              {data => getStatusIcon(data)}
            </TableColumnWrapper>
          </TableWrapper>
        </Box>
      </Skeleton>
      {getCloudflareAlert()}
      <Skeleton>
        <Text
          data-testid="custom-domain-confirmation"
          textStyle="regular/small"
        >
          {domainStatus?.success ? (
            <Trans
              i18nKey="admin:domain.general.clickOnMoveYourCommunity"
              defaults="All looks good, click on <bold>Move your community</bold> button to finish the transfer."
              components={{ bold: <strong /> }}
            />
          ) : (
            <Trans
              i18nKey="admin:domain.general.clickOnRecheckSettings"
              defaults="If you’ve already done this, click on <highlight>Recheck settings</highlight> button to get the green check."
              components={{ highlight: <strong /> }}
            />
          )}
        </Text>
      </Skeleton>
    </SkeletonProvider>
  )
}

export default FormTable
