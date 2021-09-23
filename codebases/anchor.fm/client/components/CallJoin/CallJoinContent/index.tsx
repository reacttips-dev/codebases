import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import RecordingNotSupported from '../../../screens/VoiceMessageCreationModalScreen/components/RecordingNotSupported';
import Box from '../../../shared/Box';
import { ButtonWithHoverAndPress } from '../../../shared/Button';
import Heading from '../../../shared/Heading';
import Icon from '../../../shared/Icon';
import { If } from '../../../shared/If';
import Image from '../../../shared/Image';
import Input from '../../../shared/Input';
import { Linkable, LinkText } from '../../../shared/Link';
import { Mask } from '../../../shared/Mask';
import { Modal } from '../../../shared/Modal';
import Recordable from '../../../shared/Recordable';
import Text from '../../../shared/Text';
// tslint:disable-next-line:no-var-requires
import {
  // @ts-ignore
  appStoreLink,
  // @ts-ignore
  isAndroidChrome,
  // @ts-ignore
  isIOS,
  // @ts-ignore
  playStoreLink,
} from '../../../../helpers/serverRenderingUtils';

const styles = require('./CallJoinContent.sass');

export type RecordableProps = {
  isReadyForRecording: boolean;
  availableMicrophoneLabels: string[];
  currentMicrophoneLabel: string;
  isMicrophoneBlocked: boolean;
  isFetchingMicrophones: boolean;
  isRecordingSupported: boolean;
  selectMicrophoneWithLabel: any;
  startRecording: any;
  stopRecording: any;
  isRecording: any;
  durationInMs: any;
  reFetchMicrophones: any;
  getMicrophoneWithLabel: any;
};

interface CallJoinContentProps {
  isUserLoggedIn: boolean;
  podcastName: string;
  podcastCreatorUserName: string;
  loggedInUserName: string;
  notLoggedInUserName: string;
  email: string;
  onSubmit: any;
  onChangeDisplayName: any;
  onChangeEmail: any;
  onChangeMicrophone: any;
  coverartImageUrl: string;
  isFetching: boolean;
  onCloseErrorModal: any;
  isErrorModalOpen: boolean;
  onReadyForRecording: any;
}

const CallJoinContent = ({
  isUserLoggedIn,
  podcastCreatorUserName,
  loggedInUserName,
  notLoggedInUserName,
  podcastName,
  onSubmit,
  onChangeDisplayName,
  onChangeMicrophone,
  coverartImageUrl,
  onChangeEmail,
  email,
  isFetching,
  onCloseErrorModal,
  isErrorModalOpen,
  onReadyForRecording,
}: CallJoinContentProps) => (
  <Box
    display="flex"
    width="100%"
    justifyContent="center"
    className={styles.wrapper}
    smPaddingTop={24}
    mdPaddingTop={33}
    lgPaddingTop={33}
    smPaddingBottom={24}
    mdPaddingBottom={33}
    lgPaddingBottom={33}
    color="white"
  >
    <form
      onSubmit={evt => {
        evt.preventDefault();
        evt.stopPropagation();
        onSubmit();
      }}
    >
      <Recordable
        // @ts-ignore
        onReadyForRecording={microphone => {
          onReadyForRecording(microphone);
        }}
      >
        {({
          isReadyForRecording,
          availableMicrophoneLabels,
          currentMicrophoneLabel,
          selectMicrophoneWithLabel,
          isMicrophoneBlocked,
          isFetchingMicrophones,
          isRecordingSupported,
          reFetchMicrophones,
          getMicrophoneWithLabel,
        }: RecordableProps) => (
          <Box width="100%" color="white" marginBottom={15}>
            <If
              condition={isErrorModalOpen}
              ifRender={() => (
                <Modal
                  isShowing={isErrorModalOpen}
                  onClickClose={onCloseErrorModal}
                  isShowingCloseButton={true}
                  dialogClassName={styles.microphoneAccessRequiredModalDialog}
                  renderContent={() => (
                    <Box>
                      <Box display="flex" justifyContent="center">
                        <Box width={67}>
                          <Icon type="AnchorAppIcon" />
                        </Box>
                      </Box>
                      <If
                        condition={isIOS() || isAndroidChrome()}
                        ifRender={() => (
                          <>
                            <Box
                              smMarginTop={10}
                              mdPaddingTop={10}
                              lgPaddingTop={10}
                              mdPaddingBottom={10}
                              lgPaddingBottom={10}
                            >
                              <Text size="lg" color="#5F6369" align="center">
                                We’re having trouble connecting to this browser.
                                Please try another browser or download the free
                                <LinkText
                                  target="_blank"
                                  onClick={() => {}}
                                  isInline={true}
                                  to={
                                    isIOS() ? appStoreLink() : playStoreLink()
                                  }
                                  color="gray"
                                  isIncludingSpacesAround={true}
                                >
                                  Anchor mobile app
                                </LinkText>
                                to join this call.
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              marginTop={22}
                            >
                              <Linkable
                                to={
                                  isIOS()
                                    ? appStoreLink()
                                    : isAndroidChrome()
                                    ? playStoreLink()
                                    : ''
                                }
                              >
                                <Box width={177}>
                                  <Icon
                                    type={
                                      isIOS()
                                        ? 'AppleAppStoreBadgeIcon'
                                        : isAndroidChrome
                                        ? 'GoogleAppStoreBadgeIcon'
                                        : 'none'
                                    }
                                  />
                                </Box>
                              </Linkable>
                            </Box>
                          </>
                        )}
                        elseRender={() => (
                          <Box
                            smMarginTop={10}
                            mdPaddingTop={10}
                            lgPaddingTop={10}
                            mdPaddingBottom={10}
                            lgPaddingBottom={10}
                          >
                            <Text size="lg" color="#5F6369" align="center">
                              We’re having trouble connecting to this browser.
                              Please try another browser or download the free
                              {` `}
                              <Text
                                size="lg"
                                color="#5F6369"
                                isBold={true}
                                isInline={true}
                              >
                                Anchor mobile app
                              </Text>
                              {` `}
                              to join this call.
                            </Text>
                          </Box>
                        )}
                      />
                    </Box>
                  )}
                />
              )}
              elseRender={() => (
                <If
                  condition={isMicrophoneBlocked}
                  ifRender={() => (
                    <Modal
                      isShowing={isMicrophoneBlocked}
                      dialogClassName={
                        styles.microphoneAccessRequiredModalDialog
                      }
                      renderContent={() => (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                          width="100%"
                          padding={10}
                        >
                          <Box maxWidth={589} width="100%">
                            <Box paddingTop={9} paddingBottom={9}>
                              <Heading size="sm" align="center" isBold={true}>
                                Microphone access required
                              </Heading>
                            </Box>
                            <Box paddingTop={9} paddingBottom={9}>
                              <Text
                                size="xl"
                                align="center"
                                color="rgba(41, 47, 54, 0.6)"
                              >
                                We’ve detected that Anchor does not have
                                permissions to record from this browser. To fix
                                this, please allow anchor.fm to access your
                                microphone. (You can find this in your browser
                                settings.)
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              marginTop={20}
                            >
                              <Linkable to="https://help.anchor.fm/hc/en-us/requests/new">
                                <Text
                                  size="lg"
                                  color="#5f6369"
                                  align="center"
                                  isBold={true}
                                >
                                  Still not working? Contact Anchor support
                                </Text>
                              </Linkable>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    />
                  )}
                />
              )}
            />
            <If
              condition={!isRecordingSupported}
              ifRender={() => (
                <Modal
                  contentClassName={styles.modalContent}
                  dialogClassName={`${styles.modalDialog} ${styles.recordingNotSupportedModalDialog}`}
                  isShowing={!isRecordingSupported}
                  renderContent={() => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      height="100%"
                      width="100%"
                      paddingTop={35}
                      paddingBottom={120}
                      paddingLeft={10}
                      paddingRight={10}
                    >
                      <RecordingNotSupported
                        link={window.location.href}
                        headingText="Open in Safari to join this recording"
                        bodyText="Unfortunately, recording isn't supported from within this app. To join recording, follow these quick steps:"
                        onDidPressCopyLink={() => {}}
                        onComponentDidMount={() => {}}
                      />
                    </Box>
                  )}
                />
              )}
            />
            <Box
              display="flex"
              justifyContent="center"
              smMarginBottom={7}
              mdMarginBottom={7}
              lgMarginBottom={16}
              paddingLeft={36}
              paddingRight={36}
            >
              <Box maxWidth={913} width="100%">
                <Heading
                  sizeAtSmScreen="sm"
                  sizeAtMdScreen="md"
                  sizeAtLgScreen="md"
                  isBold={true}
                  align="center"
                  color="#292F36"
                >
                  {podcastName}
                </Heading>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              smMarginBottom={14}
              mdMarginBottom={14}
              lgMarginBottom={20}
              paddingLeft={36}
              paddingRight={36}
            >
              <Box maxWidth={696} width="100%">
                <Text
                  sizeAtSmScreen="lg"
                  sizeAtMdScreen="lg"
                  sizeAtLgScreen="xl"
                  color="#7F8287"
                  align="center"
                >
                  You’ve been invited to join a recording for this podcast by{' '}
                  <Text
                    sizeAtSmScreen="lg"
                    sizeAtMdScreen="lg"
                    sizeAtLgScreen="xl"
                    color="#7F8287"
                    align="center"
                    isBold={true}
                    isInline={true}
                  >
                    {podcastCreatorUserName}
                  </Text>
                </Text>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              isHidingAtSmScreen={true}
              isHidingAtMdScreen={true}
            >
              <Box
                smHeight={72}
                smWidth={72}
                mdHeight={100}
                mdWidth={100}
                lgHeight={100}
                lgWidth={100}
                marginBottom={25}
                marginLeft={36}
                marginRight={36}
              >
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
                        smHeight={72}
                        smWidth={72}
                        mdHeight={100}
                        mdWidth={100}
                        lgHeight={100}
                        lgWidth={100}
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
            <If
              condition={!isUserLoggedIn}
              ifRender={() => (
                <Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom={16}
                    paddingLeft={36}
                    paddingRight={36}
                  >
                    <Box maxWidth={398} width="100%">
                      <Box>
                        <Box marginBottom={8}>
                          <Text size="lg" color="#292F36">
                            Your name
                          </Text>
                        </Box>
                        <Box
                          borderColor="#DEDFE0"
                          borderWidth={2}
                          shape="rounded"
                        >
                          <Mask shape="rounded">
                            <Input
                              shape="rounded"
                              onChange={(value: string) => {
                                onChangeDisplayName(value);
                              }}
                              fontSize={16}
                              value={notLoggedInUserName}
                              paddingLeft={0}
                              paddingRight={0}
                            />
                          </Mask>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom={16}
                    paddingLeft={36}
                    paddingRight={36}
                  >
                    <Box maxWidth={398} width="100%">
                      <Box>
                        <Box marginBottom={8}>
                          <Text size="lg" color="#292F36">
                            Your email (optional)
                          </Text>
                        </Box>
                        <Box
                          borderColor="#DEDFE0"
                          borderWidth={2}
                          shape="rounded"
                        >
                          <Mask shape="rounded">
                            <Input
                              fontSize={16}
                              type="email"
                              shape="rounded"
                              onChange={(value: string) => {
                                onChangeEmail(value);
                              }}
                              value={email}
                              paddingLeft={0}
                              paddingRight={0}
                            />
                          </Mask>
                        </Box>
                        <Box marginTop={8}>
                          <Text size="sm" color="#7F8287">
                            We’ll notify you if this gets published in an
                            episode!
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            />
            <Box
              marginTop={25}
              marginBottom={25}
              paddingLeft={36}
              paddingRight={36}
            >
              {availableMicrophoneLabels.length ? (
                <Box display="flex" justifyContent="center">
                  <Box maxWidth={398} width="100%">
                    <div>
                      <Box marginBottom={8}>
                        <Text size="lg" color="#292F36">
                          Choose microphone
                        </Text>
                      </Box>
                      <div className={styles.control}>
                        <DropdownButton
                          onClick={() => {
                            reFetchMicrophones();
                          }}
                          onSelect={(microphoneLabel: any) => {
                            selectMicrophoneWithLabel(microphoneLabel);
                            getMicrophoneWithLabel(microphoneLabel).then(
                              (microphone: any) => {
                                onChangeMicrophone(microphone.deviceId);
                              }
                            );
                          }}
                          title={
                            isFetchingMicrophones
                              ? 'Loading...'
                              : currentMicrophoneLabel || ''
                          }
                          id="Input Dropdown"
                        >
                          {availableMicrophoneLabels.map(
                            (microphoneLabel: any) => (
                              <MenuItem
                                eventKey={microphoneLabel}
                                key={microphoneLabel}
                              >
                                {microphoneLabel}
                              </MenuItem>
                            )
                          )}
                        </DropdownButton>
                      </div>
                    </div>
                  </Box>
                </Box>
              ) : null}
            </Box>
            <Box>
              <If
                condition={isUserLoggedIn}
                ifRender={() => (
                  <Box
                    display="flex"
                    justifyContent="center"
                    paddingLeft={36}
                    paddingRight={36}
                  >
                    <Box maxWidth={300} width="100%">
                      <Box>
                        <Text
                          color="#292F36"
                          align="center"
                          size="lg"
                        >{`You're joining as ${loggedInUserName}`}</Text>
                      </Box>
                    </Box>
                  </Box>
                )}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              marginBottom={15}
              marginTop={18}
              paddingLeft={36}
              paddingRight={36}
            >
              <Box maxWidth={300} width="100%">
                <ButtonWithHoverAndPress
                  isProcessing={isFetchingMicrophones || isFetching}
                  isDisabled={
                    !notLoggedInUserName || isFetching || !isReadyForRecording
                  }
                  shape="pill"
                  type="unelevated"
                  colorTheme="red"
                  text="Join Recording"
                  size="md"
                  isFullWidth={true}
                  typeAttribute="submit"
                  isEventBubblingAllowed={true}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="center">
              <Box width="100%" maxWidth={237}>
                <Text color="#7F8287" align="center">
                  By continuing, you agree to our{' '}
                  <LinkText
                    target="_blank"
                    onClick={() => {}}
                    isInline={true}
                    to="/tos"
                    color="gray"
                  >
                    Terms of Service
                  </LinkText>{' '}
                  and{' '}
                  <LinkText
                    target="_blank"
                    onClick={() => {}}
                    isInline={true}
                    color="gray"
                    to="/privacy"
                  >
                    Privacy Policy
                  </LinkText>
                  .
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Recordable>
    </form>
  </Box>
);

export { CallJoinContent, CallJoinContentProps };
