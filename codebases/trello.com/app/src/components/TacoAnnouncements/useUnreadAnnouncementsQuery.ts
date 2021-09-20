import { useState, useEffect } from 'react';
import { useAnnouncementsQuery } from './AnnouncementsQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { AnnouncementType } from '@trello/graphql/generated';
import {
  TacoStyle,
  TEN_MINUTES,
  getUnreadAnnouncements,
  Announcement,
} from './helpers';

/*
 * This unfortunate hook is a workaround to a limitation with the GraphQL hooks.
 * I have this query setup on a pollInterval, and I need to update multiple
 * pieces of state in response to the data as it changes from the polling.
 * Apollo provides an `onComplete` callback you can pass to your query hook,
 * but it only gets called on the initial fetch, not subsequent polling fetches.
 * What we ultimately need to do here is update the unreadAnnouncements with
 * the responses from the API, and maintain the style of the Taco talk bubble.
 * If the API ever returns a downtime announcement, we need Taco to stay in his
 * red alert style - even after that message has been dismissed, and the new
 * responses from the API no longer return anything.
 */
export const useUnreadAnnouncementsQuery = ({ skip }: { skip: boolean }) => {
  const [tacoStyle, setTacoStyle] = useState<TacoStyle>(TacoStyle.Normal);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState<
    Announcement[]
  >([]);
  const { data } = useAnnouncementsQuery({
    skip,
    pollInterval: TEN_MINUTES,
  });

  const resetUnreadAnnouncements = () => {
    setUnreadAnnouncements([]);
  };

  useEffect(() => {
    const newAnnouncements = getUnreadAnnouncements(data?.announcements ?? []);
    if (tacoStyle !== TacoStyle.Maintenance) {
      setTacoStyle(
        newAnnouncements.filter(
          (a: Announcement) => a.type === AnnouncementType.Downtime,
        ).length > 0
          ? TacoStyle.Maintenance
          : TacoStyle.Normal,
      );
    }
    setUnreadAnnouncements(newAnnouncements);
  }, [data, tacoStyle]);

  return {
    unreadAnnouncements,
    tacoStyle,
    resetUnreadAnnouncements,
  };
};
