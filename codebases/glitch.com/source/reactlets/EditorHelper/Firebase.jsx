import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Loader } from '@glitchdotcom/shared-components';
import GlitchApi from '../../glitch-api';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import { captureException } from '../../sentry';
import SelectFirebaseProjectPop from '../pop-overs/SelectFirebaseProjectPop';
import { getClient, getToken, onAuthChange } from './firebaseClient';

export function showFirebaseButton(fileName) {
  return fileName && fileName.toLowerCase() === 'firebase.json';
}

function getProjectId(application) {
  const envFile = application.fileByPath('.env');
  if (envFile) {
    const envContent = envFile.content();
    const envItems = typeof envContent === 'string' ? envContent.split('\n') : envContent;
    const vars = envItems.map((s) => {
      const [name, ...value] = s.split('=');
      return [name, value.join('=')];
    });
    const projectIdVar = vars.find(([name]) => name === 'FIREBASE_PROJECT_ID');
    if (projectIdVar) {
      const projectId = projectIdVar[1];
      return projectId;
    }
  }
  return null;
}

function tryEnsureSession(application, file) {
  return file ? application.ensureSession(file) : Promise.resolve(null);
}

export default function Firebase({ file }) {
  const application = useApplication();
  const initialized = useRef(false);
  const mounted = useRef(false);
  const [loadedClient, setLoadedClient] = useState(false);
  const fileName = useObservable(useCallback(() => file.name(), [file]));
  const projectId = useObservable(useCallback(() => getProjectId(application), [application]));
  const [auth, setAuth] = useState(null);
  const [projects, setProjects] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [showSelectProjectPop, setShowSelectProjectPop] = useState(false);

  const initializeFirebaseHelper = useCallback(
    async function initializeFirebaseHelper() {
      initialized.current = true;
      // application.fileByPath('.env') _shouldn't_ be undefined here but I don't know enough
      // about our application's data fetching to know for sure. Either way, this is safe.
      const gapi = await getClient();
      await tryEnsureSession(application, application.fileByPath('.env'));
      if (mounted.current) {
        setAuth(getToken(gapi));
        setLoadedClient(true);
      }

      // Ensure firebase-tools is added to package.json
      try {
        await application.packageUtils.addAndUpdatePackage(
          {
            name: 'firebase-tools',
            latest_release_number: '5.1.1',
          },
          true,
        );
      } catch (error) {
        console.warn(error);
        application.notifyGenericError(true);
      }
    },
    [application],
  );

  const visible = showFirebaseButton(fileName);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (visible && !initialized.current) {
      initializeFirebaseHelper().catch(captureException);
    }
  }, [initializeFirebaseHelper, visible]);

  useEffect(() => onAuthChange(setAuth), []);

  useEffect(() => {
    if (auth && !projectId) {
      getClient().then((gapi) => {
        gapi.client
          .request({
            method: 'GET',
            path: 'https://firebase.googleapis.com/v1beta1/projects',
          })
          .then((response) => response.result.results || [])
          .then((newProjects) => {
            if (mounted.current) {
              setProjects(newProjects);
            }
          });
      });
    }
  }, [auth, projectId]);

  const deployToFirebase = async () => {
    setDeploying(true);
    application.logsPanelVisible(true);
    try {
      application.appendLog({
        stream: 'stdout',
        text: 'Deploying to Firebase...',
      });
      const result = await application.containerExec(
        `ps -A f | grep '[n]pm install' > /dev/null; while [ $? -ne 1 ]; do sleep 1; ps -A f | grep '[n]pm install' > /dev/null; done; FIREBASE_DEPLOY_AGENT=glitch node_modules/.bin/firebase deploy --token '${auth}' --project '${projectId}'`,
      );
      application.appendLog({
        stream: 'stdout',
        text: result.stdout,
      });
    } catch (error) {
      if (error instanceof GlitchApi.HTTPError) {
        const responseJson = await error.response.json();
        application.appendLog({
          stream: 'stderr',
          text: responseJson.stderr,
        });
      }
      application.appendLog({
        stream: 'stderr',
        text: 'Please try again. If problem persists please post on https://support.glitch.com',
      });
    } finally {
      setDeploying(false);
    }
  };

  const onFirebaseConsoleClick = () => {
    window.open(`https://console.firebase.google.com/project/${projectId}/hosting/main`);
  };

  const onViewFirebaseAppClick = () => {
    window.open(`https://${projectId}.firebaseapp.com/?t=${Date.now()}`);
  };

  const onSelectProjectClick = () => {
    setShowSelectProjectPop(true);
  };

  const selectProject = async (project) => {
    try {
      const envFile = application.fileByPath('.env') || (await application.newFile('.env', '', false));
      const content = envFile.content();
      const lines = typeof content === 'string' ? content.split('\n') : content;
      const newLines = [...lines, `FIREBASE_PROJECT_ID=${project.projectId}`];
      application.writeToFile(envFile, newLines.join('\n'));
    } catch (error) {
      console.warn(error);
      application.notifyGenericError(true);
    }
  };

  const closeSelectProjectPop = () => {
    setProjects(null);
    setShowSelectProjectPop(false);
  };

  const onSignOutClick = () => {
    getClient().then((gapi) => {
      gapi.auth2.getAuthInstance().signOut();
    });
  };

  const onSignInClick = () => {
    getClient().then((gapi) => {
      gapi.auth2.getAuthInstance().signIn();
    });
  };

  if (!visible) {
    return null;
  }

  if (!loadedClient) {
    return <Loader />;
  }

  return (
    <>
      {auth && projectId && (
        <button id="deploy-to-firebase" className="button" onClick={deployToFirebase}>
          Deploy to Firebase
          {deploying && (
            <div className="status-badge icon">
              <div className="status loading">
                <Loader />
              </div>
            </div>
          )}
        </button>
      )}
      {projectId && (
        <>
          <button className="button" onClick={onFirebaseConsoleClick}>
            Firebase Console
          </button>
          <button className="button" onClick={onViewFirebaseAppClick}>
            View Firebase App
          </button>
        </>
      )}
      {auth && !projectId && (
        <>
          <button className="button" onClick={onSelectProjectClick}>
            Select Firebase Project
            {showSelectProjectPop && !projects && (
              <div className="status-badge icon">
                <div className="status loading">
                  <Loader />
                </div>
              </div>
            )}
          </button>
          {showSelectProjectPop && projects && (
            <SelectFirebaseProjectPop projects={projects} selectProject={selectProject} onClickOut={closeSelectProjectPop} />
          )}
        </>
      )}
      {auth ? (
        <button className="button" onClick={onSignOutClick}>
          Sign Out From Firebase
        </button>
      ) : (
        <button className="button" onClick={onSignInClick}>
          Sign In To Firebase
        </button>
      )}
    </>
  );
}
