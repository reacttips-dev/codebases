import { compose, lifecycle } from 'recompose';

import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import { createCustomUrlPromise } from 'bundles/sharing-common/utils/utils';

const MOCK_HOSTNAME = 'mock.dev-coursera.org';

type InputProps = {
  targetShareLink: string;
  useCustomUrl?: boolean;
};

type Props = InputProps & {
  customShareLink?: string;
};

// create a custom URL on page load (custom URL's are generated via an md5 hash of the targetShareUrl)
const withCustomUrl = () => {
  return compose<Props, InputProps>(
    deferToClientSideRender,
    lifecycle({
      componentDidMount() {
        const { targetShareLink, useCustomUrl } = this.props as Props;

        // Guard against making calls on dev, customUrls.v1 will fail if domain isn't production
        if (useCustomUrl && window.location.hostname !== MOCK_HOSTNAME) {
          createCustomUrlPromise(targetShareLink).then((resp) => {
            const { customShareLink } = resp as { customShareLink: string };

            this.setState({
              customShareLink,
            });
          });
        }
      },
    })
  );
};

export default withCustomUrl;
