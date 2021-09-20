import React, { FunctionComponent, useState, useEffect } from 'react';
import { useBoardExportQuery } from './BoardExportQuery.generated';
import { useStartBoardExportMutation } from './StartBoardExportMutation.generated';
import { Button } from '@trello/nachos/button';
import { forTemplate } from '@trello/i18n';
import styles from './ExportPopoverContent.less';
import { idToDate } from 'app/common/lib/util/date';
import { getDateDeltaString } from 'app/gamma/src/util/dates';
import { bytes } from 'app/common/lib/util/file-size';
import { Spinner } from '@trello/nachos/spinner';
import { Analytics } from '@trello/atlassian-analytics';

const formatPopoverShare = forTemplate('popover_share');

interface ExportPopoverContentProps {
  idBoard: string;
  idOrg: string;
}

export const ExportPopoverContent: FunctionComponent<ExportPopoverContentProps> = ({
  idBoard,
  idOrg,
}) => {
  const { data, startPolling, stopPolling } = useBoardExportQuery({
    variables: {
      idBoard,
      idExport: 'mostRecent',
    },
  });

  const isFinished =
    data &&
    data.board &&
    data.board.export &&
    data.board.export.status.finished;

  const [isExporting, setIsExporting] = useState(false);
  const [hasBeenExportedBefore, setHasBeenExportedBefore] = useState(
    data && data.board && !!data.board.export,
  );

  useEffect(() => {
    if (!hasBeenExportedBefore) {
      setIsExporting(false);
    } else if (!isFinished) {
      setIsExporting(true);
      startPolling(1000);
    }
  }, [hasBeenExportedBefore, isFinished, startPolling]);

  useEffect(() => {
    if (isFinished) {
      setIsExporting(false);
      stopPolling();
    }
  }, [data, isFinished, stopPolling]);
  const [startBoardExport] = useStartBoardExportMutation();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'exportBoardInlineDialog',
    });
  }, [idBoard, idOrg]);

  if (!data || !data.board)
    return (
      <div>
        <Spinner centered />
      </div>
    );

  if (data && data.board && data.board.idOrganization)
    idOrg = data.board.idOrganization;

  const executeExport = () => {
    setHasBeenExportedBefore(true);
    setIsExporting(true);
    startBoardExport({
      variables: { id: idBoard },
    }).then(() => {
      startPolling(1000);
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'exportButton',
      source: 'exportBoardInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrg,
        },
      },
    });
  };

  const trackDownload = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'downloadLink',
      source: 'exportBoardInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrg,
        },
      },
    });
  };

  return (
    <div>
      {data.board.export && data.board.export.status.finished && !isExporting && (
        <p>
          {formatPopoverShare('last-exported', {
            timeOfLastExport: getDateDeltaString(
              idToDate(data.board.export.id),
              new Date(),
            ),
            sizeOfExport:
              typeof data.board.export.size === 'number'
                ? bytes(data.board.export.size)
                : 'unknown',
          })}
        </p>
      )}

      {isExporting && hasBeenExportedBefore && (
        <p>{formatPopoverShare('exporting-ellipsis')}</p>
      )}

      {!data.board.export && !hasBeenExportedBefore && (
        <p className={styles.exportHistoryText}>
          {formatPopoverShare('no-export-history')}
        </p>
      )}
      <div className={styles.buttons}>
        <Button
          appearance="primary"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={executeExport}
          className={styles.exportButton}
          isDisabled={isExporting}
        >
          {formatPopoverShare('export')}
        </Button>

        {data.board.export && !isExporting && (
          <a
            className={styles.downloadLink}
            href={`/1/boards/${idBoard}/exports/${data.board.export.id}/download`}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={trackDownload}
          >
            {formatPopoverShare('download')}
          </a>
        )}
      </div>
    </div>
  );
};
