import React, { useCallback } from 'react';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import Markdown, { showMarkdownButton } from './Markdown';
import Dotenv, { showDotenvButton } from './DotenvButton';
import Firebase, { showFirebaseButton } from './Firebase';
import PackageJson, { showPackageJsonButton } from './PackageJson';
import Prettier, { showPrettierButton } from './Prettier';
import License, { showLicenseButton } from './License';

export default function EditorHelper() {
  const application = useApplication();
  const file = useObservable(application.selectedFile);
  const fileName = useObservable(useCallback(() => (file ? file.name() : null), [file]));
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);

  const anyButtonWillDisplay = () =>
    showMarkdownButton(file) ||
    showDotenvButton(file) ||
    showLicenseButton(fileName, projectIsReadOnlyForCurrentUser) ||
    showPackageJsonButton(file, projectIsReadOnlyForCurrentUser) ||
    showPrettierButton(application, file) ||
    showFirebaseButton(fileName);

  if (!file || !anyButtonWillDisplay()) {
    return null;
  }

  return (
    <div className="editor-helper">
      <div className="editor-helper-contents">
        <Markdown file={file} />
        <Dotenv file={file} />
        <Firebase file={file} />
        <PackageJson file={file} />
        <License file={file} />
        <Prettier file={file} />
      </div>
    </div>
  );
}
