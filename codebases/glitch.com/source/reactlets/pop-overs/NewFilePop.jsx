import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import FilePromptButton from '../../components/FilePromptButton';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import AssetUtils from '../../utils/assets';
import projectLicenses from '../../data/project-licenses';
import projectCodesOfConduct from '../../data/project-codes-of-conduct';
import { isTextFile } from '../../util';

function tryUploadFiles(application, assetUtils, files) {
  const uploadPromises = Array.from(files)
    .map((file) => (isTextFile(file) ? application.uploadNewFile(file) : assetUtils.addFile(file)))
    .map((promise) => promise.then(() => 1, () => 0));
  return Promise.all(uploadPromises).then((res) => res.reduce((a, b) => a + b));
}

function useHasFile(application, fileNames) {
  return useObservable(
    useCallback(() => {
      const project = application.currentProject();
      if (project) {
        return project.files().some((file) => fileNames.includes(file.path().toLowerCase()));
      }
      return false;
    }, [application, fileNames]),
  );
}

export default function NewFilePop() {
  const application = useApplication();
  const visible = useObservable(application.newFilePopVisible);
  const projectHasLicense = useHasFile(application, ['license.md', 'license.txt']);
  const isAnonUser = useObservable(useCallback(() => application.currentUser() && application.currentUser().isAnon(), [application]));
  const projectHasCodeOfConduct = useHasFile(application, ['code_of_conduct.md', 'code_of_conduct.txt']);
  const [fileName, setFileName] = useState('');
  const [jiggle, setJiggle] = useState(false);
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [loadingCodeOfConduct, setLoadingCodeOfConduct] = useState(false);
  const assetUtils = useRef();

  if (!assetUtils.current) {
    assetUtils.current = AssetUtils(application);
  }

  const createFile = async (e) => {
    e.preventDefault();
    if (fileName.trim()) {
      try {
        await application.newFile(fileName);
        setFileName('');
        application.closeAllPopOvers();
      } catch (error) {
        console.warn(error);
        application.notifyGenericError(true);
      }
    } else {
      setJiggle(true);
    }
  };

  const makeAttributedBody = (body) => {
    const currentYear = moment()
      .year()
      .toString();
    const name = application.currentUser().name() || '[NAME]';
    const email = application.currentUser().primaryEmail().email || '[EMAIL]';
    const projectName = application.currentProject().domain();
    return body
      .replace(/(\[year\])+/g, currentYear)
      .replace(/(\[fullname\])+/g, name)
      .replace(/(\[GOVERNING_BODY\])+/g, email)
      .replace(/(\[EMAIL\])+/g, email)
      .replace(/(\[COMMUNITY_NAME\])+/g, projectName);
  };

  const createSpecialMarkdownFile = (name, type, metadata) => {
    return application
      .getLicenseOrCodeOfConductBody(type, metadata)
      .then(({ body }) => body)
      .then(makeAttributedBody)
      .then(async (body) => {
        const currentlyVisible = application.markdownPreviewVisible();
        await application.newFile(name, body);
        application.markdownPreviewVisible(currentlyVisible);
      });
  };

  const addLicense = () => {
    setLoadingLicense(true);
    const license = projectLicenses[0];
    createSpecialMarkdownFile('LICENSE.md', 'license', license).finally(() => {
      setLoadingLicense(false);
      application.closeAllPopOvers();
      application.packageUtils.updatePackageLicense(license.spdxId);
    });
  };

  const addCodeOfConduct = () => {
    setLoadingCodeOfConduct(true);
    const codeOfConduct = projectCodesOfConduct[0];
    createSpecialMarkdownFile('CODE_OF_CONDUCT.md', 'codeOfConduct', codeOfConduct).finally(() => {
      setLoadingCodeOfConduct(false);
      application.closeAllPopOvers();
    });
  };

  const inputRef = useCallback((node) => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  useEffect(() => {
    // Clear filename when NewFilePop is closed
    if (!visible) {
      setFileName('');
    } else {
      const selectedFolderPath = application
        .otClient()
        .ot()
        .idToPath(application.selectedFolder()?.id())
        ?.substring(2);
      if (selectedFolderPath) {
        setFileName(`${selectedFolderPath}/`);
        application.selectedFolder(null);
      }
    }
  }, [application, visible]);

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over new-file-pop" data-testid="new-file-pop">
      <section className="actions">
        <form onSubmit={createFile}>
          <div className="input-wrap">
            <input
              className={cn('input', { jiggle })}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onAnimationEnd={(e) => {
                e.target.focus();
                setJiggle(false);
              }}
              placeholder="cool-file.js"
              aria-label="File name"
              spellCheck={false}
              data-testid="new-file-name-input"
              ref={inputRef}
            />
          </div>
          <div className="button-wrap">
            <button className="button" data-testid="add-new-file">
              Add This File
              <Icon icon="seedling" />
            </button>
          </div>
          <p>To add a file inside a folder, include a forward slash in the file name (e.g. folder/my-awesome-file.js)</p>
        </form>
      </section>
      <section className="actions">
        <div className="button-wrap">
          <FilePromptButton
            accept="*"
            onSelection={(files) => {
              application.newFilePopVisible(false);
              tryUploadFiles(application, assetUtils.current, files);
            }}
          >
            Upload a File <Icon icon="blockArrowUp" />
          </FilePromptButton>
        </div>
        {!projectHasLicense && !isAnonUser && (
          <div className="button-wrap">
            <button className="button button-small button-secondary" onClick={addLicense}>
              Add License File
              <Icon icon="scales" />
              {loadingLicense && <Loader />}
            </button>
          </div>
        )}
        {!projectHasCodeOfConduct && !isAnonUser && (
          <div className="button-wrap">
            <button className="button button-small button-secondary" onClick={addCodeOfConduct}>
              Add Code of Conduct File
              <Icon icon="ferrisWheel" />
              {loadingCodeOfConduct && <Loader />}
            </button>
          </div>
        )}
      </section>
    </dialog>
  );
}
