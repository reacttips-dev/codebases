import React from 'react';
import initBem from 'js/lib/bem';
import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';

import EmbeddedLink from './EmbeddedLink';
import { EmbeddedContentProps } from './EmbeddedContent';

const bem = initBem('OembeddedContent');

type Props = EmbeddedContentProps & {
  apiUrl: string;
};

type State = {
  oembedHtml?: string;
  hasError: boolean;
};

export class OembeddedContent extends React.Component<Props, State> {
  state: State = {
    oembedHtml: undefined,
    hasError: false,
  };

  componentDidMount() {
    const { url, apiUrl } = this.props;
    fetch(`${apiUrl}?format=json&url=${url}&iframe=true`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          oembedHtml: data.html,
        });
      })
      .catch(() => {
        this.setState({
          hasError: true,
        });
      });
  }

  render() {
    const { title, url } = this.props;
    const { oembedHtml, hasError } = this.state;
    if (hasError) {
      return <EmbeddedLink title={title} url={url} />;
    } else if (!oembedHtml) {
      return <CenteredLoadingSpinner />;
    }

    return (
      <div className={bem()}>
        <div>{title}</div>
        {/* eslint-disable react/no-danger */}
        <div
          dangerouslySetInnerHTML={{
            __html: oembedHtml,
          }}
        />
      </div>
    );
  }
}

export default OembeddedContent;
