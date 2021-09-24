import React from 'react';
import Box from '../../../shared/Box';
import Heading from '../../../shared/Heading';
import Icon from '../../../shared/Icon';
import { If } from '../../../shared/If';
import Image from '../../../shared/Image';
import { LinkText } from '../../../shared/Link';
import { Mask } from '../../../shared/Mask';
import { Modal } from '../../../shared/Modal';
import { ModalContentSimple } from '../../../shared/ModalContentSimple';
import Text from '../../../shared/Text';
import {
  // @ts-ignore
  appStoreLink,
  // @ts-ignore
  isAndroidChrome,
  // @ts-ignore
  isIOS,
  // @ts-ignore
  playStoreLink,
} from './../../../../helpers/serverRenderingUtils';
// @ts-ignore
import styles from './../styles.sass';

const TextSpace = ({}) => <>{` `}</>;

interface CallEndedOrFullProps {
  isShowingLeaveConfirmationModal: boolean;
  isUserLoggedIn: boolean;
  onPressDoneRecordingConfirmation: any;
  scene: 'ended' | 'full';
  podcastName: string;
  podcastCreatorUserName: string;
  coverartImageUrl: string;
}

const CallEndedOrFull = ({
  isShowingLeaveConfirmationModal,
  isUserLoggedIn,
  onPressDoneRecordingConfirmation,
  scene,
  podcastName,
  podcastCreatorUserName,
  coverartImageUrl,
}: CallEndedOrFullProps) => (
  <Box
    width="100%"
    smPaddingLeft={33}
    smPaddingRight={33}
    mdPaddingRight={33}
    mdPaddingLeft={33}
  >
    <Box
      display="flex"
      justifyContent="center"
      width="100%"
      smPaddingBottom={20}
      mdPaddingBottom={20}
      lgPaddingBottom={32}
      smPaddingTop={24}
      mdPaddingTop={24}
      lgPaddingTop={53}
    >
      <Box maxWidth={600} width="100%">
        <Heading
          sizeAtSmScreen="sm"
          sizeAtMdScreen="md"
          sizeAtLgScreen="md"
          color="#292F36"
          isBold={true}
          align="center"
        >
          {podcastName}
        </Heading>
      </Box>
    </Box>
    <Box display="flex" justifyContent="center" width="100%">
      <Box maxWidth={650} width="100%">
        <Text color="#7F8287" size="xl" align="center">
          This recording
          <TextSpace />
          <If
            condition={Boolean(podcastCreatorUserName)}
            ifRender={() => (
              <React.Fragment>
                with
                <TextSpace />
                <Text
                  color="#7F8287"
                  size="xl"
                  align="center"
                  isInline={true}
                  isBold={true}
                >
                  {`${podcastCreatorUserName}`}
                </Text>
                <TextSpace />
              </React.Fragment>
            )}
          />
          {scene === 'full'
            ? 'is already full'
            : scene === 'ended'
            ? 'has already ended'
            : ''}
          .
        </Text>
      </Box>
    </Box>
    <If
      condition={isIOS() || isAndroidChrome()}
      ifRender={() => (
        <Box display="flex" justifyContent="center" width="100%" marginTop={20}>
          <Box maxWidth={650} width="100%">
            <Text color="#7F8287" size="xl" align="center">
              Try inviting friends to your own recording from the
              <TextSpace />
              <LinkText
                to={isIOS() ? appStoreLink() : playStoreLink()}
                color="purple"
                target="_blank"
                isInline={true}
              >
                Anchor mobile app
              </LinkText>
              !
            </Text>
          </Box>
        </Box>
      )}
    />
    <Box>
      <Box display="flex" justifyContent="center" marginTop={45}>
        <Box width={140} height={140}>
          <Mask
            isFullWidth={true}
            isFullHeight={true}
            shape="rounded"
            boxShadow="0 2px 6px 0 rgba(0,0,0,0.4)"
          >
            <If
              condition={Boolean(coverartImageUrl)}
              ifRender={() => (
                <Image
                  width={140}
                  height={140}
                  imageUrl={coverartImageUrl}
                  retinaImageUrl={coverartImageUrl}
                />
              )}
              elseRender={() => (
                <Box
                  width="100%"
                  height="100%"
                  color="#DEDFE0"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box width={55}>
                    <Icon type="anchor_logo" fillColor="white" />
                  </Box>
                </Box>
              )}
            />
          </Mask>
        </Box>
      </Box>
    </Box>
    <Modal
      dialogClassName={styles.modalDialog}
      isShowing={isShowingLeaveConfirmationModal}
      renderContent={() => (
        <ModalContentSimple
          title="You're done recording"
          renderBody={() => (
            <Box>
              <Text size="lg" color="#5F6369" align="center">
                Nice job! That sounded great.
              </Text>
            </Box>
          )}
          primaryButton={{
            onClick: () => {
              onPressDoneRecordingConfirmation(isUserLoggedIn);
            },
            text: 'Ok, thanks',
          }}
        />
      )}
    />
  </Box>
);

export { CallEndedOrFull };
