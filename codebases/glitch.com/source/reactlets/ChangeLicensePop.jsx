import React from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import projectLicenses from '../data/project-licenses';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import LicenseItem from './LicenseItem';

export default function ChangeLicensePop() {
  const application = useApplication();
  const changeLicensePopVisible = useObservable(application.changeLicensePopVisible);

  if (!changeLicensePopVisible) {
    return null;
  }

  return (
    <dialog className="pop-over change-license-pop wide-pop">
      <section className="info">
        <h1>
          Change License <Icon icon="scales" />
        </h1>
      </section>

      <section className="actions results-list">
        <ul className="results">
          {projectLicenses.map((license) => (
            <LicenseItem key={license.name} license={license} />
          ))}
        </ul>
      </section>

      <section className="info">
        <p>
          <a href="https://choosealicense.com/licenses/" target="_blank" rel="noopener noreferrer">
            More licenses
          </a>
        </p>
      </section>
    </dialog>
  );
}
