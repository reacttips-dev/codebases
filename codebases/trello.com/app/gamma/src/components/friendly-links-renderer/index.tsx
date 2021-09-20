import React, { AnchorHTMLAttributes } from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import {
  SmartLinkAnalyticsContextProvider,
  SmartLinkAnalyticsContext,
} from 'app/src/components/SmartMedia';

import { renderComponent } from 'app/src/components/ComponentWrapper';
import { FriendlyLink } from './friendly-link';

import styles from './styles.less';

export const FRIENDLY_LINKS_CONTAINER_CLASS = 'js-friendly-links';

export class FriendlyLinksRenderer extends React.PureComponent {
  static contextType = SmartLinkAnalyticsContext;

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);

    if (element instanceof Element) {
      const anchorTags = element.querySelectorAll(
        `.${FRIENDLY_LINKS_CONTAINER_CLASS} a`,
      );

      for (const anchorTag of anchorTags) {
        const parent = anchorTag.parentNode;
        const child = anchorTag.childNodes[0];

        if (!parent || !child) {
          return;
        }

        const container = document.createElement('span');
        container.classList.add(styles.reactRootWrapper);
        parent.insertBefore(container, anchorTag);

        const props = {} as AnchorHTMLAttributes<HTMLAnchorElement>;

        [...anchorTag.attributes].forEach(({ nodeName, value }) => {
          props[
            nodeName as keyof AnchorHTMLAttributes<HTMLAnchorElement>
          ] = value;
        });
        props.children = child.nodeValue;

        // This inserts a FriendlyLink into the DOM via ReactDOM.render
        // while retaining Gamma's app context (redux store, router, etc.)
        renderComponent(
          <SmartLinkAnalyticsContextProvider value={this.context}>
            <FriendlyLink {...props} />
          </SmartLinkAnalyticsContextProvider>,
          container,
        );
        parent.removeChild(anchorTag);
      }
    }
  }

  render() {
    return this.props.children;
  }
}
