import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Modal } from 'shared/Modal';
import { Button } from 'shared/Button/NewButton';
import { WaveformAudioInfo } from 'screens/EpisodeScreen/context';
import {
  SAIModalContext,
  useAdInsertionContext,
} from 'components/AdInsertion/context';
import styles from 'screens/EpisodeScreen/components/AdInsertion/WaveformModal/styles.sass';
import { ValidationError } from '../../CuePoints/types';
import { SAIWaveform } from '../Waveform';
import { ErrorBanner } from './ErrorBanner';

type SAIWaveformModalProps = {
  duration: number;
  waveformAudioInfo: WaveformAudioInfo;
  onClickClose: () => void;
};

export function SAIWaveformModal({
  duration,
  waveformAudioInfo,
  onClickClose,
}: SAIWaveformModalProps) {
  const [cuePointErrors, setCuePointErrors] = useState<
    ValidationError[] | undefined
  >(undefined);
  const { clearErrors } = useAdInsertionContext();

  useEffect(
    () => () => {
      // clear errors when destroying view
      clearErrors();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <SAIModalContext.Provider value={{ setCuePointErrors }}>
      <Modal
        isShowing={true}
        onClickClose={onClickClose}
        dialogClassName={styles.modalDialog}
        contentClassName={`${styles.modalContent} ${css`
          padding: 0;
        `}`}
        renderContent={() => (
          <Container>
            <TopNavContainer>
              <Header>Ad Insertion</Header>
            </TopNavContainer>
            {waveformAudioInfo?.caption && (
              <Breadcrumbs>
                <span className="home">Ad Insertion</span>
                <span className="right-carat">&gt;</span>
                <span>{waveformAudioInfo.caption}</span>
              </Breadcrumbs>
            )}

            <div>
              <SAIWaveform
                duration={duration}
                waveformAudioInfo={waveformAudioInfo}
              />
            </div>

            <Footer>
              <div
                className={css`
                  div[role='alert']:last-of-type {
                    border-bottom: none;
                  }
                `}
              >
                {cuePointErrors &&
                  cuePointErrors.map(err => (
                    <ErrorBanner
                      error={err}
                      clearErrors={clearErrors}
                      key={`${err.type}-${err.message}`}
                    />
                  ))}
              </div>
              <FooterButtonContainer>
                <Button color="purple" onClick={onClickClose}>
                  Done
                </Button>
              </FooterButtonContainer>
            </Footer>
          </Container>
        )}
      />
    </SAIModalContext.Provider>
  );
}

const Container = styled.div`
  height: 150vh;
`;

const TopNavContainer = styled.div`
  width: 100%;
  background: #292f36;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Breadcrumbs = styled.div`
  display: flex;
  margin: 30px 40px 15px;
  align-items: center;
  font-size: 1.4rem;
  .home {
    font-weight: bold;
  }
  .right-carat {
    margin: 0 10px;
    color: #c9cbcd;
  }
`;

const Header = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;
  padding: 20px 0;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const FooterButtonContainer = styled.div`
  background: #ffffff;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 24px 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
`;
