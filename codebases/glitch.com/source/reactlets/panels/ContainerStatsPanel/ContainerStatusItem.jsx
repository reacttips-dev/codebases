import React from 'react';
import { Badge } from '@glitchdotcom/shared-components';
import styled from 'styled-components';
import bytes from 'bytes';

import BoostedIcon from '../../../components/icons/BoostedIcon';
import SplitProgress, { StyledProgress } from '../../../components/SplitProgress';
import Row from '../../../components/primitives/Row';
import Stack from '../../../components/primitives/Stack';
import { RESOURCE_USAGE_ERROR_THRESHOLD, RESOURCE_USAGE_WARNING_THRESHOLD } from '../../../const';

const StatusItemDiv = styled.div`
  background: ${(props) => (props.itemIsBoosted ? 'linear-gradient(12deg, #C454FF, #2800FF, #FA8A7C, #FE7DAB)' : 'var(--colors-border)')};
  border-radius: 14px;
  padding: 2px;
`;
const StatusItemContents = styled.div`
  background: var(--colors-background);
  border: solid 2px transparent;
  border-radius: 12px;
  padding: 19px;
  height: 100%;
`;
const MonospaceDiv = styled.div`
  font-family: monospace;
  font-size: 13px;
`;
// TODO: Move this to be a true Text primitive in the shared-components library
const Text = styled.div`
  font-size: 14px;
`;
const WideProgress = styled(StyledProgress)`
  width: 177px;
`;

const statusFromPercentage = (usagePercent) => {
  if (usagePercent > RESOURCE_USAGE_ERROR_THRESHOLD) {
    return 'error';
  }
  if (usagePercent > RESOURCE_USAGE_WARNING_THRESHOLD) {
    return 'warning';
  }
  return 'ok';
};

const toPercentageString = (number) => {
  return `${number.toFixed(0)}%`;
};

const toDetailString = (current, max) => {
  return `${bytes.format(current, { decimalPlaces: 0 })} / ${bytes.format(max, { decimalPlaces: 0 })}`;
};

const ContainerStatusItem = ({ title, iconTooltip, details, help, badgeStatus, itemIsBoosted, children }) => {
  return (
    <StatusItemDiv itemIsBoosted={itemIsBoosted}>
      <StatusItemContents>
        {/* TODO: refactor to use Grid */}
        <Stack>
          <Row>
            <Stack>
              <Row>
                {itemIsBoosted !== undefined && <BoostedIcon variant={itemIsBoosted ? 'default' : 'inactive'} size="small" tooltip={iconTooltip} />}
                <Badge variant={badgeStatus}>{title}</Badge>
              </Row>
              {children}
            </Stack>
            {details && <MonospaceDiv>{details}</MonospaceDiv>}
          </Row>
          {/* If there's help text for this status item */}
          {help}
        </Stack>
      </StatusItemContents>
    </StatusItemDiv>
  );
};

export function MemoryContainerStatusItem({ memoryUsagePercent, memoryUsage, memoryLimit, itemIsBoosted }) {
  const memoryStatus = statusFromPercentage(memoryUsagePercent);

  return (
    <ContainerStatusItem
      title={itemIsBoosted ? 'Memory Boost' : 'Memory'}
      iconTooltip={itemIsBoosted ? undefined : 'Boosted Memory is inactive'}
      details={
        <>
          {toPercentageString(memoryUsagePercent)}
          <br />
          {toDetailString(memoryUsage, memoryLimit)}
        </>
      }
      help={
        memoryStatus === 'ok' ? undefined : <Text>Large or inefficient processes, libraries or compilers that use too much RAM may get killed</Text>
      }
      badgeStatus={memoryStatus === 'ok' ? 'success' : memoryStatus}
      itemIsBoosted={itemIsBoosted}
    >
      {itemIsBoosted ? (
        <WideProgress value={memoryUsagePercent} max={100}>
          {memoryUsagePercent}
        </WideProgress>
      ) : (
        <SplitProgress value={memoryUsagePercent} max={100} tooltip="Boosted Memory potential" />
      )}
    </ContainerStatusItem>
  );
}

export function DiskContainerStatusItem({ diskUsagePercent, diskUsage, diskSize, itemIsBoosted }) {
  const diskStatus = statusFromPercentage(diskUsagePercent);
  return (
    <ContainerStatusItem
      title={itemIsBoosted ? 'Disk Boost' : 'Disk'}
      iconTooltip={itemIsBoosted ? undefined : 'Boosted Disk Space is inactive'}
      details={
        <>
          {toPercentageString(diskUsagePercent)}
          <br />
          {toDetailString(diskUsage, diskSize)}
        </>
      }
      help={
        diskStatus === 'ok' ? (
          undefined
        ) : (
          <Text>
            You may have problems saving changes when your disk is full. Try removing unneeded files, and running <code>git prune; git gc</code> from
            the console
          </Text>
        )
      }
      badgeStatus={diskStatus === 'ok' ? 'success' : diskStatus}
      itemIsBoosted={itemIsBoosted}
    >
      {itemIsBoosted ? (
        <WideProgress value={diskUsagePercent} max={100}>
          {diskUsagePercent}
        </WideProgress>
      ) : (
        <SplitProgress value={diskUsagePercent} max={100} tooltip="Boosted Disk potential" />
      )}
    </ContainerStatusItem>
  );
}

export function CPUContainerStatusItem({ quotaUsagePercent }) {
  const cpuStatus = statusFromPercentage(quotaUsagePercent);
  return (
    <ContainerStatusItem
      title="CPU"
      details={toPercentageString(quotaUsagePercent)}
      help={cpuStatus === 'ok' ? undefined : <Text>This may be caused by large or inefficient processes, libraries or compilers</Text>}
      badgeStatus={cpuStatus === 'ok' ? 'success' : cpuStatus}
    >
      <WideProgress value={quotaUsagePercent} max={100}>
        {quotaUsagePercent}
      </WideProgress>
    </ContainerStatusItem>
  );
}

export function AlwaysOnContainerStatusItem({ itemIsBoosted }) {
  return (
    <ContainerStatusItem
      title="Always On"
      iconTooltip={itemIsBoosted ? undefined : 'Always On is inactive'}
      badgeStatus={itemIsBoosted ? 'success' : 'inactive'}
      itemIsBoosted={itemIsBoosted}
    >
      <MonospaceDiv>{itemIsBoosted ? 'ACTIVATED' : 'OFF'}</MonospaceDiv>
    </ContainerStatusItem>
  );
}

export function RateLimitContainerStatusItem({ itemIsBoosted }) {
  return (
    <ContainerStatusItem
      title={itemIsBoosted ? 'Rate Limit Boost' : 'Rate Limit'}
      iconTooltip={itemIsBoosted ? undefined : 'Boosted Rate Limit is inactive'}
      badgeStatus={itemIsBoosted ? 'success' : 'inactive'}
      itemIsBoosted={itemIsBoosted}
    >
      <MonospaceDiv>{itemIsBoosted ? 'Unlimited requests per hour' : '4000 requests per hour'}</MonospaceDiv>
    </ContainerStatusItem>
  );
}
