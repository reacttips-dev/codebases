/* eslint-disable import/no-default-export, @trello/disallow-filenames */
import React, { AnchorHTMLAttributes } from 'react';

import { TestId } from '@trello/test-ids';
import { navigate } from 'app/scripts/controller/navigate';
import { navigationState } from 'app/gamma/src/components/header/navigationState';
import { sendErrorEvent } from '@trello/error-reporting';

export interface RouterLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  testId?: TestId;
  forwardedRef?: React.Ref<HTMLAnchorElement>;
}

const differentUrl = (href: string): boolean => {
  return href !== window.location.href.replace(window.location.origin, '');
};

export class RouterLink extends React.Component<RouterLinkProps> {
  private onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { onClick, href, target } = this.props;

    if (!href) {
      return;
    }

    // If the Cmd or Control key is pressed during the click, or in safari, this is
    // a middle-click, honor the event and bypass the router
    const isMetaClick = e.ctrlKey || e.metaKey || (e.button && e.button !== 0);
    // If the target is set to a new window, honor the event and bypass the
    // router
    const isTargetBlank = target === '_blank';

    if (onClick) {
      // Make sure an error in the handler doesn't accidentally break SPA
      // transitions
      try {
        onClick(e);
      } catch (err) {
        sendErrorEvent(err);
      }
    }

    if (!e.defaultPrevented && !isMetaClick && !isTargetBlank) {
      e.preventDefault();
      // We only update navigation state if there is a URL and the URL is
      // different to the current location. If we update navigation state and
      // the destination is the same, then the loading icon in the header will
      // begin spinning and never stop.
      const relativeLink = href?.replace(window.location.origin, '');
      if (relativeLink && differentUrl(relativeLink)) {
        navigationState.setValue({
          isNavigating: true,
        });
      }

      try {
        navigate(relativeLink, {
          trigger: true,
        });
      } catch (err) {
        // can't pushState an external link, so it's easier to let it fail and use window.location
        window.location.href = href as string;
      }
    }
  };

  render() {
    // Destructure non-native anchor attributes, so that we don't spread them
    // to the anchor below
    const { children, testId, forwardedRef, ...rest } = this.props;

    return (
      // TODO:
      // The 'react-a11y-event-has-role' lint rule requires an element with an
      // event handler to have a 'role' attribute. An anchor has an implied
      // role of "link" per the spec, figure out why this is failing and turn
      // the rule back on.
      //
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <a
        {...rest}
        onClick={this.onClick}
        data-test-id={testId}
        ref={forwardedRef}
      >
        {children}
      </a>
    );
  }
}

export default React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (props, ref) => {
    return <RouterLink {...props} forwardedRef={ref} />;
  },
);
