import React, { useRef } from 'react';
import styled from 'styled-components';
import sample from 'lodash/sample';
import { Loader } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

const TIPS = [
  'Click “Show” to see your app',
  'Drag in images and files to add them to your project',
  'Search for and add third party libraries in package.json',
  'Securely store app secrets and config in .env',
  'Collaborate live with friends by inviting them to your project',
  'Rewind to fix mistakes and catch up on changes',
  'Turn your code into a perfectly formatted masterpiece with the "Format This File" button',
];

const RecaptchaNotice = styled.p`
  position: absolute;
  bottom: 45px;
  font-size: 12px;
  margin: 0;
  padding: 0 2rem;
  text-align: center;
  color: var(--variable-shim-text-on-secondary-background);

  a {
    color: inherit;
  }
`;

export default function ProjectLoading() {
  const application = useApplication();
  const projectIsLoaded = useObservable(application.projectIsLoaded);
  const randomTip = useRef();
  if (!randomTip.current) {
    randomTip.current = sample(TIPS);
  }

  if (projectIsLoaded) {
    return null;
  }

  return (
    <section className="blank-slate blank-slate-full-width">
      <div className="welcome-message">
        <p>
          <strong>Loading Project</strong>
        </p>
        <Loader />
        <p>
          <em>Glitch Tip!</em>
          <br />
          {randomTip.current}
        </p>
      </div>
      <RecaptchaNotice>
        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </RecaptchaNotice>
    </section>
  );
}
