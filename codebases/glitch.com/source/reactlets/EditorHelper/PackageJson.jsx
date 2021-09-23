import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Loader } from '@glitchdotcom/shared-components';
import AddPackagePop from '../AddPackagePop';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export function showPackageJsonButton(file, projectIsReadOnlyForCurrentUser) {
  return file.path() === 'package.json' && !projectIsReadOnlyForCurrentUser;
}

export default function PackageJson({ file }) {
  const application = useApplication();
  const { checkForPackageUpdates, isValidPackagesFileContent } = application.packageUtils;
  const fileContents = useObservable(file.content);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);
  const outdatedPackages = useObservable(application.packagesOutdated);
  const [requests, setRequests] = useState(0);
  const packageFileIsValid = useMemo(() => isValidPackagesFileContent(fileContents), [isValidPackagesFileContent, fileContents]);
  const visible = showPackageJsonButton(file, projectIsReadOnlyForCurrentUser);

  const unmounted = useRef(false);
  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

  useEffect(() => {
    if (visible && packageFileIsValid) {
      setRequests((i) => i + 1);
      (async function checkForUpdates() {
        try {
          await checkForPackageUpdates(file);
        } catch (error) {
          console.group('Failed to check for package updates');
          console.error(error);
          console.groupEnd();
        } finally {
          if (unmounted.current === false) {
            setRequests((i) => i - 1);
          }
        }
      })();
    }
  }, [checkForPackageUpdates, visible, file, fileContents, packageFileIsValid]);

  const onAddPackageClick = () => {
    application.addPackagePopVisible.toggle();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <button
        data-testid="add-package-button"
        className={cn('button opens-pop-over', { disabled: editorIsPreviewingRewind || !packageFileIsValid })}
        onClick={onAddPackageClick}
      >
        <span>Add Package</span>
        <div className="status-badge icon">
          {requests > 0 && (
            <div className="status loading">
              <Loader />
            </div>
          )}
          {requests === 0 && outdatedPackages.length > 0 && <div className="status warning">{outdatedPackages.length}</div>}
        </div>
        <span className="down-arrow icon" />
      </button>
      <AddPackagePop />
    </>
  );
}
