/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import _ from 'underscore';
import classnames from 'classnames';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography, Theme } from '@coursera/cds-core';

import CollapsibleMessage from 'bundles/ui/components/cds/CollapsibleMessage';
import InstructorImage from 'bundles/course-v2/components/InstructorImage';
import { Instructor } from 'bundles/course-v2/types/Course';

import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';

import connectToStores from 'js/lib/connectToStores';
import UserAgentInfo from 'js/lib/useragent';

import { color, SvgButton } from '@coursera/coursera-ui';
import { SvgClose } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-v2';

import 'css!./../__styles__/InstructorNote';

type State = {
  collapsed: boolean;
};

type PropsFromCaller = {
  theme: Theme;
  note: string;
  instructors: Array<Instructor>;
  canDismiss?: boolean;
  title: string;
  onDismiss?: () => void;
};

type PropsFromStores = {
  userAgent: UserAgentInfo;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

const NOTE_COLLAPSE_LENGTH = 250;

class InstructorNote extends React.Component<PropsToComponent, State> {
  state = { collapsed: !this.props.userAgent.isMobileBrowser };

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };

  lessAriaLabel = _t('Show less instructor welcome note');

  moreAriaLabel = _t('Show more instructor welcome note');

  render() {
    const { collapsed } = this.state;
    const { note, instructors, canDismiss, onDismiss, title, theme } = this.props;

    const paragraphRegex = /<p>(.*?)<\/p>/g;

    let collapsedNote = '';
    let toggleTruncate = false;

    const instructorProfileClasses = classnames(
      'horizontal-box align-items-left align-items-vertical-center instructor-profile',
      { 'instructor-profile--many': instructors.length > 1 }
    );

    // render the first <p> tag if it is the first element in the note and if not the first `NOTE_COLLAPSE_LENGTH` characters of the note
    // so only visible content is focused and announced
    if (note.indexOf('<p>') === 0) {
      collapsedNote = note.match(paragraphRegex)?.[0] || '';
    } else {
      toggleTruncate = true;
      collapsedNote = note.length > NOTE_COLLAPSE_LENGTH ? `${note.slice(0, NOTE_COLLAPSE_LENGTH)}...` : note;
    }

    return (
      <CollapsibleMessage
        cardSpacing="roomy"
        className="rc-InstructorNote"
        gradientColor="none"
        isInitiallyCollapsed={collapsed}
        onToggleClick={this.handleToggle}
        showToggle={note.length > NOTE_COLLAPSE_LENGTH}
        moreAriaLabel={this.moreAriaLabel}
        lessAriaLabel={this.lessAriaLabel}
        toggleIconColor="#2A73CC"
        hideTruncated={toggleTruncate}
      >
        {canDismiss && (
          <SvgButton
            rootClassName="nostyle dismiss"
            type="icon"
            size="zero"
            aria-label={_t('Dismiss instructor note')}
            svgElement={<SvgClose size={24} color={color.secondaryText} hoverColor={color.black} />}
            onClick={onDismiss}
          />
        )}

        <Typography
          variant="h2semibold"
          css={css`
            margin: ${theme?.spacing(0, 0, 24, 0)};
          `}
        >
          {title}
        </Typography>

        {instructors.length > 0 && (
          <div className={instructorProfileClasses}>
            {instructors.map((instructor) => (
              <InstructorImage key={instructor.id} instructor={instructor} />
            ))}
            {instructors.length === 1 && (
              <div
                className="instructor-name"
                aria-label={_t('Instructor #{instructor} note', { instructor: instructors[0].fullName })}
              >
                <Typography>{instructors[0].fullName}</Typography>
              </div>
            )}
          </div>
        )}

        {/* eslint-disable react/no-danger */}

        <Typography
          component="div"
          key={_('message_').uniqueId()} // This needs a key to re-render properly.
          dangerouslySetInnerHTML={{ __html: collapsed ? collapsedNote : note }}
        />

        {/* eslint-enable react/no-danger */}
      </CollapsibleMessage>
    );
  }
}

export default connectToStores<PropsToComponent, PropsFromCaller, ApplicationStoreClass>(
  [ApplicationStoreClass],
  (ApplicationStore, props) => ({
    ...props,
    userAgent: ApplicationStore.getUserAgent(),
  })
)(InstructorNote);
