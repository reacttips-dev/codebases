import React from 'react';
import isFileDotenv from '../../utils/dotenv';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export function showDotenvButton(file) {
  return isFileDotenv(file);
}

export default function Dotenv({ file }) {
  const application = useApplication();
  const dotenvViewVisible = useObservable(application.dotenvViewVisible);

  const onDotenvClick = () => {
    application.dotenvViewVisible.toggle();
  };

  if (!isFileDotenv(file)) {
    return null;
  }

  return (
    <button className="button" data-testid="dot-env-button" onClick={onDotenvClick}>
      <span>{dotenvViewVisible ? 'Plaintext' : 'Graphical'}</span>
      <span className="icon eye" />
    </button>
  );
}
