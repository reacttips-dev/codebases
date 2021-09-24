import React from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import useObservable from '../hooks/useObservable';

export default function ProjectItem({ project }) {
  const avatar = useObservable(project.avatar);
  const domain = useObservable(project.domain);
  const description = useObservable(project.description);
  const isPrivate = useObservable(project.private);

  return (
    <>
      {avatar ? <img className="avatar" src={avatar} alt={`Avatar for project ${domain}`} /> : <Icon icon="bentoBox" />}
      <div className="result-name">
        {isPrivate && <span className="private-icon" />}
        {domain}
      </div>
      <div className="result-description">{description}</div>
    </>
  );
}
