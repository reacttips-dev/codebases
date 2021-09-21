import React from 'react';
import { css } from 'emotion';
import {
  SavedCuePoint,
  SavedCuePoints,
} from 'screens/EpisodeScreen/components/CuePoints/types';
import { useSAIWaveformContext } from 'components/AdInsertion/context';
import { UploadErrorIcon } from 'shared/Icon/components/UploadErrorIcon';
import { getPlacementType } from 'screens/EpisodeScreen/components/CuePoints/utils';
import { LoadingSpinner } from 'components/LoadingSpinner';
import {
  IconWrapper,
  RemoveButton,
} from 'screens/EpisodeScreen/components/CuePoints/styles';
import CloseIcon from 'shared/Icon/components/XIcon';
import {
  Table,
  Wrapper,
  TableHeadRow,
  TableBodyRow,
  AdId,
  DisabledPill,
  EditLink,
  Container,
} from './styles';

type CuePointsTableProps = {
  cuePoints?: SavedCuePoints;
  duration: number;
  removeCuePoint: (cuePoint: SavedCuePoint) => void;
  onClickEditCuePoint: (cuePoint: SavedCuePoint) => void;
};

export function CuePointsTable({
  cuePoints,
  duration,
  removeCuePoint,
  onClickEditCuePoint,
}: CuePointsTableProps) {
  const { onTableRowClick } = useSAIWaveformContext();

  return (
    <Wrapper hasRows={cuePoints !== undefined && cuePoints.length > 0}>
      {cuePoints && cuePoints.length ? (
        <Table aria-label="Table of cue points">
          <thead>
            <TableHeadRow>
              <th scope="col" colSpan={1}>
                ID
              </th>
              <th scope="col" colSpan={1}>
                AD TYPE
              </th>
              <th scope="col" colSpan={1}>
                TIMESTAMP
              </th>
              <th scope="col" colSpan={4}>
                COUNT
              </th>
              <th colSpan={1} aria-label="Row action" />
            </TableHeadRow>
          </thead>
          <tbody>
            {cuePoints
              .sort((a, b) => a.startTime - b.startTime) // sort timestamp ascending
              .map((cuePoint: SavedCuePoint, index) => {
                const {
                  startTime,
                  startTimeString,
                  adCount,
                  placementType,
                  isRemoving,
                } = cuePoint;

                const isDisabled = startTime > duration && duration !== 0;

                return (
                  <TableBodyRow
                    key={startTime}
                    isDisabled={isDisabled}
                    onClick={() => !isDisabled && onTableRowClick(cuePoint)}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        onTableRowClick(cuePoint);
                      }
                    }}
                    tabIndex={0}
                    aria-label={
                      isDisabled
                        ? `The ${getPlacementType(
                            placementType
                          )} timestamp at ${startTimeString} is invalid because it is not within the duration of the episode`
                        : `Click row to move cursor to ${getPlacementType(
                            placementType
                          )} timestamp at ${startTimeString} on waveform`
                    }
                  >
                    <td colSpan={1}>
                      <AdId placementType={placementType}>
                        {String.fromCharCode(65 + index)}
                      </AdId>
                    </td>
                    <td colSpan={1}>{getPlacementType(placementType)}</td>
                    <td colSpan={1}>{startTimeString}</td>
                    <td colSpan={4}>{adCount}</td>
                    <td colSpan={1}>
                      {isRemoving ? (
                        <LoadingSpinner
                          color="#8940FA"
                          width={25}
                          className={css`
                            margin: 0 2px 0 auto;
                          `}
                        />
                      ) : (
                        <>
                          {isDisabled && <DisabledPill>Disabled</DisabledPill>}
                          <EditLink
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.keyCode === 13) {
                                onClickEditCuePoint(cuePoint);
                              }
                            }}
                            onClick={() => {
                              onClickEditCuePoint(cuePoint);
                            }}
                          >
                            edit
                          </EditLink>
                          <RemoveButton
                            type="button"
                            aria-label={`delete cue point with timestamp ${startTimeString}`}
                            onClick={() => {
                              removeCuePoint(cuePoint);
                            }}
                          >
                            <IconWrapper>
                              <CloseIcon
                                className={css`
                                  width: 100%;
                                `}
                              />
                            </IconWrapper>
                          </RemoveButton>
                        </>
                      )}
                    </td>
                  </TableBodyRow>
                );
              })}
          </tbody>
        </Table>
      ) : (
        <Container>
          <UploadErrorIcon
            fillColor="#5F6368"
            className={css`
              width: 30px;
              height: 35px;
            `}
          />
          <h3>No ads placed</h3>
          <p>Enter a timestamp, count, and ad type to insert an ad slot</p>
        </Container>
      )}
    </Wrapper>
  );
}
