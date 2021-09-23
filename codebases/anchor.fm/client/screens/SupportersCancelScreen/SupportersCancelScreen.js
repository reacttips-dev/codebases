import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';

import { handleGetCsrfToken, useCsrfToken } from 'client/hooks/useCsrfToken';
import Spinner from 'client/components/Spinner';

import styles from './SupportersCancelScreen.sass';

export const SupportersCancelScreen = ({
  podcastName,
  podcastUrl,
  cancelCode,
  isPageLoading,
  podcastStationId,
  onClickCancel,
  isCancelComplete,
  isCancellationProcessing,
}) => {
  const { csrfToken } = useCsrfToken();

  const handleClickCancelButton = async () => {
    const _csrf = csrfToken || (await handleGetCsrfToken());
    onClickCancel(podcastStationId, cancelCode, _csrf);
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {isPageLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.title}>
              Stop supporting{' '}
              <span className={styles.podcastTitle}>{podcastName}</span>
            </div>
            {isCancelComplete ? (
              <div className={styles.bodyText}>
                {`We've canceled your subscription. If you ever want to support
                this podcast again in the future, you can always sign up again
                from their profile at `}
                <span className={styles.podcastUrl}>{podcastUrl}</span>
              </div>
            ) : (
              <>
                <div className={styles.bodyText}>
                  {`If you'd like to stop supporting this podcast, just click
                  Cancel. You won't be charged again going forward.`}
                </div>
                <Button
                  type="submit"
                  bsStyle="primary"
                  disabled={isCancellationProcessing}
                  bsClass={styles.cancelButton}
                  onClick={handleClickCancelButton}
                >
                  {isCancellationProcessing ? (
                    <Spinner size={18} />
                  ) : (
                    <span>Cancel my subscription</span>
                  )}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

SupportersCancelScreen.propTypes = {
  podcastName: PropTypes.string.isRequired,
  podcastUrl: PropTypes.string.isRequired,
  cancelCode: PropTypes.string.isRequired,
  podcastStationId: PropTypes.string.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  isCancelComplete: PropTypes.bool.isRequired,
  isCancellationProcessing: PropTypes.bool.isRequired,
  isPageLoading: PropTypes.bool.isRequired,
};
