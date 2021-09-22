import React, { Component } from 'react';
import classNames from 'classnames';

import { TrackedA } from 'bundles/page/components/TrackedLink2';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { TranslationModal } from 'bundles/interactive-transcript';

import _t from 'i18n!nls/translation';

import 'css!./__styles__/VolunteerLink';

type Props = {
  courseId?: string;
  linkTrackingName: string;
  modalTrackingName: string;
  onClick?: () => void;
  className?: string;
  linkClassName?: string;
  children?: any;
  style?: { [styleAttr: string]: string | number };
  linkStyle?: { [styleAttr: string]: string | number };
  href?: string;
};

type State = {
  showModal: boolean;
};

class VolunteerLink extends Component<Props, State> {
  static defaultProps = {
    children: _t('Volunteer to translate subtitles for this course'),
    useDefaultTextStyle: true,
    href: '#',
  };

  state = {
    showModal: false,
  };

  openModal = (e: Event) => {
    const { onClick } = this.props;
    e.preventDefault();
    e.stopPropagation();

    this.setState({ showModal: true });

    if (onClick) {
      onClick();
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      courseId,
      linkTrackingName,
      modalTrackingName,
      className,
      linkClassName,
      children,
      style,
      linkStyle,
      href,
    } = this.props;

    const { showModal } = this.state;

    return (
      <span className={classNames('rc-VolunteerLink', className)} style={style}>
        <TrackedA
          href={href}
          style={linkStyle}
          onClick={this.openModal}
          trackingName={linkTrackingName}
          className={classNames(linkClassName)}
        >
          {children}
        </TrackedA>

        {showModal && (
          <TranslationModal courseId={courseId} trackingName={modalTrackingName} onClose={this.closeModal} />
        )}
      </span>
    );
  }
}

export default VolunteerLink;
