import * as moment from 'moment';
import React, { useState } from 'react';
import { Loader } from '@glitchdotcom/shared-components';

import projectLicenses from '../data/project-licenses';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

/**
 * Replace templated values in a license with the values for the current
 * project and user.
 */
export function createAttributedLicense(licenseBody, currentUser, currentProject) {
  const currentYear = moment()
    .year()
    .toString();
  const name = currentUser ? currentUser.name() : '[NAME]';
  const projectName = currentProject ? currentProject.name() : undefined;
  const projectDescription = currentProject ? currentProject.description() : undefined;

  let email = '[EMAIL]';
  if (currentUser && currentUser.primaryEmail()) {
    // Arguably using destructuring here would make this line more confusing.
    // eslint-disable-next-line prefer-destructuring
    email = currentUser.primaryEmail().email;
  }

  return licenseBody
    .replace(/(\[YEAR\])+/g, currentYear)
    .replace(/(\[year\])+/g, currentYear)
    .replace(/(\[yyyy\])+/g, currentYear)
    .replace(/(<year>)+/g, currentYear)
    .replace(/(\[NAME\])+/g, name)
    .replace(/(\[name of copyright owner\])+/g, name)
    .replace(/(<name of author>)+/g, name)
    .replace(/(\[fullname\])+/g, name)
    .replace(/(\[GOVERNING_BODY\])+/g, email)
    .replace(/(\[EMAIL\])+/g, email)
    .replace(/(\[COMMUNITY_NAME\])+/g, projectName)
    .replace(/(<program>)+/g, projectName)
    .replace(/(<one line to give the program's name and a brief idea of what it does.>)+/g, projectDescription);
}

export default function LicenseItem({ license }) {
  const application = useApplication();
  const currentLicense = useObservable(application.currentLicense);
  const currentUser = useObservable(application.currentUser);
  const currentProject = useObservable(application.currentProject);

  const [loading, setLoading] = useState(false);

  /**
   * Change the project's current license when clicking the list item.
   */
  async function handleClickLicenseItem(_e) {
    setLoading(true);

    // Update package.json with the new license
    application.packageUtils.updatePackageLicense(license.spdxId);

    // Update the LICENSE file with the new license.
    try {
      const { body: licenseBody } = await application.getLicenseOrCodeOfConductBody('license', license);
      const attributedLicenseBody = createAttributedLicense(licenseBody, currentUser, currentProject);
      application.selectedFile().content(attributedLicenseBody);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      application.closeAllPopOvers();
    }
  }

  // Render
  const isCurrentLicense = currentLicense && currentLicense.name === license.name;
  return (
    /* ESLINT-CLEAN-UP */
    /* eslint-disable-next-line */
    <li className={`result ${isCurrentLicense ? 'active' : ''}`} onClick={handleClickLicenseItem}>
      {projectLicenses[0].name === license.name && <div className="result-tip">recommended</div>}

      <div className="result-name">{license.name}</div>

      {loading && (
        <div className="result-loader">
          <Loader />
        </div>
      )}

      <div className="result-description">{license.description}</div>
    </li>
  );
}
