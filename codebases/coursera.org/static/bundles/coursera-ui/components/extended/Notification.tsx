/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

// svg icons
import ActionInfo from 'bundles/coursera-ui/components/svg/coursera/common/ActionInfo';
import AlertWarning from 'bundles/coursera-ui/components/svg/coursera/common/AlertWarning';
import ActionCheckCircle from 'bundles/coursera-ui/components/svg/coursera/common/ActionCheckCircle';
import AlertError from 'bundles/coursera-ui/components/svg/coursera/common/AlertError';
import NavClose from 'bundles/coursera-ui/components/svg/coursera/common/NavigationClose';

// components
import Button from 'bundles/coursera-ui/components/basic/Button';

// style helpers
import { StyleSheet, css, color, zIndex, spacing, font } from '@coursera/coursera-ui';
import { lighten } from 'bundles/coursera-ui/utils/colorUtils';

// common styles based on type
function getTypeStyles(type: $TSFixMe) {
  return {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    backgroundColor: lighten(color[type], 0.85),
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    border: `1px solid ${color[type]}`,
  };
}

const styles = StyleSheet.create({
  Notification: {
    width: '100%',
    padding: spacing.sm,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: zIndex.md,
    fontSize: font.xs,
  },
  icon: {
    padding: spacing.sm,
  },
  message: {
    paddingLeft: spacing.sm,
  },
  messageNoIcon: {
    paddingLeft: 0,
  },
  action: {
    padding: spacing.sm,
  },
  dismiss: {
    marginLeft: 'auto',
  },
  info: getTypeStyles('info'),
  warning: getTypeStyles('warning'),
  success: getTypeStyles('success'),
  danger: getTypeStyles('danger'),
});

// map icon type to component
const ICON_MAP = {
  info: ActionInfo,
  warning: AlertWarning,
  danger: AlertError,
  success: ActionCheckCircle,
};

/**
 * A customizable Notification component to show a message with an optional
 * call-to-action and an optional dismiss.
 */
class Notification extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']), // used to infer colors and icon
    icon: PropTypes.node, // customized icon,
    iconSize: PropTypes.number, // size of icon in px
    hideIcon: PropTypes.bool,
    header: PropTypes.node, // we may need to display a title or some timestamps on top
    content: PropTypes.node, // body of notification (we can use Expandable/TextTruncate)
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // notification message
    isDismissible: PropTypes.bool, // whether to allow dismissing the notification
    onDismiss: PropTypes.func, // callback when notification is dismissed
    dismissAfter: PropTypes.number, // time in milliseconds to wait before dismissing notification
    action: PropTypes.node, // CTA node for the notification
    onAction: PropTypes.func, // callback for CTA node

    /* eslint-disable react/forbid-prop-types */
    htmlAttributes: PropTypes.object,
    style: PropTypes.object, // Override the inline-styles of the root element
    /* // eslint-enable react/forbid-prop-types */

    isThemeDark: PropTypes.bool,
    isLite: PropTypes.bool, // lite version of notification, with minimum styling
  };

  static defaultProps = {
    type: 'info',
    htmlAttributes: {},
    style: {},
    hideIcon: false,
    iconSize: 21,
    message: '',
    isDismissible: false,
    action: null,
    isThemeDark: false,
    isLite: false,
  };

  renderIcon = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { type, iconSize } = this.props;
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const Icon = ICON_MAP[type];

    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return <Icon size={iconSize} color={color[type]} />;
  };

  renderMessage = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'message' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { message, hideIcon } = this.props;

    return <span {...css(hideIcon ? styles.messageNoIcon : styles.message)}>{message}</span>;
  };

  renderAction() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message
    return <Button type="link" size="sm" label={this.props.action} onClick={this.props.onAction} />;
  }

  renderDismiss() {
    return (
      <div className="notification-dismiss" {...css(styles.dismiss)}>
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'onDismiss' does not exist on type 'Reado... Remove this comment to see the full error message */}
        <Button size="sm" type="link" onClick={this.props.onDismiss}>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'iconSize' does not exist on type 'Readon... Remove this comment to see the full error message */}
          <NavClose size={this.props.iconSize} />
        </Button>
      </div>
    );
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
    const { htmlAttributes, style, type, isLite } = this.props;

    return (
      <div {...htmlAttributes} {...css(styles.Notification, !isLite && styles[type])} style={style}>
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'hideIcon' does not exist on type 'Readon... Remove this comment to see the full error message */}
        {!this.props.hideIcon && this.renderIcon()}
        {this.renderMessage()}
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'action' does not exist on type 'Readonly... Remove this comment to see the full error message */}
        {this.props.action && this.renderAction()}
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'isDismissible' does not exist on type 'R... Remove this comment to see the full error message */}
        {this.props.isDismissible && this.renderDismiss()}
      </div>
    );
  }
}

export default Notification;
