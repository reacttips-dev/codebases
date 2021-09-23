import React, { useCallback } from 'react';
import cn from 'classnames';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import ChangeLicensePop from '../ChangeLicensePop';

const licenseFileNames = new Set(['license.md', 'license.txt']);

export function showLicenseButton(fileName, projectIsReadOnlyForCurrentUser) {
  return fileName && licenseFileNames.has(fileName.toLowerCase()) && !projectIsReadOnlyForCurrentUser;
}

export default function License({ file }) {
  const application = useApplication();
  const fileName = useObservable(useCallback(() => file.name(), [file]));
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);

  const onLicenseButtonClick = () => {
    application.changeLicensePopVisible(true);
  };

  if (!showLicenseButton(fileName, projectIsReadOnlyForCurrentUser)) {
    return null;
  }

  return (
    <>
      <button className={cn('button opens-pop-over', { disabled: editorIsPreviewingRewind })} onClick={onLicenseButtonClick}>
        <span>Change License</span>
        <span className="icon down-arrow" />
      </button>
      <ChangeLicensePop />
    </>
  );
}
