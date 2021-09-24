import React, { useEffect } from 'react';
import cn from 'classnames';
import { darkTheme, lightTheme, RootStyle } from '@glitchdotcom/shared-components';
import { ThemeProvider } from '@glitchdotcom/glitch-design-system';
import ApplicationProvider from './ApplicationProvider';
import useObservable from '../hooks/useObservable';
import Router from './Router';
import Header from '../reactlets/Header';
import Editor from '../reactlets/Editor';
import LogsPanel from '../reactlets/panels/LogsPanel';
import ConsolePanel from '../reactlets/panels/ConsolePanel';
import ContainerStatsPanel from '../reactlets/panels/ContainerStatsPanel';
import RewindPanel from '../reactlets/panels/RewindPanel';
import EmbedHelper from '../reactlets/EmbedHelper';
import KeyboardShortcuts from '../reactlets/overlays/KeyboardShortcuts';
import ProjectSuspended from '../reactlets/overlays/ProjectSuspended';
import NewStuff from '../reactlets/overlays/NewStuff';
import ShareEmbed from '../reactlets/overlays/ShareEmbed';
import ProjectSearchFiles from '../reactlets/overlays/ProjectSearchFiles';
import ConnectionError from '../reactlets/overlays/ConnectionError';
import TeamPop from '../reactlets/pop-overs/TeamPop';

import * as Storage from '../utils/storage';

const THEME_MAP = {
  sugar: lightTheme,
  cosmos: darkTheme,
};

export default function App({ application }) {
  const userMachine = application.userMachine;

  useEffect(() => {
    const onStorage = (latestCachedUser) => {
      userMachine.send({
        type: 'CACHED_USER_CHANGE',
        data: latestCachedUser,
      });
    };

    Storage.onChange('cachedUser', onStorage);

    return () => {
      Storage.offChange('cachedUser', onStorage);
    };
  }, [application, userMachine]);

  const currentTheme = useObservable(application.currentTheme);

  return (
    <>
      <RootStyle theme={THEME_MAP[currentTheme]} />
      <ApplicationProvider application={application}>
        <ThemeProvider legacyTheme={THEME_MAP[currentTheme]}>
          <Router />
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div id="application" className={cn({ touch: application.isMobile })} onClick={application.globalclick}>
            <Header />
            <Editor />
            <LogsPanel />
            <ConsolePanel />
            <ContainerStatsPanel />
            <RewindPanel />
            <EmbedHelper />
            <KeyboardShortcuts />
            <ProjectSuspended />
            <NewStuff />
            <ShareEmbed />
            <ProjectSearchFiles />
            <ConnectionError />
            <TeamPop />
          </div>
        </ThemeProvider>
      </ApplicationProvider>
    </>
  );
}
