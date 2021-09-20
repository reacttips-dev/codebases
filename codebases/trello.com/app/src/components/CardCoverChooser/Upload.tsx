import React, { useRef, useState } from 'react';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import styles from './Upload.less';
import cx from 'classnames';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUploadCoverMutation } from './UploadCoverMutation.generated';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('card_cover_chooser');

interface UploadProps {
  cardId: string;
  onFileUploaded?: () => void;
  onFileSelected?: () => void;
  onUploadFailed?: () => void;
  hideHeading?: boolean;
  className?: string;
}

export const Upload: React.FunctionComponent<UploadProps> = ({
  cardId,
  onFileSelected,
  onFileUploaded,
  onUploadFailed,
  hideHeading,
  className,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const card = data?.card;
  const containers = {
    organization: {
      id: card?.board.idOrganization,
    },
    board: {
      id: card?.board.id,
    },
    card: {
      id: card?.id,
    },
  };

  const [uploadCover, { loading, error }] = useUploadCoverMutation({
    onError: onUploadFailed,
    onCompleted: () => {
      Analytics.sendTrackEvent({
        action: 'uploaded',
        actionSubject: 'cover',
        source: 'cardCoverInlineDialog',
        containers,
      });

      if (onFileUploaded) {
        onFileUploaded();
      }
    },
  });
  const [file, setFile] = useState<File | undefined>();
  const fileInput = useRef<HTMLInputElement>(null);

  if (loading) {
    return <Spinner centered />;
  }

  return (
    <div className={className}>
      {!hideHeading && <h4 className={styles.heading}>{format('upload')}</h4>}
      <input
        ref={fileInput}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          setFile(undefined);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={async (e) => {
          const input = e.target;
          const selectedFile = input.files && input.files[0];
          if (selectedFile) {
            setFile(selectedFile);

            if (onFileSelected) {
              onFileSelected();
            }

            const traceId = Analytics.startTask({
              taskName: 'create-attachment/card-cover',
              source: 'cardCoverInlineDialog',
            });

            try {
              await uploadCover({
                variables: {
                  traceId,
                  cardId,
                  file: selectedFile,
                },
              });

              Analytics.taskSucceeded({
                taskName: 'create-attachment/card-cover',
                traceId,
                source: 'cardCoverInlineDialog',
              });
            } catch (error) {
              throw Analytics.taskFailed({
                taskName: 'create-attachment/card-cover',
                traceId,
                source: 'cardCoverInlineDialog',
                error,
              });
            }
          }
        }}
      />

      <button
        className={cx('button', styles.upload)}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          fileInput.current && fileInput.current.click();
          Analytics.sendClickedButtonEvent({
            buttonName: 'cardCoverAttachmentUploadButton',
            source: 'cardCoverInlineDialog',
            containers,
          });
        }}
      >
        {format('upload-a-cover-image')}
      </button>
      {error && file ? (
        <div className={styles.error}>
          {format('unable-to-use-file-as-card-cover', { fileName: file.name })}
        </div>
      ) : (
        <div className={styles.tip}>{format('tip-drag-an-image')}</div>
      )}
    </div>
  );
};
