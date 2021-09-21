import { Global } from '@emotion/core';
import { ThreeDotMenu } from 'components/EpisodeEditorPublish/components/InteractivePoll/ThreeDotMenu';
import { SpotifyLogo } from 'components/svgs/SpotifyLogo';
import { useFetchPoll } from 'hooks/useInteractivityPolls';
import { POLL_STATUS_DISPLAY_COPY } from 'modules/AnchorAPI/v3/episodes/fetchInteractivityPoll';
import React, { useState } from 'react';
import { Modal } from 'shared/Modal';
import { InteractivePollForm } from '../InteractivePollForm';
import {
  BootstrapModifiers,
  CopyContainer,
  FormContainer,
  InteractivePollContainer,
  OpenModalButton,
  Optional,
  RoundedCard,
  ModalTitle,
  QuestionTitle,
  StatusText,
  Title,
  TopBarContainer,
  BootstrapModalMargin,
} from './styles';

export function InteractivePoll({
  episodeId,
  userId,
}: {
  episodeId: string;
  userId: number;
}) {
  const { data, status } = useFetchPoll(episodeId);
  const [isOpen, setIsOpen] = useState(false);
  if (!data || status === 'loading') return null;
  const { polls = [] } = data;
  const poll = polls[0] || {};

  return (
    <InteractivePollContainer>
      <Global styles={[BootstrapModifiers, BootstrapModalMargin]} />
      <Title>Polls</Title> <Optional>(Only available on Spotify)</Optional>
      <RoundedCard>
        <CopyContainer>
          <TopBarContainer>
            <SpotifyLogo width={63} />
            {poll.id && (
              <ThreeDotMenu
                episodeId={episodeId}
                userId={userId}
                status={poll.status}
              />
            )}
          </TopBarContainer>
          <QuestionTitle>
            {polls.length
              ? poll.question
              : `Engage with listeners directly from your episode with Polls`}
          </QuestionTitle>
          {poll.id && (
            <StatusText>
              Status: {POLL_STATUS_DISPLAY_COPY[poll.status]}
            </StatusText>
          )}
        </CopyContainer>
        <OpenModalButton
          kind="button"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          color="purple"
        >
          {polls.length ? 'Edit poll' : 'Add a poll'}
        </OpenModalButton>
      </RoundedCard>
      {isOpen && (
        <Modal
          isShowing={true}
          isShowingCloseButton
          onClickOutside={() => setIsOpen(false)}
          onClickClose={() => setIsOpen(false)}
          renderContent={() => (
            <FormContainer>
              <ModalTitle>
                {polls.length ? 'Edit' : 'Add a new'} poll
              </ModalTitle>
              <InteractivePollForm
                onSuccess={() => setIsOpen(false)}
                poll={poll}
                episodeId={episodeId}
              />
            </FormContainer>
          )}
        />
      )}
    </InteractivePollContainer>
  );
}
