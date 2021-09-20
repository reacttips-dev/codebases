import React from 'react';
import { renderTopLevelComponent } from 'app/scripts/controller/renderTopLevelComponent';
import { LazyError } from 'app/src/components/Error/LazyError';
import { ErrorProps } from 'app/src/components/Error/Error.types';

export function errorPage({ errorType, reason }: ErrorProps) {
  return renderTopLevelComponent(
    <LazyError errorType={errorType} reason={reason} />,
  );
}
