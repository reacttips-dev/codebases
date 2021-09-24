import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import * as Markdown from '../../utils/markdown';
import { MarkdownCSPError } from '../NotificationTemplates';

export default function MarkdownPreview() {
  const application = useApplication();
  const { createNotification } = useNotifications();
  const currentLicense = useObservable(application.currentLicense);
  const selectedFile = useObservable(application.selectedFile);
  const markdown = useObservable(useCallback(() => selectedFile && selectedFile.content(), [selectedFile]));
  const previewContent = useMemo(() => Markdown.render(markdown), [markdown]);

  return (
    <article className="markdown-container">
      {currentLicense && (
        <section className="license-summary">
          <div className="license-column">
            <p className="column-title">Permissions</p>

            <ul>
              {currentLicense.licensePermissions.map((permission) => (
                <li key={permission} className="permission">
                  {permission}
                </li>
              ))}
            </ul>
          </div>

          <div className="license-column">
            <p className="column-title">Conditions</p>

            <ul>
              {currentLicense.licenseConditions.map((condition) => (
                <li key={condition} className="condition">
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          <div className="license-column">
            <p className="column-title">Limitations</p>

            <ul>
              {currentLicense.licenseLimitations.map((limitation) => (
                <li key={limitation} className="limitation">
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        className="markdown-content"
        onErrorCapture={(e) => {
          if (e.target.type !== 'img' || !application.projectIsMemberOrMoreForCurrentUser()) {
            return;
          }

          const isCSPError = application.cspViolations().some((violation) => violation.blockedURI === e.target.src);
          if (isCSPError) {
            createNotification(MarkdownCSPError);
          }
        }}
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    </article>
  );
}
