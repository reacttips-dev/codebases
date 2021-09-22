/** @jsx jsx */
import React from 'react';
import ReactModal from 'react-modal';
import { css, jsx } from '@emotion/react';
import connectToRouter from 'js/lib/connectToRouter';
import type { Theme } from '@coursera/cds-core';
import { Grid, Typography, PageGridContainer } from '@coursera/cds-core';
import { ArrowPreviousIcon, ArrowNextIcon } from '@coursera/cds-icons';
import { TunnelVision } from '@coursera/coursera-ui';
import _t from 'i18n!nls/compound-assessments';
import { isUserRightToLeft } from 'js/lib/language';

import LeaveConfirmModal from 'bundles/compound-assessments/components/modals/cds/LeaveConfirmModal';

type Props = {
  onClose: () => void;
  shouldConfirmClose?: boolean;
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;
  topBanner?: React.ReactNode;
  children: React.ReactNode;
  backbuttonAriaLabel?: string;
  ariaLabel?: string;
};

type State = {
  isOpen: boolean;
  showLeaveConfirmModal: boolean;
  storedClose?: (() => void) | null;
};

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;
const PAGE_UP_KEY = 33;
const PAGE_DOWN_KEY = 34;
const HOME_KEY = 36;
const END_KEY = 35;

const styles = {
  headerRight: (theme: Theme) =>
    css({
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
      },
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'left',
        marginTop: theme.spacing(16),
        marginBottom: theme.spacing(12),
      },
      alignItems: 'center',
    }),
  headerLeft: (theme: Theme) =>
    css({
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(16),
      },
    }),
  tunnelVisionContentContainer: css({
    overflow: 'scroll',
    width: '100%',
  }),
  closeElementContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  closeElementBackText: (theme: Theme) =>
    css({
      marginLeft: theme.spacing(8),
      color: theme.palette.blue[600],
    }),
  tunnelVision: (theme: Theme) =>
    css({
      '.rc-TunnelVisionClose': {
        backgroundColor: theme?.palette.white,
        ':hover': {
          backgroundColor: theme?.palette.blue[50],
        },
        [theme.breakpoints.up('md')]: {
          marginLeft: theme.spacing(48),
        },
        [theme.breakpoints.down('sm')]: {
          marginLeft: theme.spacing(16),
        },
      },
    }),
};

export const TUNNELVISIONWRAPPER_CONTENT_ID = 'TUNNELVISIONWRAPPER_CONTENT_ID';
export class TunnelVisionWrapper extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
    showLeaveConfirmModal: false,
    storedClose: null,
  };

  componentDidMount() {
    // Need to call ReactModal.setAppElement on CSR when DOM is ready before opening ReactModal
    ReactModal.setAppElement('#rendered-content');
    this.setState({
      isOpen: true,
    });
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    const { contentRef, scrollPage } = this;
    if (contentRef) {
      const currentPosition = contentRef.scrollTop;
      switch (e.keyCode) {
        case ARROW_UP_KEY: {
          if (currentPosition <= 0) {
            return;
          }
          scrollPage(currentPosition - 50);
          break;
        }
        case PAGE_UP_KEY: {
          if (currentPosition <= 0) {
            return;
          }
          scrollPage(currentPosition - contentRef.clientHeight);
          break;
        }
        case HOME_KEY: {
          scrollPage(0);
          break;
        }
        case ARROW_DOWN_KEY: {
          if (currentPosition >= contentRef.scrollHeight) {
            return;
          }
          scrollPage(currentPosition + 50);
          break;
        }
        case PAGE_DOWN_KEY: {
          if (currentPosition >= contentRef.scrollHeight) {
            return;
          }
          scrollPage(currentPosition + contentRef.clientHeight);
          break;
        }
        case END_KEY: {
          scrollPage(contentRef.scrollHeight);
          break;
        }
        default:
          break;
      }
    }
  };

  handleLeaveConfirm = () => {
    const { storedClose } = this.state;

    this.setState({ showLeaveConfirmModal: false, storedClose: null });
    if (storedClose) {
      storedClose();
    }
  };

  handleLeaveCancel = () => {
    this.setState({ showLeaveConfirmModal: false, storedClose: null });
  };

  scrollPage = (newPosition: $TSFixMe) => {
    const { contentRef } = this;
    if (contentRef) {
      contentRef.scrollTo(0, newPosition);
    }
  };

  contentRef: HTMLElement | null = null;

  shouldAllowClose = (close?: () => void): boolean => {
    const { shouldConfirmClose } = this.props;

    if (shouldConfirmClose) {
      this.setState({ showLeaveConfirmModal: true, storedClose: close });
      return false;
    }
    return true;
  };

  render() {
    const { onClose, headerLeft, headerRight, topBanner, children, ariaLabel, backbuttonAriaLabel } = this.props;
    const { isOpen, showLeaveConfirmModal } = this.state;
    return (
      <ReactModal
        // style required so the tunnelvision is above the page header
        style={{
          overlay: {
            position: 'relative',
            zIndex: 4000,
          },
        }}
        isOpen={isOpen}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
        css={styles.tunnelVision}
      >
        <TunnelVision
          {...{
            disableKeyPress: true,
            onClose,
            // note: refer to CUI source code for comments on how this feature functions
            shouldAllowClose: this.shouldAllowClose,
            ariaLabel,
            backbuttonAriaLabel,
            closeElement: (
              // the following component is a way to mimic CDS Button due to the limitation of the
              // CUI TunnelVision closeElement
              // using CUI button here will create double focus
              <div css={styles.closeElementContainer}>
                {!isUserRightToLeft() && <ArrowPreviousIcon color="interactive" />}
                <Typography variant="h3bold" component="div" css={styles.closeElementBackText}>
                  {_t('Back')}
                </Typography>
                {isUserRightToLeft() && (
                  <ArrowNextIcon
                    color="interactive"
                    css={(theme: Theme) =>
                      css({
                        marginLeft: theme.spacing(8),
                      })
                    }
                  />
                )}
              </div>
            ),
            headerElement: (
              <Grid
                container
                justify="space-between"
                css={(theme: Theme) =>
                  css({
                    marginLeft: theme.spacing(16),
                  })
                }
              >
                <Grid item sm={9} lg={10} xs={12} css={styles.headerLeft}>
                  {headerLeft}
                </Grid>
                <Grid item sm={3} lg={2} xs={12} justify="flex-start" css={styles.headerRight}>
                  {headerRight}
                </Grid>
              </Grid>
            ),
          }}
        >
          <div css={styles.tunnelVisionContentContainer} id={TUNNELVISIONWRAPPER_CONTENT_ID}>
            {topBanner && (
              <div role="alert" aria-live="assertive">
                {topBanner}
              </div>
            )}
            <PageGridContainer>
              <Grid item container justify="center">
                <Grid
                  item
                  lg={8}
                  xs={12}
                  css={(theme: Theme) =>
                    css({
                      marginTop: theme.spacing(32),
                    })
                  }
                >
                  <div
                    ref={(ref) => {
                      this.contentRef = ref;
                    }}
                  >
                    <div>{children}</div>
                  </div>
                </Grid>
              </Grid>
            </PageGridContainer>
          </div>

          {showLeaveConfirmModal && (
            <LeaveConfirmModal
              onPrimaryButtonClick={this.handleLeaveConfirm}
              onCancelButtonClick={this.handleLeaveCancel}
            />
          )}
        </TunnelVision>
      </ReactModal>
    );
  }
}

export const withRouterOnClose = connectToRouter<Props, Omit<Props, 'onClose'> & { onCloseRouteName: string }>(
  (router, { onCloseRouteName }) => ({
    onClose: () => {
      router.push({
        name: onCloseRouteName,
        params: router.params,
        query: router.location.query,
      });
    },
  })
);

export default withRouterOnClose(TunnelVisionWrapper);
