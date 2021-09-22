import classNames from 'classnames';
import React from 'react';

import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';

import { css, StyleSheet, Button, SvgButton } from '@coursera/coursera-ui';
import AuthoringTrackedButton from 'bundles/authoring/common/components/tracked/AuthoringTrackedButton';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Box from 'bundles/internal-enrollment/components/Box';
import PhoenixModal from 'bundles/phoenix/components/Modal';

import 'css!./__styles__/Modal';

type TitleProps = {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  leftAlignHeading?: boolean;
  rowAlignHeading?: boolean;
};

const styles = StyleSheet.create({
  subHeading: {
    color: '#5E5E5E',
    fontSize: 14,
    lineHeight: '1em',
    marginTop: 12,
  },
});

class Title extends React.Component<TitleProps> {
  renderTitle() {
    const { icon, children, leftAlignHeading, rowAlignHeading } = this.props;
    const iconContainer = <div className="icon-container">{icon}</div>;
    const title = <div>{children}</div>;
    const titleContent = (
      <CdsMigrationTypography variant="h1semibold" component="h2" cuiComponentName="H2">
        {icon && iconContainer}
        {title}
      </CdsMigrationTypography>
    );

    if (rowAlignHeading) {
      return (
        <Box horizontal alignItemsStart>
          {icon && <div className="m-r-1">{iconContainer}</div>}
          <CdsMigrationTypography
            variant="h1semibold"
            component="h2"
            cuiComponentName="H2"
            style={{ textAlign: 'left' }}
          >
            {title}
          </CdsMigrationTypography>
        </Box>
      );
    } else if (leftAlignHeading) {
      return <div className="align-left">{titleContent}</div>;
    } else {
      return (
        <Box vertical alignItemsVerticalCenter>
          {titleContent}
        </Box>
      );
    }
  }

  render() {
    return (
      <div className="rc-AuthorModalTitle">
        <div className="authoring-modal-title">{this.renderTitle()}</div>
      </div>
    );
  }
}

type FooterProps = {
  onConfirm?: () => void;
  onCancel?: () => void;

  hideCancel?: boolean;
  hideConfirm?: boolean;

  disableCancel?: boolean;
  disableConfirm?: boolean;

  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;

  useConfirmDanger?: boolean;
  trackingName?: string | undefined | null;

  confirmIcon?: React.ReactElement | undefined | null;
};

class Footer extends React.Component<FooterProps> {
  static defaultProps = {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    trackingName: null,
  };

  render() {
    let ConfirmButton;
    if (this.props.trackingName) {
      ConfirmButton = AuthoringTrackedButton;
    } else if (this.props.confirmIcon) {
      ConfirmButton = SvgButton;
    } else {
      ConfirmButton = Button;
    }

    return (
      <div className="rc-AuthorModalFooter">
        <div className="footer-actions">
          {!this.props.hideCancel && (
            <Button type="secondary" size="md" onClick={this.props.onCancel} disabled={this.props.disableCancel}>
              {this.props.cancelLabel}
            </Button>
          )}

          {!this.props.hideConfirm && (
            <ConfirmButton
              type="primary"
              size="md"
              onClick={this.props.onConfirm}
              rootClassName={classNames({ danger: this.props.useConfirmDanger })}
              disabled={this.props.disableConfirm}
              trackingName={this.props.trackingName as string} // only needed when ConfirmButton is <AuthoringTrackedButton>
              svgElement={this.props.confirmIcon} // only needed when svgButton
            >
              {this.props.confirmLabel}
            </ConfirmButton>
          )}
        </div>
      </div>
    );
  }
}

export type ModalProps = {
  className?: string;
  dataE2E?: string;
  dataPendo?: string;

  allowClose?: boolean;
  allowStaticBackdrop?: boolean;

  heading: string;
  subHeading?: React.ReactNode;
  titleIcon?: React.ReactNode;
  leftAlignHeading?: boolean;
  rowAlignHeading?: boolean;
  modalName?: string;

  withTitle?: boolean;
  withFooter?: boolean;

  cancelLabel?: React.ReactNode;
  onCancel?: (isFromClickingX?: boolean) => void;

  hideConfirm?: boolean;
  hideCancel?: boolean;
  disableConfirm?: boolean;

  confirmLabel?: React.ReactNode;
  onConfirm?: () => void;
  useConfirmDanger?: boolean;
  trackingName?: string | undefined | null; // uses the AuthoringTrackedButton for the confirm action when passed in
  confirmIcon?: React.ReactElement | undefined | null;
  children?: React.ReactNode;
  'data-js'?: string;

  skipCancelModal?: boolean;
};

class Modal extends React.Component<ModalProps> {
  static defaultProps = {
    allowClose: true,
    useConfirmDanger: false,
    trackingName: null,
  };

  handleClose = () => {
    // pass `true` to indicate onCancel was called from clicking 'x', not cancel button
    this.props.onCancel?.(true);
  };

  render() {
    const {
      className,
      heading,
      subHeading,
      leftAlignHeading,
      rowAlignHeading,
      allowClose,
      allowStaticBackdrop,
      children,
      withTitle,
      titleIcon,
      withFooter,
      onCancel,
      onConfirm,
      confirmLabel,
      cancelLabel,
      hideCancel,
      hideConfirm,
      disableConfirm,
      useConfirmDanger,
      trackingName,
      confirmIcon,
    } = this.props;

    return (
      <PhoenixModal
        className={classNames('rc-AuthorModal', className)}
        modalName={heading}
        handleClose={this.handleClose}
        data-js={this.props['data-js']}
        data-e2e={this.props.dataE2E}
        dataPendo={this.props.dataPendo}
        allowClose={allowClose}
        allowStaticBackdrop={allowStaticBackdrop}
      >
        {withTitle && (
          <Title icon={titleIcon} leftAlignHeading={leftAlignHeading} rowAlignHeading={rowAlignHeading}>
            {heading}
            {subHeading && <div {...css(styles.subHeading)}>{subHeading}</div>}
          </Title>
        )}

        <div className="authoring-modal-body">{children}</div>

        {withFooter && (
          <Footer
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            hideCancel={hideCancel}
            hideConfirm={hideConfirm}
            disableConfirm={disableConfirm}
            useConfirmDanger={useConfirmDanger}
            trackingName={trackingName}
            confirmIcon={confirmIcon}
          />
        )}
      </PhoenixModal>
    );
  }
}

export default Modal;
