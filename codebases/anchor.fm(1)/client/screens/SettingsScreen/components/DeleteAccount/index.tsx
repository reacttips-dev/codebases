/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import { Button } from '../../../../shared/Button/NewButton';
import { SectionHeading } from '../SettingsForm/styles';
import {
  DeleteAccountParagraph,
  DeleteContainerCss,
  OverridePanelCss,
} from './styles';

export function DeleteAccount() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div css={OverridePanelCss}>
      <Panel
        onEnter={() => setShowDelete(true)}
        onExit={() => setShowDelete(false)}
        // @ts-ignore
        collapsible={true}
        header={
          <SectionHeading
            css={css`
              margin-bottom: 32px;
              @media (max-width: 600px) {
                margin-bottom: 36px;
              }
            `}
          >
            Delete account {showDelete ? '\u25BE' : '\u25B8'}
          </SectionHeading>
        }
        eventKey="1"
      >
        <div css={DeleteContainerCss}>
          <DeleteAccountParagraph>
            We hope you love using Anchor, but if you need to delete your
            account you can do that here. If you delete your account, your
            podcast and all of its content will be permanently removed and
            cannot be recovered.
          </DeleteAccountParagraph>
          <DeleteAccountParagraph>
            Unsure about deleting your account? Reach out to us for help at{' '}
            <a
              href="https://help.anchor.fm"
              target="_blank"
              rel="noopener noreferrer"
            >
              help.anchor.fm
            </a>
            .
          </DeleteAccountParagraph>
          <Button
            kind="link"
            href="/dashboard/delete"
            height={40}
            color="red"
            css={css`
              @media (max-width: 600px) {
                width: 100%;
              }
            `}
          >
            Delete my account
          </Button>
        </div>
      </Panel>
    </div>
  );
}
