import React from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import whenKeyIsEnter from '../utils/whenKeyIsEnter';
import { PackageAdded, PackageUpdated } from './NotificationTemplates';

export default function PackageResult({ result }) {
  const application = useApplication();
  const { createNotification } = useNotifications();

  function handleClickDocs(event) {
    event.stopPropagation();
  }

  /**
   * Add the package to package.json
   */
  async function handleClickResult() {
    application.closeAllPopOvers();

    try {
      const updated = await application.packageUtils.addAndUpdatePackage(result);
      if (updated) {
        createNotification(PackageUpdated);
      } else {
        createNotification(PackageAdded);
      }
    } catch (error) {
      console.warn(error);
      application.notifyGenericError(true);
    }
  }

  return (
    <span className="data">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <li className="result" role="button" tabIndex="0" onClick={handleClickResult} onKeyPress={whenKeyIsEnter(handleClickResult)}>
        <div className={`result-tip ${result.outdated ? 'result-tip-outdated' : ''}`}>
          {result.outdated ? `${result.current_version} → ${result.latest_stable_release_number}` : result.latest_stable_release_number}
        </div>
        <div className="result-name">{result.name}</div>
        <div className="result-description">{result.description}</div>
        <a
          href={`https://www.npmjs.com/package/${result.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button"
          onClick={handleClickDocs}
        >
          Docs <span aria-label="">→</span>
        </a>
      </li>
    </span>
  );
}
