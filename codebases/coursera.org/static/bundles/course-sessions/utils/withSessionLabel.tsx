import React from 'react';

import { compose } from 'recompose';

import mapProps from 'js/lib/mapProps';
import withCurrentSession from './withCurrentSession';

import _t from 'i18n!nls/course-sessions';

type InputProps = {
  courseId: string;
};

export type SessionLabel = 'session' | 'schedule';

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

export default <PropsFromCaller extends InputProps>(
  PassedComponent: React.ComponentType<Props & PropsFromCaller>
): React.ComponentType<PropsFromCaller> =>
  compose<Props & PropsFromCaller, PropsFromCaller>(
    withCurrentSession,
    mapProps<Props, PropsFromCaller>(({ currentSession, ...ownProps }: any) => ({
      ...ownProps,
      sessionLabel: currentSession?.isPrivate ? 'session' : 'schedule',
    }))
  )(PassedComponent);
