import React from 'react';
import { Helmet } from 'react-helmet';
import URI from 'jsuri';
import { getDefaultImageHref } from 'bundles/seo/utils/courseraMetatagsUtils';

type Props = {
  children?: any;
  url: string;
};

class MetatagsWrapper extends React.Component<Props> {
  render() {
    const { url } = this.props;
    const uri = new URI(url);
    // Remove query params, fragment, trailing slash from the url
    const defaultCanonicalUrl = new URI()
      .setProtocol(uri.protocol())
      .setHost(uri.host())
      .setPath(uri.path())
      .toString()
      .replace(/\/$/, '');

    const defaultMeta = {
      title: 'Coursera | Online Courses From Top Universities. Join for Free',
      meta: [
        {
          name: 'description',
          content:
            '3,000+ courses from schools like Stanford and Yale - no application required. Build career skills in data science, computer science, business, and more.',
        },
        {
          name: 'image',
          content: getDefaultImageHref(),
        },

        {
          property: 'og:title',
          content: 'Coursera | Online Courses From Top Universities. Join for Free',
        },
        {
          property: 'og:description',
          content:
            '3,000+ courses from schools like Stanford and Yale - no application required. Build career skills in data science, computer science, business, and more.',
        },
        { property: 'og:url', content: url },
        {
          property: 'og:image',
          content: getDefaultImageHref(),
        },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'canonical', href: defaultCanonicalUrl }],
    };

    return (
      <div className="rc-MetatagsWrapper">
        <Helmet {...defaultMeta} />
        {this.props.children}
      </div>
    );
  }
}

export default MetatagsWrapper;
