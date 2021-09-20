import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBoardBannerListQuery } from './BoardBannerListQuery.generated';
import { useDismissBannerMutation } from './DismissBannerMutation.generated';

interface MemberBanner {
  id: string;
  message: string;
  url?: string;
  dismissible: boolean;
}

interface Options {
  skip?: boolean;
}

export function useBoardBannerList({ skip = false }: Options = {}) {
  const { data } = useBoardBannerListQuery({
    skip,
    variables: {
      memberId: 'me',
    },
  });
  const me = data?.member;

  const [dismissBanner] = useDismissBannerMutation();
  const [banners, setBanners] = useState<MemberBanner[]>([]);
  const [oneTimeMessagesDismissed, setOneTimeMessagesDismissed] = useState<
    string[]
  >([]);

  const handleDismissClick = useCallback(
    async (bannerToDismiss: MemberBanner) => {
      // add banner to oneTimeMessagesDismissed array
      setOneTimeMessagesDismissed((prevState) =>
        prevState.concat(bannerToDismiss.id),
      );

      // POST to the /oneTimeMessagesDismissed endpoint
      await dismissBanner({
        variables: {
          memberId: 'me',
          messageId: bannerToDismiss.id,
        },
      });
    },
    [dismissBanner],
  );

  const filteredBanners: MemberBanner[] = useMemo(() => {
    if (!banners) {
      return [];
    }
    return banners.filter((banner) => {
      // must not be dismissed already
      return !oneTimeMessagesDismissed?.includes(banner.id);
    });
  }, [banners, oneTimeMessagesDismissed]);

  const shouldRenderBanner = useMemo(() => filteredBanners.length > 0, [
    filteredBanners,
  ]);

  useEffect(() => {
    if (!me) {
      return;
    }

    if (me.banners) {
      let banners = me.banners as MemberBanner[];
      if (me.oneTimeMessagesDismissed) {
        banners = banners.filter(
          (banner) => !me.oneTimeMessagesDismissed?.includes(banner.id),
        );
        setOneTimeMessagesDismissed(me.oneTimeMessagesDismissed);
      }
      setBanners(banners);
    }
  }, [me]);

  return {
    banners: filteredBanners,
    me,
    handleDismissClick,
    shouldRenderBanner,
    oneTimeMessagesDismissed,
  };
}
