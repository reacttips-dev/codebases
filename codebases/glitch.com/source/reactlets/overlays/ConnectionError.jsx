import React, { useCallback } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import dedent from 'dedent';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function ConnectionError() {
  const application = useApplication();
  const visible = useObservable(application.connectionErrorOverlayVisible);
  const errorMessage = useObservable(
    useCallback(() => {
      const errorDetails = application.connectionErrorDetails();
      if (errorDetails) {
        const { status, error, message, error_url: errorUrl } = errorDetails;

        const unpadded = dedent`
        ${status}: ${error}

        ${message}

        ${errorUrl}
      `;

        const unpaddedLines = unpadded.split('\n');

        // Indent each line with 4 spaces.
        const indentedLines = unpaddedLines.map((s) => `    ${s}`);

        // Add leading and trailing newline
        return ['', ...indentedLines, ''].join('\n');
      }
      return null;
    }, [application]),
  );

  const reload = () => {
    window.location.reload();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="overlay-background">
      <dialog className="overlay error-overlay">
        <section className="danger-zone">
          <h1>Unexpected Error</h1>
        </section>

        <section className="info">
          <p>(シ_ _)シ</p>
          <p>
            An error has occurred, please try again or{' '}
            <a href="https://support.glitch.com" target="_blank" rel="noopener noreferrer">
              contact us
            </a>{' '}
            if the error persists.
          </p>
          <textarea className="textarea" readOnly value={errorMessage} wrap="off" />
        </section>

        <section className="actions">
          <div className="button-wrap">
            <a href="http://status.glitch.com" target="_blank" rel="noopener noreferrer">
              <button className="button">
                System Status <Icon icon="trafficLight" />
              </button>
            </a>
          </div>
          <div className="button-wrap">
            <button className="button" onClick={reload}>
              Try Again <Icon icon="crystalBall" />
            </button>
          </div>
        </section>

        <section className="info">
          <p>
            <a href="https://support.glitch.com" target="_blank" rel="noopener noreferrer">
              Support
            </a>
          </p>
        </section>
      </dialog>
    </div>
  );
}
