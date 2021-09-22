import React from 'react';
import URI from 'jsuri';

import connectToRouter, { InjectedRouter } from 'js/lib/connectToRouter';

import ShareButtonWithModal, {
  PropsFromCaller as ShareButtonWithModalProps,
} from 'bundles/sharing-common/components/modal/ShareButtonWithModal';
import ShareCTAV2 from 'bundles/sharing-common/components/modal/buttons/ShareCTAV2';

type Props = ShareButtonWithModalProps & {
  isDark?: boolean;
};

type Router = InjectedRouter & {
  location: {
    protocol: string;
    hostname: string;
  };
};

type PropsFromRouter = Props & {
  router: Router;
};

const ShareButtonWithModalVideo: React.FunctionComponent<PropsFromRouter> = (props) => {
  const { router, isDark } = props;
  const {
    location: { protocol, hostname },
    params: { courseSlug, item_id: itemId, slug },
  } = router;

  const shareLink = new URI()
    .setProtocol(protocol)
    .setHost(hostname)
    .setPath(`/lecture/${courseSlug}/${slug}-${itemId}`)
    .toString();

  return (
    <ShareButtonWithModal {...props} shareLink={shareLink}>
      <ShareCTAV2 isDark={isDark} />
    </ShareButtonWithModal>
  );
};

export default connectToRouter<{ router: Router }, Props>((router) => ({ router }))(ShareButtonWithModalVideo);
