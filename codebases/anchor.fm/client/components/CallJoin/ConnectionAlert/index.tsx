/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { Fragment, useEffect, useState } from 'react';

const TRANSITION_SPEED = '300ms';

export function ConnectionAlert() {
  const [showSecondaryAlert, setShowSecondaryAlert] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSecondaryAlert(true);
    }, 20000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  function getAlertText(text: string | JSX.Element) {
    return <p css={alertTextCss}>{text}</p>;
  }
  function getContent() {
    return showSecondaryAlert ? (
      <Fragment>
        {getAlertText('Trouble connecting?')}
        {getAlertText('Try leaving and rejoining the recording.')}
      </Fragment>
    ) : (
      <div>
        {getAlertText(
          <Fragment>
            For the best recording, everyone should be{' '}
            <strong>connected</strong>.
          </Fragment>
        )}
      </div>
    );
  }
  return (
    <div css={getAlertContainerCss(showSecondaryAlert)}>{getContent()}</div>
  );
}

const enterAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0px, 10px, 0px);
  }

  100% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
`;

function getAlertContainerCss(showSecondaryAlert: boolean) {
  return css`
    background-color: ${showSecondaryAlert ? '#5000b9' : '#7F8287'};
    border-radius: 8px;
    max-width: 300px;
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-bottom: 20px;
    flex-direction: column;
    padding: 20px;
    transition: background-color ${TRANSITION_SPEED};
    animation: ${enterAnimation} ${TRANSITION_SPEED};
  `;
}

const alertTextCss = css`
  font-size: 1.4rem;
  line-height: 1.8rem;
  color: #fff;
  transition: color ${TRANSITION_SPEED};
  text-align: center;
`;
